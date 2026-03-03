import { useEffect, JSX } from 'react';
import type { GetServerSideProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreProvider,
  ComponentPropsContext,
  type SitecorePageProps,
  LayoutServiceData,
} from '@sitecore-content-sdk/nextjs';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { getSession } from '@auth0/nextjs-auth0';
import type { Session } from '@auth0/nextjs-auth0';

import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

import {
  ENTITLEMENTS_CLAIM,
  getRequiredAuth0EntitlementKeysForItem,
  userHasSomeRequiredKey,
} from 'lib/entitlements';
import { getNavMetadata } from 'lib/nav-metadata';
import { enrichNavTree, filterNavTree, type NavFields, type NavItem } from 'lib/nav-apply';
import { getNavigationFieldsFromLayout, setNavigationFieldsOnLayout } from 'lib/nav-layout';

function normalizeGuid(id: string): string {
  return id.trim().replace(/[{}]/g, '').toLowerCase();
}

function getUserEntitlements(session: Session | null | undefined): Record<string, boolean> {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim))
    return claim as Record<string, boolean>;
  return {};
}

const EMPLOYEE_EMAIL_DOMAIN = (process.env.ADP_EMPLOYEE_EMAIL_DOMAIN || 'adp.com').toLowerCase();
function isEmployee(session: Session | null | undefined): boolean {
  const email = (session?.user?.email as string | undefined)?.toLowerCase();
  return Boolean(email && email.endsWith(`@${EMPLOYEE_EMAIL_DOMAIN}`));
}

/**
 * ---- NEW: Fallback resolver for the NEW Experience Edge entitlements shape ----
 * Your Edge response shows:
 *   entitlements: { jsonValue: [ { fields: { Auth0: { value: "..." } } } ] }
 *
 * But lib/entitlements.ts still expects the OLD pipe-separated string.
 *
 * We DO NOT change that file here; we simply add this fallback ONLY in this page gating path.
 */
type GetDataFn = (query: string, variables: Record<string, unknown>) => Promise<unknown>;
function hasGetData(x: unknown): x is { getData: GetDataFn } {
  return typeof (x as { getData?: unknown })?.getData === 'function';
}
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

const PAGE_ENTITLEMENTS_JSONVALUE_QUERY = `
  query PageEntitlementsJsonValue($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      entitlements: field(name: "Entitlements") { jsonValue }
    }
  }
`;

async function getRequiredAuth0KeysForItem_FallbackJsonValue(
  itemId: string,
  language: string
): Promise<string[]> {
  if (!hasGetData(client)) return [];

  const rawUnknown = await client.getData(PAGE_ENTITLEMENTS_JSONVALUE_QUERY, {
    id: itemId,
    language,
  });
  const raw = isObject(rawUnknown) ? rawUnknown : {};

  const item = raw.item;
  if (!isObject(item)) return [];

  const entField = item.entitlements;
  if (!isObject(entField)) return [];

  const jsonValue = entField.jsonValue;
  if (!Array.isArray(jsonValue)) return [];

  const keys: string[] = [];
  for (const entItem of jsonValue) {
    if (!isObject(entItem)) continue;

    const fields = entItem.fields;
    if (!isObject(fields)) continue;

    const auth0 = fields.Auth0;
    if (!isObject(auth0)) continue;

    const v = asString(auth0.value);
    if (v && v.trim()) keys.push(v.trim());
  }

  return [...new Set(keys)];
}

