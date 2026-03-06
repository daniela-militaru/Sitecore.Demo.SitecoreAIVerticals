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

import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

import {
  getEntitlementsFromSession,
  getRolesFromSession,
  isUserAllowedForPage,
} from 'lib/entitlements';
import { getNavMetadata, type NavMetadata } from 'lib/nav-metadata';
import { enrichNavTree, filterNavTree, type NavFields, type NavItem } from 'lib/nav-apply';
import { getNavigationFieldsFromLayout, setNavigationFieldsOnLayout } from 'lib/nav-layout';

function normalizeGuid(id: string): string {
  return id.trim().replace(/[{}]/g, '').toLowerCase();
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
  const entitlements = getEntitlementsFromSession(session);
  const userRoles = getRolesFromSession(session);

  // Editing/preview: show everything
  const isEditingOrPreview = Boolean(isPreview);

  const routeItemId = (
    page as unknown as { layout?: { sitecore?: { route?: { itemId?: string } } } }
  )?.layout?.sitecore?.route?.itemId;

  // ---- 1) BATCH-FETCH NAV METADATA (includes current page so page gate can use cache) ----
  let navMeta: NavMetadata | null = null;
  if (!isEditingOrPreview && page.layout) {
    const navFields = getNavigationFieldsFromLayout(page.layout);
    if (navFields) {
      const ids = collectIds(navFields);
      if (routeItemId) ids.push(normalizeGuid(routeItemId));
      navMeta = await getNavMetadata({
        itemIds: [...new Set(ids)],
        language,
        debug,
        traceId,
      });
      if (debug)
        console.log('[NAV SSR][FIELDS]', {
          traceId,
          navTopKeys: Object.keys(navFields).length,
          ids: ids.length,
        });
    }
  }

  // ---- 2) PAGE GATING (cache hit when routeItemId was in nav batch) ----
  if (!isEditingOrPreview && routeItemId) {
    const { allowed, requiredKeys, requiredRoles } = await isUserAllowedForPage(
      routeItemId,
      language,
      entitlements,
      userRoles,
      session?.user?.sub
    );

    if (debug) {
      console.log('[PAGE GATE]', {
        traceId,
        path,
        routeItemId: normalizeGuid(routeItemId),
        requiredKeys,
        requiredRoles,
        allowed,
      });
    }

    if (requiredKeys.length > 0 || requiredRoles.length > 0) {
      if (!session?.user) {
        const returnTo = encodeURIComponent(context.resolvedUrl || '/');
        return {
          redirect: { destination: `/api/auth/login?returnTo=${returnTo}`, permanent: false },
        };
      }

      if (!allowed) {
        return { redirect: { destination: '/unauthorized', permanent: false } };
      }
    }
  }

  // ---- 3) NAV ENRICH + FILTER (reuse navMeta; no extra fetch) ----
  if (!isEditingOrPreview && page.layout && navMeta) {
    const navFields = getNavigationFieldsFromLayout(page.layout);
    if (navFields) {
      const enriched = enrichNavTree({
        fields: navFields,
        redirectMap: navMeta.redirectMap,
        requiredKeysMap: navMeta.requiredKeysMap,
        requiredOperatorMap: navMeta.requiredOperatorMap,
        requiredRolesMap: navMeta.requiredRolesMap,
        requiredRolesOperatorMap: navMeta.requiredRolesOperatorMap,
        debug,
        traceId,
      });

      const filtered = filterNavTree({
        fields: enriched,
        userEntitlements: entitlements,
        userRoles: userRoles,
        isEditingOrPreview,
        language,
        userSub: session?.user?.sub,
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
