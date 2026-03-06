// lib/nav-metadata.ts
import client from 'lib/sitecore-client';
import {
  ENTITLEMENT_OPERATOR_ALL,
  ENTITLEMENTS_CACHE_TTL_MS,
  setRequiredKeysForItem,
  type EntitlementOperator,
} from 'lib/entitlements';

export type RedirectMap = Record<string, string>;
export type RequiredKeysMap = Record<string, string[]>;
export type RequiredOperatorMap = Record<string, EntitlementOperator>;
export type RequiredRolesMap = Record<string, string[]>;
export type RequiredRolesOperatorMap = Record<string, EntitlementOperator>;

export type NavMetadata = {
  redirectMap: RedirectMap;
  requiredKeysMap: RequiredKeysMap;
  requiredOperatorMap: RequiredOperatorMap;
  requiredRolesMap: RequiredRolesMap;
  requiredRolesOperatorMap: RequiredRolesOperatorMap;
};

type CacheEntry<T> = { value: T; expiresAt: number };
const metaCache = new Map<string, CacheEntry<NavMetadata>>();

// Experience Edge depth limit is 15; multilist fields (Entitlements, Roles) add depth per item.
// With 5 items we hit ~30 depth. Use 2 items per chunk to stay under the limit.
const CHUNK_SIZE = 2;

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

/**
 * Canonical GUID normalization used across nav-metadata + nav-apply:
 * - remove braces
 * - remove dashes
 * - lowercase
 */
