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

// Must match what your Auth0 Action sets as a custom claim on the ID token
const ENTITLEMENTS_CLAIM = 'https://adp-portal.vercel.app/entitlements';

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
 * Minimal shape of the page object you use in this file
 */
type PageLike = {
  layout?: {
    sitecore?: {
      route?: {
        itemId?: string;
      };
    };
  };
  locale?: string;
  siteName?: string;
};

type GetDataFn = (query: string, variables: Record<string, unknown>) => Promise<unknown>;

function hasGetData(x: unknown): x is { getData: GetDataFn } {
  return typeof (x as { getData?: unknown })?.getData === 'function';
}

function getUserEntitlements(session: Session | null): Record<string, boolean> {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  // Auth0 custom claim should be an object like { KEY: true }
  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as Record<string, boolean>;
  }
  return {};
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

  // 1) Fetch page Entitlements multilist raw value
  const pageResult = await client.getData(PAGE_ENTITLEMENTS_QUERY, {
    id: pageItemId,
    language,
  });

  const raw =
    (pageResult as { item?: { entitlements?: { value?: string | null } } })?.item?.entitlements
      ?.value ?? null;

  const entitlementItemIds = parsePipeSeparatedGuids(raw);
  if (entitlementItemIds.length === 0) return [];

  // 2) Resolve each entitlement item individually (schema-safe)
  const keys: string[] = [];

  for (const id of entitlementItemIds) {
    const result = await client.getData(ENTITLEMENT_ITEM_QUERY, { id, language });

    const value =
      (result as { item?: { auth0?: { value?: string | null } } })?.item?.auth0?.value ?? null;

    if (typeof value === 'string' && value.trim().length > 0) keys.push(value.trim());
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const itemId = page?.layout?.sitecore?.route?.itemId;
  const isPreview = Boolean(context.preview);
  const language = (context.locale || page.locale || 'en') as string;

  if (!isPreview && itemId) {
    const requiredAuth0Keys = await getRequiredAuth0EntitlementKeysForPage(itemId, language);

    if (requiredAuth0Keys.length > 0) {
      const session = await getSession(context.req, context.res);

      console.log('Session user keys:', Object.keys(session?.user || {}));
      console.log('Entitlements claim:', session?.user?.[ENTITLEMENTS_CLAIM]);

      if (!session?.user) {
        const returnTo = encodeURIComponent(context.resolvedUrl || '/');
        return {
          redirect: {
            destination: `/api/auth/login?returnTo=${returnTo}`,
            permanent: false,
          },
        };
      }

      const userEntitlements = getUserEntitlements(session);

      console.log('Required Auth0 entitlement keys for this page:', requiredAuth0Keys);
      console.log('User entitlements from Auth0:', userEntitlements);

      const allowed = requiredAuth0Keys.some((key) => userEntitlements[key] === true);

      if (!allowed) {
        return { redirect: { destination: '/unauthorized', permanent: false } };
      }
    }
  }

  const props = {
    page: pageUnknown, // keep original (full) page object; it's already JSON-serializable
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
