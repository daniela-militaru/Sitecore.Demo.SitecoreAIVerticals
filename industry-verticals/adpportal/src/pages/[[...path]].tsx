// src/pages/[[...path]].tsx
import { useEffect, type JSX } from 'react';
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

import { ENTITLEMENTS_CLAIM } from 'lib/entitlements';
import { secureNavigationInLayout } from 'lib/nav-security';

// Sitecore field names
const ENTITLEMENTS_FIELD = 'Entitlements';
const ENTITLEMENT_ITEM_AUTH0_FIELD = 'Auth0';

// GraphQL queries (Delivery API safe)
const PAGE_ENTITLEMENTS_QUERY = `
  query PageEntitlements($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      entitlements: field(name: "${ENTITLEMENTS_FIELD}") { value }
    }
  }
`;

const ENTITLEMENT_ITEM_QUERY = `
  query EntitlementItem($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      auth0: field(name: "${ENTITLEMENT_ITEM_AUTH0_FIELD}") { value }
    }
  }
`;

function parsePipeSeparatedGuids(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * ---- No-`any` deep omit undefined (returns unknown) ----
 * Next.js SSR cannot serialize `undefined` anywhere inside props.
 */
function deepOmitUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => deepOmitUndefined(v));
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      out[k] = deepOmitUndefined(v);
    }

    return out;
  }

  return value;
}

/**
 * ---- client.getData typing + runtime guard (no `any`) ----
 */
type GetDataFn = (query: string, variables: Record<string, unknown>) => Promise<unknown>;

function hasGetData(x: unknown): x is { getData: GetDataFn } {
  return typeof (x as { getData?: unknown })?.getData === 'function';
}

type PageEntitlementsResult = {
  item?: {
    entitlements?: { value?: string | null };
  };
};

type EntitlementItemResult = {
  item?: {
    auth0?: { value?: string | null };
  };
};

function getUserEntitlements(session: Session | null | undefined): Record<string, boolean> {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as Record<string, boolean>;
  }
  return {};
}

function getItemIdFromLayout(layout: unknown): string | undefined {
  const l = layout as { sitecore?: { route?: { itemId?: string } } } | null;
  return l?.sitecore?.route?.itemId;
}

/**
 * Fetch required Auth0 entitlement keys for the page
 */
async function getRequiredAuth0EntitlementKeysForPage(
  pageItemId: string,
  language: string
): Promise<string[]> {
  if (!hasGetData(client)) {
    throw new Error(
      'client.getData(...) is not available. Ensure your Sitecore client exposes getData.'
    );
  }

  const pageResultUnknown = await client.getData(PAGE_ENTITLEMENTS_QUERY, {
    id: pageItemId,
    language,
  });

  const raw = (pageResultUnknown as PageEntitlementsResult)?.item?.entitlements?.value ?? null;

  const entitlementItemIds = parsePipeSeparatedGuids(raw);
  if (entitlementItemIds.length === 0) return [];

  const keys: string[] = [];
  for (const id of entitlementItemIds) {
    const entitlementUnknown = await client.getData(ENTITLEMENT_ITEM_QUERY, {
      id,
      language,
    });

    const value = (entitlementUnknown as EntitlementItemResult)?.item?.auth0?.value ?? null;

    if (typeof value === 'string' && value.trim().length > 0) {
      keys.push(value.trim());
    }
  }

  return keys;
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

type PageLike = {
  layout?: unknown;
  locale?: string;
  siteName?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Auth-varying SSR: don't let shared caches leak menu/page
  context.res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  context.res.setHeader('Vary', 'Cookie');

  const path = extractPath(context);

  let pageUnknown: unknown;

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    pageUnknown = await client.getDesignLibraryData(context.previewData);
  } else {
    pageUnknown = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }

  if (!pageUnknown) return { props: {}, notFound: true };

  const page = pageUnknown as PageLike;

  const isPreview = Boolean(context.preview);
  const language = (context.locale || page.locale || 'en') as string;
  const itemId = getItemIdFromLayout(page.layout);

  // Read session once; used for page gating + nav gating
  const session = await getSession(context.req, context.res);
  const userEntitlements = getUserEntitlements(session);

  // 1) PAGE ACCESS GATING
  if (!isPreview && itemId) {
    const requiredAuth0Keys = await getRequiredAuth0EntitlementKeysForPage(itemId, language);

    if (requiredAuth0Keys.length > 0) {
      if (!session?.user) {
        const returnTo = encodeURIComponent(context.resolvedUrl || '/');
        return {
          redirect: {
            destination: `/api/auth/login?returnTo=${returnTo}`,
            permanent: false,
          },
        };
      }

      const allowed = requiredAuth0Keys.some((key) => userEntitlements[key] === true);
      if (!allowed) {
        return { redirect: { destination: '/unauthorized', permanent: false } };
      }
    }
  }

  // 2) NAVIGATION GATING (SSR mutate layout -> no flicker)
  if (!isPreview && page.layout) {
    const securedLayout = await secureNavigationInLayout({
      layout: page.layout,
      language,
      userEntitlements,
      debug: true,
    });

    // Important: keep pageUnknown in sync with modified layout
    // We mutate `page` (which is a view on pageUnknown) by replacing layout field
    (page as { layout?: unknown }).layout = securedLayout;
  }

  const props = {
    page: pageUnknown,
    dictionary: await client.getDictionary({
      site: page.siteName ?? '',
      locale: page.locale ?? language,
    }),
    componentProps: await client.getComponentData(
      page.layout as LayoutServiceData,
      context,
      components
    ),
  };

  return { props: deepOmitUndefined(props) as typeof props };
};

export default SitecorePage;