function collectIds(fields: NavFields): string[] {
  const ids: string[] = [];
  const walk = (it: NavItem | undefined) => {
    if (!it) return;
    if (it.Id) ids.push(normalizeGuid(it.Id));
    if (Array.isArray(it.Children)) it.Children.forEach((c) => walk(c));
  };
  Object.values(fields).forEach((v) => walk(v));
  return [...new Set(ids)];
}

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) return <NotFound />;

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
        <Layout page={page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // auth-varying SSR
  context.res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  context.res.setHeader('Vary', 'Cookie');

  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const debug = process.env.NAV_DEBUG === '1' || context.query.navdebug === '1';

  const path = extractPath(context);

  const pageUnknown =
    context.preview && isDesignLibraryPreviewData(context.previewData)
      ? await client.getDesignLibraryData(context.previewData)
      : context.preview
        ? await client.getPreview(context.previewData)
        : await client.getPage(path, { locale: context.locale });

  if (!pageUnknown) return { props: {}, notFound: true };

  const page = pageUnknown as {
    layout?: unknown;
    locale?: string;
    siteName?: string;
  };

  const language = (context.locale || page.locale || 'en') as string;
  const isPreview = Boolean(context.preview);

  const session = await getSession(context.req, context.res);
  const entitlements = getUserEntitlements(session);
  const employee = isEmployee(session);

  // Editing/preview: show everything
  const isEditingOrPreview = Boolean(isPreview);

  // ---- 1) PAGE GATING ----
  const routeItemId = (
    page as unknown as { layout?: { sitecore?: { route?: { itemId?: string } } } }
  )?.layout?.sitecore?.route?.itemId;

  if (!isEditingOrPreview && routeItemId) {
    // KEEP existing logic, but make requiredKeys mutable so we can fallback if needed
    let requiredKeys = await getRequiredAuth0EntitlementKeysForItem(routeItemId, language);

    // NEW: if lib/entitlements returns [], try the new Experience Edge jsonValue array format
    if (requiredKeys.length === 0) {
      const fallbackKeys = await getRequiredAuth0KeysForItem_FallbackJsonValue(
        routeItemId,
        language
      );
      if (fallbackKeys.length > 0) requiredKeys = fallbackKeys;
    }

    if (debug) {
      console.log('[PAGE GATE]', {
        traceId,
        path,
        routeItemId: normalizeGuid(routeItemId),
        requiredKeys,
        employee,
      });
    }

    if (requiredKeys.length > 0 && !employee) {
      if (!session?.user) {
        const returnTo = encodeURIComponent(context.resolvedUrl || '/');
        return {
          redirect: { destination: `/api/auth/login?returnTo=${returnTo}`, permanent: false },
        };
      }

      const allowed = userHasSomeRequiredKey(requiredKeys, entitlements);
      if (!allowed) {
        // This is the "unauthorized screen" behavior you asked for
        return { redirect: { destination: '/unauthorized', permanent: false } };
      }
    }
  }

  // ---- 2) NAVIGATION ENRICH + FILTER (SSR -> no flicker) ----
  if (!isEditingOrPreview && page.layout) {
    const navFields = getNavigationFieldsFromLayout(page.layout);
    if (navFields) {
      const ids = collectIds(navFields);
      if (debug)
        console.log('[NAV SSR][FIELDS]', {
          traceId,
          navTopKeys: Object.keys(navFields).length,
          ids: ids.length,
        });

      const meta = await getNavMetadata({ itemIds: ids, language, debug, traceId });

      const enriched = enrichNavTree({
        fields: navFields,
        redirectMap: meta.redirectMap,
        requiredKeysMap: meta.requiredKeysMap,
        debug,
        traceId,
      });

      const filtered = filterNavTree({
        fields: enriched,
        userEntitlements: entitlements,
        isEditingOrPreview,
        isEmployee: employee,
        debug,
        traceId,
      });

      setNavigationFieldsOnLayout(page.layout, filtered);
      if (debug)
        console.log('[NAV SSR][DONE]', { traceId, returnedKeys: Object.keys(filtered).length });
    } else if (debug) {
      console.log('[NAV SSR][NO RENDERING FOUND]', { traceId });
    }
  }

  const props = {
    page: pageUnknown,
    dictionary: await client.getDictionary({
      site: (page.siteName || '') as string,
      locale: (page.locale || language) as string,
    }),
    componentProps: await client.getComponentData(
      page.layout as LayoutServiceData,
      context,
      components
    ),
  };

  return { props };
};

export default SitecorePage;
