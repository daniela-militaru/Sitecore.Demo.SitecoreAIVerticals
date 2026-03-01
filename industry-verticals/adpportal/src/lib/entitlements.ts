// lib/entitlements.ts
import client from 'lib/sitecore-client';

/**
 * Must match what your Auth0 Action sets as a custom claim on the ID token
 */
export const ENTITLEMENTS_CLAIM = 'https://adp-portal.vercel.app/entitlements';

// Sitecore field names
const ENTITLEMENTS_FIELD = 'Entitlements';
const ENTITLEMENT_ITEM_AUTH0_FIELD = 'Auth0';

// GraphQL queries (Delivery API safe)
const PAGE_ENTITLEMENTS_QUERY = `
  query ItemEntitlements($id: String!, $language: String!) {
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
 * Simple in-memory TTL cache (works well in Node / long-lived server processes).
 * Note: In serverless this is "best effort" per warm instance, still helpful.
 */
type CacheEntry<T> = { value: T; expiresAt: number };
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const requiredKeysCache = new Map<string, CacheEntry<string[]>>();

function getCacheKey(itemId: string, language: string) {
  return `${language}::${itemId}`;
}

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

  if (typeof (client as any).getData !== 'function') {
    throw new Error(
      'client.getData(...) is not available. Ensure your Sitecore client exposes getData.'
    );
  }

  const pageResult = await (client as any).getData(PAGE_ENTITLEMENTS_QUERY, {
    id: itemId,
    language,
  });

  const raw = pageResult?.item?.entitlements?.value as string | undefined;
  const entitlementItemIds = parsePipeSeparatedGuids(raw);

  if (!entitlementItemIds.length) {
    const empty: string[] = [];
    requiredKeysCache.set(cacheKey, { value: empty, expiresAt: now + TTL_MS });
    return empty;
  }

  const keys: string[] = [];
  for (const id of entitlementItemIds) {
    const result = await (client as any).getData(ENTITLEMENT_ITEM_QUERY, { id, language });
    const value = result?.item?.auth0?.value;
    if (typeof value === 'string' && value.trim()) keys.push(value.trim());
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