export function normalizeId(id: string): string {
  return id.trim().replace(/[{}-]/g, '').toLowerCase();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function stableKey(language: string, ids: string[], includeEntitlements: boolean) {
  const sorted = [...new Set(ids)].sort();
  return `${language}::${includeEntitlements ? 'withEnt' : 'redirectOnly'}::${sorted.join(',')}`;
}

/**
 * RedirectUrl is a Sitecore Link field in Experience Edge:
 * field(name:"RedirectUrl"){ jsonValue: { value: { href/url/linktype/... } } }
 */
function extractRedirectHref(redirectField: unknown): string | undefined {
  if (!isObject(redirectField)) return undefined;

  const jsonValue = redirectField.jsonValue;
  if (!isObject(jsonValue)) return undefined;

  const value = jsonValue.value;

  // Most common: value is an object with href/url
  if (isObject(value)) {
    const href = asString(value.href) || asString(value.url);
    return href?.trim() || undefined;
  }

  // Fallback: string
  const s = asString(value);
  return s?.trim() || undefined;
}

/**
 * Entitlements field in Experience Edge (per your sample) returns jsonValue as an array of items,
 * each item includes fields.Auth0.value already.
 */
function extractAuth0KeysFromEntitlements(entitlementsField: unknown): string[] {
  if (!isObject(entitlementsField)) return [];

  const jsonValue = entitlementsField.jsonValue;
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

/** Extract operator from droplink field. Default: any. */
function extractOperatorFromField(opField: unknown): EntitlementOperator {
  if (!isObject(opField)) return 'any';
  const jsonValue = opField.jsonValue;
  if (!isObject(jsonValue)) return 'any';
  const value = jsonValue.value;
  const id = isObject(value) ? (asString(value.id) ?? asString(value.value)) : asString(value);
  if (!id) return 'any';
  const normalized = normalizeId(id);
  return normalized === ENTITLEMENT_OPERATOR_ALL ? 'all' : 'any';
}

/** Roles field: jsonValue array of items with fields.Name/RoleName/Value.value or item.name */
function extractRolesFromField(rolesField: unknown): string[] {
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

function buildNavMetaQuery(itemIds: string[], includeEntitlements: boolean): string {
  const parts: string[] = [];

  for (let i = 0; i < itemIds.length; i++) {
    parts.push(`
      i${i}: item(path: "${itemIds[i]}", language: $language) {
        id
        redirectUrl: field(name: "RedirectUrl") { jsonValue }
        ${includeEntitlements ? 'entitlements: field(name: "Entitlements") { jsonValue }\n        entitlementOperator: field(name: "EntitlementOperator") { jsonValue }\n        roles: field(name: "Roles") { jsonValue }\n        rolesOperator: field(name: "RolesOperator") { jsonValue }' : ''}
      }
    `);
  }

  return `
    query NavMeta($language: String!) {
      ${parts.join('\n')}
    }
  `;
}

export async function getNavMetadata(params: {
  itemIds: string[];
  language: string;
  includeEntitlements?: boolean; // default true
  debug?: boolean;
  traceId?: string;
}): Promise<NavMetadata> {
  const { itemIds, language, includeEntitlements = true, debug, traceId } = params;

  const uniqueIds = [...new Set(itemIds.map(normalizeId))].filter(Boolean);
  if (uniqueIds.length === 0)
    return {
      redirectMap: {},
      requiredKeysMap: {},
      requiredOperatorMap: {},
      requiredRolesMap: {},
      requiredRolesOperatorMap: {},
    };

  const cacheKey = stableKey(language, uniqueIds, includeEntitlements);
  const now = Date.now();

  const cached = metaCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    if (debug) {
      console.log('[NAV META][CACHE HIT]', {
        traceId,
        language,
        includeEntitlements,
        count: uniqueIds.length,
      });
    }
    return cached.value;
  }

  if (!hasGetData(client)) {
    throw new Error(
      'client.getData(...) is not available. Ensure your Sitecore client exposes getData.'
    );
  }

  const redirectMap: RedirectMap = {};
  const requiredKeysMap: RequiredKeysMap = {};
  const requiredOperatorMap: RequiredOperatorMap = {};
  const requiredRolesMap: RequiredRolesMap = {};
  const requiredRolesOperatorMap: RequiredRolesOperatorMap = {};

  const chunks = chunk(uniqueIds, CHUNK_SIZE);

  if (debug) {
    console.log('[NAV META][START]', {
      traceId,
      language,
      includeEntitlements,
      totalIds: uniqueIds.length,
      chunks: chunks.length,
      chunkSize: CHUNK_SIZE,
    });
  }

  for (const idsChunk of chunks) {
    const query = buildNavMetaQuery(idsChunk, includeEntitlements);

    // Experience Edge accepts GUIDs with or without dashes; we pass no-dash keys
    const rawUnknown = await client.getData(query, { language });
    const raw = isObject(rawUnknown) ? rawUnknown : {};

    for (let i = 0; i < idsChunk.length; i++) {
      const node = raw[`i${i}`];
      if (!isObject(node)) continue;

      const gqlId = asString(node.id) || idsChunk[i];
      const idKey = normalizeId(gqlId);

      const redirectHref = extractRedirectHref(node.redirectUrl);
      if (redirectHref) redirectMap[idKey] = redirectHref;

      if (includeEntitlements) {
        requiredKeysMap[idKey] = extractAuth0KeysFromEntitlements(node.entitlements);
        requiredOperatorMap[idKey] = extractOperatorFromField(node.entitlementOperator);
        requiredRolesMap[idKey] = extractRolesFromField(node.roles);
        requiredRolesOperatorMap[idKey] = extractOperatorFromField(node.rolesOperator);
        setRequiredKeysForItem(
          idKey,
          language,
          requiredKeysMap[idKey],
          requiredOperatorMap[idKey],
          requiredRolesMap[idKey],
          requiredRolesOperatorMap[idKey]
        );
      } else {
        requiredKeysMap[idKey] = [];
        requiredOperatorMap[idKey] = 'any';
        requiredRolesMap[idKey] = [];
        requiredRolesOperatorMap[idKey] = 'any';
      }

      if (debug && (redirectHref || (requiredKeysMap[idKey]?.length ?? 0) > 0)) {
        console.log('[NAV META][ITEM]', {
          traceId,
          idKey,
          redirectHref,
          requiredKeys: requiredKeysMap[idKey],
        });
      }
    }
  }

  const value: NavMetadata = {
    redirectMap,
    requiredKeysMap,
    requiredOperatorMap,
    requiredRolesMap,
    requiredRolesOperatorMap,
  };
  metaCache.set(cacheKey, { value, expiresAt: now + ENTITLEMENTS_CACHE_TTL_MS });

  if (debug) {
    const secured = Object.entries(requiredKeysMap).filter(([, v]) => v.length > 0);
    console.log('[NAV META][DONE]', {
      traceId,
      redirectCount: Object.keys(redirectMap).length,
      securedCount: secured.length,
      securedSample: secured.slice(0, 5),
    });
  }

  return value;
}
