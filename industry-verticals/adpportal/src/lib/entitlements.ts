// lib/entitlements.ts
import client from 'lib/sitecore-client';

/**
 * Must match what your Auth0 Action sets as a custom claim on the ID token
 */
export const ENTITLEMENTS_CLAIM = 'https://adp-portal.vercel.app/entitlements';
export const ROLES_CLAIM = 'https://adp-portal.vercel.app/roles';

/** Role that bypasses all entitlement checks (user can see everything). Must match Auth0 role name. */
export const ADP_EMPLOYEE_ROLE = 'ADP Employee';

/** All entitlement caches use this TTL (max 1 minute). */
export const ENTITLEMENTS_CACHE_TTL_MS = 1 * 60 * 1000;

// Sitecore field names (must match EXACTLY the field names in Sitecore)
const ENTITLEMENTS_FIELD = 'Entitlements';
const ENTITLEMENT_OPERATOR_FIELD = 'EntitlementOperator';
const ROLES_FIELD = 'Roles';
const ROLES_OPERATOR_FIELD = 'RolesOperator';

/** EntitlementOperator/RolesOperator droplink values (normalized GUIDs) */
export const ENTITLEMENT_OPERATOR_ANY = '95926502e2494b2890f7cebf2f744d53';
export const ENTITLEMENT_OPERATOR_ALL = 'f37eb6e90ccf4ff7968234425fc36dfb';

export type EntitlementOperator = 'any' | 'all';

