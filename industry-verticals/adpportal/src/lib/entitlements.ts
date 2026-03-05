// lib/entitlements.ts
import client from 'lib/sitecore-client';

/**
 * Must match what your Auth0 Action sets as a custom claim on the ID token
 */
export const ENTITLEMENTS_CLAIM = 'https://adp-portal.vercel.app/entitlements';

/** Role that bypasses all entitlement checks (user can see everything). Must match Auth0 role name. */
export const ADP_EMPLOYEE_ROLE = 'ADP Employee';

/** All entitlement caches use this TTL (max 1 minute). */
export const ENTITLEMENTS_CACHE_TTL_MS = 1 * 60 * 1000;

// Sitecore field names (must match EXACTLY the field names in Sitecore)
const ENTITLEMENTS_FIELD = 'Entitlements';

// Experience Edge: item Entitlements field jsonValue is array of items with fields.Auth0.value
const ITEM_ENTITLEMENTS_QUERY = `
  query ItemEntitlements($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      entitlements: field(name: "${ENTITLEMENTS_FIELD}") { jsonValue }
    }
  }
`;

/**
 * Utilities
 */

function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

/** Align with nav-metadata normalizeId so page and nav share the same cache key. */
function normalizeGuid(id: string): string {
  return id.trim().replace(/[{}-]/g, '').toLowerCase();
}

/**
 * getData typing + runtime guard (avoids `any`)
 */
type GetDataFn = (query: string, variables: Record<string, unknown>) => Promise<unknown>;
function hasGetData(x: unknown): x is { getData: GetDataFn } {
  return typeof (x as { getData?: unknown })?.getData === 'function';
}

/**
 * Central in-memory TTL cache for page-level required entitlement keys (item + language → keys).
 * Used by: [[...path]].tsx (page gate), nav-metadata (seeds after batch), and any other page-level checks.
 * In serverless this is "best effort" per warm instance.
 */
type CacheEntry<T> = { value: T; expiresAt: number };
const requiredKeysCache = new Map<string, CacheEntry<string[]>>();

export function getRequiredKeysCacheKey(itemId: string, language: string): string {
  return `${language}::${normalizeGuid(itemId)}`;
}

/**
 * Seed the central required-keys cache (e.g. from nav batch). Same TTL as getRequiredAuth0EntitlementKeysForItem.
 */
export function setRequiredKeysForItem(itemId: string, language: string, keys: string[]): void {
  const key = getRequiredKeysCacheKey(itemId, language);
  requiredKeysCache.set(key, {
    value: [...keys],
    expiresAt: Date.now() + ENTITLEMENTS_CACHE_TTL_MS,
  });
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Experience Edge: item.entitlements.jsonValue is an array of items with fields.Auth0.value */
function extractKeysFromJsonValueArray(rawUnknown: unknown): string[] {
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

/**
 * Fetch required Auth0 entitlement keys for any Sitecore item (page or nav).
 * Uses central cache (1 min TTL). Single API call; jsonValue is array of items with fields.Auth0.value.
 */
export async function getRequiredAuth0EntitlementKeysForItem(
  itemId: string,
  language: string
): Promise<string[]> {
  const cacheKey = getRequiredKeysCacheKey(itemId, language);
  const now = Date.now();

  const cached = requiredKeysCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.value;

  if (!hasGetData(client)) {
    throw new Error(
      'client.getData(...) is not available. Ensure your Sitecore client exposes getData.'
    );
  }

  const resultUnknown = await client.getData(ITEM_ENTITLEMENTS_QUERY, {
    id: itemId,
    language,
  });

  const keys = extractKeysFromJsonValueArray(resultUnknown);

  requiredKeysCache.set(cacheKey, { value: keys, expiresAt: now + ENTITLEMENTS_CACHE_TTL_MS });
  return keys;
}

/**
 * Read user entitlements from Auth0 session (ID token claim). Use this in getServerSideProps and API routes.
 */
export function getEntitlementsFromSession(
  session: { user?: Record<string, unknown> } | null | undefined
): Record<string, boolean> {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim))
    return claim as Record<string, boolean>;
  return {};
}

/**
 * True if the session user has the ADP Employee role (user.roles includes ADP_EMPLOYEE_ROLE).
 * Employees bypass all entitlement checks: they can see every page and nav item.
 * Use in getServerSideProps and API routes.
 */
export function isEmployeeFromSession(
  session: { user?: Record<string, unknown> } | null | undefined
): boolean {
  const roles = session?.user?.roles;
  if (!Array.isArray(roles)) return false;
  return roles.includes(ADP_EMPLOYEE_ROLE);
}

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>
): boolean {
  if (!requiredKeys.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}

/**
 * Central cache for "user + item → allowed" (same TTL as required-keys cache).
 * Nav items link to pages (same item ID), so one decision applies to both nav visibility and page access.
 */
const accessDecisionCache = new Map<string, CacheEntry<boolean>>();

export function getAccessDecisionCacheKey(
  itemId: string,
  language: string,
  userSub: string | undefined
): string {
  return `${getRequiredKeysCacheKey(itemId, language)}::${userSub ?? 'anon'}`;
}

/**
 * Get or compute "user allowed for this item" and cache with same TTL as required keys.
 * Use for both: page gate (after fetching required keys) and nav filter (requiredKeys from map).
 */
export function getOrSetAccessDecision(
  itemId: string,
  language: string,
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>,
  userSub: string | undefined
): boolean {
  const decisionKey = getAccessDecisionCacheKey(itemId, language, userSub);
  const now = Date.now();

  const cached = accessDecisionCache.get(decisionKey);
  if (cached && cached.expiresAt > now) return cached.value;

  const allowed = userHasSomeRequiredKey(requiredKeys, userEntitlements);
  accessDecisionCache.set(decisionKey, {
    value: allowed,
    expiresAt: now + ENTITLEMENTS_CACHE_TTL_MS,
  });
  return allowed;
}

/**
 * Page/nav: async "can this user access this item?" Uses required-keys cache and access-decision cache.
 * Same item ID is used for the page and for the nav link to that page.
 */
export async function isUserAllowedForPage(
  itemId: string,
  language: string,
  userEntitlements: Record<string, boolean>,
  userSub: string | undefined
): Promise<{ allowed: boolean; requiredKeys: string[] }> {
  const requiredKeys = await getRequiredAuth0EntitlementKeysForItem(itemId, language);
  const allowed = getOrSetAccessDecision(itemId, language, requiredKeys, userEntitlements, userSub);
  return { allowed, requiredKeys };
}
