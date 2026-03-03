// lib/entitlements.ts
import client from 'lib/sitecore-client';

/**
 * Must match what your Auth0 Action sets as a custom claim on the ID token
 */
export const ENTITLEMENTS_CLAIM = 'https://adp-portal.vercel.app/entitlements';

// Sitecore field names (must match EXACTLY the field names in Sitecore)
const ENTITLEMENTS_FIELD = 'Entitlements';
const ENTITLEMENT_ITEM_AUTH0_FIELD = 'Auth0';

// GraphQL queries (Experience Edge / Delivery API safe)
const PAGE_ENTITLEMENTS_QUERY = `
  query ItemEntitlements($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      entitlements: field(name: "${ENTITLEMENTS_FIELD}") { jsonValue }
    }
  }
`;

const ENTITLEMENT_ITEM_QUERY = `
  query EntitlementItem($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      auth0: field(name: "${ENTITLEMENT_ITEM_AUTH0_FIELD}") { jsonValue }
    }
  }
`;

/**
 * Utilities
 */

function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function normalizeGuid(id: string): string {
  return id.trim().replace(/[{}]/g, '').toLowerCase();
}

function parsePipeSeparatedGuids(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split('|')
    .map((x) => normalizeGuid(x))
    .filter(Boolean);
}

/**
 * getData typing + runtime guard (avoids `any`)
 */
type GetDataFn = (query: string, variables: Record<string, unknown>) => Promise<unknown>;
function hasGetData(x: unknown): x is { getData: GetDataFn } {
  return typeof (x as { getData?: unknown })?.getData === 'function';
}

/**
 * Simple in-memory TTL cache (works well in Node / long-lived server processes).
 * Note: In serverless this is "best effort" per warm instance, still helpful.
 */
type CacheEntry<T> = { value: T; expiresAt: number };
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const requiredKeysCache = new Map<string, CacheEntry<string[]>>();

function getCacheKey(itemId: string, language: string) {
  return `${language}::${normalizeGuid(itemId)}`;
}

/**
 * Result shapes for jsonValue
 */
type JsonValueField = {
  jsonValue?: {
    value?: unknown;
  };
};

type ItemEntitlementsResult = {
  item?: {
    entitlements?: JsonValueField;
  };
};

type EntitlementItemResult = {
  item?: {
    auth0?: JsonValueField;
  };
};

/**
 * Fetch required Auth0 entitlement keys for any Sitecore item with an Entitlements multilist.
 * - Reads item.Entitlements (pipe separated IDs)
 * - For each entitlement item, reads field "Auth0" and returns those strings
 */
export async function getRequiredAuth0EntitlementKeysForItem(
  itemId: string,
  language: string
): Promise<string[]> {
  const cacheKey = getCacheKey(itemId, language);
  const now = Date.now();

  const cached = requiredKeysCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.value;

  if (!hasGetData(client)) {
    throw new Error(
      'client.getData(...) is not available. Ensure your Sitecore client exposes getData.'
    );
  }

  const pageResultUnknown = await client.getData(PAGE_ENTITLEMENTS_QUERY, {
    id: itemId,
    language,
  });

  const rawEntitlements =
    asString((pageResultUnknown as ItemEntitlementsResult)?.item?.entitlements?.jsonValue?.value) ??
    null;

  const entitlementItemIds = parsePipeSeparatedGuids(rawEntitlements);

  if (entitlementItemIds.length === 0) {
    const empty: string[] = [];
    requiredKeysCache.set(cacheKey, { value: empty, expiresAt: now + TTL_MS });
    return empty;
  }

  const keys: string[] = [];

  for (const entitlementItemId of entitlementItemIds) {
    const resultUnknown = await client.getData(ENTITLEMENT_ITEM_QUERY, {
      id: entitlementItemId,
      language,
    });

    const auth0Key =
      asString((resultUnknown as EntitlementItemResult)?.item?.auth0?.jsonValue?.value) ?? null;

    if (typeof auth0Key === 'string' && auth0Key.trim().length > 0) {
      keys.push(auth0Key.trim());
    }
  }

  requiredKeysCache.set(cacheKey, { value: keys, expiresAt: now + TTL_MS });
  return keys;
}

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>
): boolean {
  if (!requiredKeys.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}