// Experience Edge: Entitlements, EntitlementOperator, Roles, RolesOperator
const ITEM_ENTITLEMENTS_QUERY = `
  query ItemEntitlements($id: String!, $language: String!) {
    item(path: $id, language: $language) {
      entitlements: field(name: "${ENTITLEMENTS_FIELD}") { jsonValue }
      entitlementOperator: field(name: "${ENTITLEMENT_OPERATOR_FIELD}") { jsonValue }
      roles: field(name: "${ROLES_FIELD}") { jsonValue }
      rolesOperator: field(name: "${ROLES_OPERATOR_FIELD}") { jsonValue }
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

type RequiredAuthEntry = {
  keys: string[];
  operator: EntitlementOperator;
  roles: string[];
  rolesOperator: EntitlementOperator;
};

/**
 * Central in-memory TTL cache for page-level required entitlements + roles.
 * Used by: [[...path]].tsx (page gate), nav-metadata (seeds after batch).
 */
type CacheEntry<T> = { value: T; expiresAt: number };
const requiredKeysCache = new Map<string, CacheEntry<RequiredAuthEntry>>();

export function getRequiredKeysCacheKey(itemId: string, language: string): string {
  return `${language}::${normalizeGuid(itemId)}`;
}

/**
 * Seed the central required-keys cache (e.g. from nav batch). Same TTL as getRequiredAuth0EntitlementKeysForItem.
 */
export function setRequiredKeysForItem(
  itemId: string,
  language: string,
  keys: string[],
  operator: EntitlementOperator = 'any',
  roles: string[] = [],
  rolesOperator: EntitlementOperator = 'any'
): void {
  const key = getRequiredKeysCacheKey(itemId, language);
  requiredKeysCache.set(key, {
    value: { keys: [...keys], operator, roles: [...roles], rolesOperator },
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

/** Extract operator from droplink field (value.id or value as GUID string). Default: any. */
function extractOperatorFromField(opField: unknown): EntitlementOperator {
  if (!isObject(opField)) return 'any';
  const jsonValue = opField.jsonValue;
  if (!isObject(jsonValue)) return 'any';
  const value = jsonValue.value;
  const id = isObject(value) ? (asString(value.id) ?? asString(value.value)) : asString(value);
  if (!id) return 'any';
  const normalized = normalizeGuid(id);
  return normalized === ENTITLEMENT_OPERATOR_ALL ? 'all' : 'any';
}

/** Experience Edge: item.roles.jsonValue is array of items with fields.Name.value (role name) */
function extractRolesFromJsonValueArray(rawUnknown: unknown): string[] {
  const raw = isObject(rawUnknown) ? rawUnknown : {};
  const item = raw.item;
  if (!isObject(item)) return [];
  const rolesField = item.roles;
  if (!isObject(rolesField)) return [];
  const jsonValue = rolesField.jsonValue;
  if (!Array.isArray(jsonValue)) return [];
  const roles: string[] = [];
  for (const roleItem of jsonValue) {
    if (!isObject(roleItem)) continue;
    const fields = roleItem.fields;
    let v: string | undefined;
    if (isObject(fields)) {
      const nameField = fields.Name ?? fields.RoleName ?? fields.Value;
      v = isObject(nameField) ? asString(nameField.value) : asString(nameField);
    }
    v = v ?? asString(roleItem.name) ?? asString(roleItem.displayName);
    if (v && v.trim()) roles.push(v.trim());
  }
  return [...new Set(roles)];
}

/**
 * Fetch required Auth0 entitlement keys + operator for any Sitecore item (page or nav).
 * Uses central cache (1 min TTL). Single API call.
 */
export async function getRequiredAuth0EntitlementKeysForItem(
  itemId: string,
  language: string
): Promise<RequiredAuthEntry> {
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

  const raw = isObject(resultUnknown) ? resultUnknown : {};
  const item = raw.item;
  const keys = extractKeysFromJsonValueArray(resultUnknown);
  const operator = extractOperatorFromField(isObject(item) ? item.entitlementOperator : undefined);
  const roles = extractRolesFromJsonValueArray(resultUnknown);
  const rolesOperator = extractOperatorFromField(isObject(item) ? item.rolesOperator : undefined);

  const entry: RequiredAuthEntry = { keys, operator, roles, rolesOperator };
  requiredKeysCache.set(cacheKey, { value: entry, expiresAt: now + ENTITLEMENTS_CACHE_TTL_MS });
  return entry;
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
 * True if the session user has the ADP Employee role (roles claim includes ADP_EMPLOYEE_ROLE).
 * Employees bypass all entitlement checks: they can see every page and nav item.
 * Use in getServerSideProps and API routes.
 */
export function isEmployeeFromSession(
  session: { user?: Record<string, unknown> } | null | undefined
): boolean {
  const roles = getRolesFromSession(session);
  return roles.includes(ADP_EMPLOYEE_ROLE);
}

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>
): boolean {
  if (!requiredKeys.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}

export function userHasAllRequiredKeys(
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>
): boolean {
  if (!requiredKeys.length) return true;
  return requiredKeys.every((k) => userEntitlements[k] === true);
}

export function userHasRequiredKeys(
  requiredKeys: string[],
  userEntitlements: Record<string, boolean>,
  operator: EntitlementOperator
): boolean {
  if (!requiredKeys.length) return true;
  return operator === 'all'
    ? userHasAllRequiredKeys(requiredKeys, userEntitlements)
    : userHasSomeRequiredKey(requiredKeys, userEntitlements);
}

export function userHasSomeRequiredRole(requiredRoles: string[], userRoles: string[]): boolean {
  if (!requiredRoles.length) return true;
  const userSet = new Set(userRoles.map((r) => r?.trim()).filter(Boolean));
  return requiredRoles.some((r) => userSet.has(r.trim()));
}

export function userHasAllRequiredRoles(requiredRoles: string[], userRoles: string[]): boolean {
  if (!requiredRoles.length) return true;
  const userSet = new Set(userRoles.map((r) => r?.trim()).filter(Boolean));
  return requiredRoles.every((r) => userSet.has(r.trim()));
}

export function userHasRequiredRoles(
  requiredRoles: string[],
  userRoles: string[],
  operator: EntitlementOperator
): boolean {
  if (!requiredRoles.length) return true;
  return operator === 'all'
    ? userHasAllRequiredRoles(requiredRoles, userRoles)
    : userHasSomeRequiredRole(requiredRoles, userRoles);
}

export function getRolesFromSession(
  session: { user?: Record<string, unknown> } | null | undefined
): string[] {
  const claim = session?.user?.[ROLES_CLAIM];
  if (!Array.isArray(claim)) return [];
  return claim.filter((r): r is string => typeof r === 'string');
}

/**
 * Central cache for "user + item → allowed" (same TTL as required-keys cache).
 * Nav items link to pages (same item ID), so one decision applies to both nav visibility and page access.
 */
const accessDecisionCache = new Map<string, CacheEntry<boolean>>();

export function getAccessDecisionCacheKey(
  itemId: string,
  language: string,
  userSub: string | undefined,
  operator: EntitlementOperator,
  rolesOperator: EntitlementOperator
): string {
  return `${getRequiredKeysCacheKey(itemId, language)}::${userSub ?? 'anon'}::${operator}::${rolesOperator}`;
}

/**
 * Get or compute "user allowed for this item" and cache with same TTL as required keys.
 * Both entitlements AND roles must pass (if configured). Only configured checks apply.
 */
export function getOrSetAccessDecision(
  itemId: string,
  language: string,
  requiredKeys: string[],
  operator: EntitlementOperator,
  requiredRoles: string[],
  rolesOperator: EntitlementOperator,
  userEntitlements: Record<string, boolean>,
  userRoles: string[],
  userSub: string | undefined
): boolean {
  const decisionKey = getAccessDecisionCacheKey(itemId, language, userSub, operator, rolesOperator);
  const now = Date.now();

  const cached = accessDecisionCache.get(decisionKey);
  if (cached && cached.expiresAt > now) return cached.value;

  const entitlementsPass = userHasRequiredKeys(requiredKeys, userEntitlements, operator);
  const rolesPass = userHasRequiredRoles(requiredRoles, userRoles, rolesOperator);
  const allowed = entitlementsPass && rolesPass;

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
  userRoles: string[],
  userSub: string | undefined
): Promise<{ allowed: boolean; requiredKeys: string[]; requiredRoles: string[] }> {
  const {
    keys: requiredKeys,
    operator,
    roles: requiredRoles,
    rolesOperator,
  } = await getRequiredAuth0EntitlementKeysForItem(itemId, language);
  const allowed = getOrSetAccessDecision(
    itemId,
    language,
    requiredKeys,
    operator,
    requiredRoles,
    rolesOperator,
    userEntitlements,
    userRoles,
    userSub
  );
  return { allowed, requiredKeys, requiredRoles };
}
