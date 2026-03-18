import type { Session } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useMemo } from 'react';
import type { LinkField } from '@sitecore-content-sdk/nextjs';
import { ENTITLEMENT_OPERATOR_ALL, ENTITLEMENTS_CLAIM, ROLES_CLAIM } from '../entitlements';
import { userHasRequiredRoles as userHasRequiredRolesLib } from '../entitlements';
import type { EntitlementOperator } from '../entitlements';

export type EntitlementsMap = Record<string, boolean>;

export type EntitlementItem = {
  id?: string;
  url?: string;
  name?: string;
  displayName?: string;
  fields?: {
    Auth0?: { value?: string };
  };
};

export type RoleItem = {
  id?: string;
  name?: string;
  displayName?: string;
  fields?: {
    Name?: { value?: string };
    RoleName?: { value?: string };
    Value?: { value?: string };
  };
};

/** Droplink/Link field value: { id?, value? } or LinkField or raw GUID string */
export type EntitlementOperatorField =
  | { id?: string; value?: string }
  | LinkField
  | string
  | null
  | undefined;

function normalizeGuid(id: string): string {
  return id.trim().replace(/[{}-]/g, '').toLowerCase();
}

export function getRequiredAuth0KeysFromEntitlements(
  entitlements: EntitlementItem[] | undefined | null
): string[] {
  if (!Array.isArray(entitlements)) return [];

  const keys: string[] = [];
  for (const item of entitlements) {
    const v = item?.fields?.Auth0?.value;
    if (typeof v === 'string' && v.trim()) keys.push(v.trim());
  }
  return Array.from(new Set(keys));
}

export function getRequiredRolesFromField(roles: RoleItem[] | undefined | null): string[] {
  if (!Array.isArray(roles)) return [];

  const names: string[] = [];
  for (const item of roles) {
    const nameField = item?.fields?.Name ?? item?.fields?.RoleName ?? item?.fields?.Value;
    const v =
      nameField && typeof nameField === 'object' && 'value' in nameField
        ? (nameField as { value?: string }).value
        : (item?.name ?? item?.displayName);
    if (typeof v === 'string' && v.trim()) names.push(v.trim());
  }
  return Array.from(new Set(names));
}

/** Extract operator from EntitlementOperator Link/droplink field. Default: any. */
export function getEntitlementOperatorFromField(
  field: EntitlementOperatorField
): EntitlementOperator {
  if (!field) return 'any';
  let id: string | undefined;
  if (typeof field === 'string') {
    id = field;
  } else if (typeof field === 'object' && field !== null) {
    const obj = field as Record<string, unknown>;
    const val = obj.value;
    const inner = val && typeof val === 'object' ? (val as Record<string, unknown>) : null;
    id =
      (obj.id as string) ??
      (typeof val === 'string' ? val : undefined) ??
      (inner?.id as string) ??
      (inner?.href as string);
  } else {
    id = undefined;
  }
  if (typeof id !== 'string' || !id.trim()) return 'any';
  return normalizeGuid(id) === ENTITLEMENT_OPERATOR_ALL ? 'all' : 'any';
}

/**
 * Extract the user entitlements map from an Auth0 session or user profile.
 * Mirrors the logic in [[...path]].tsx (getUserEntitlements).
 */
export function getUserEntitlementsFromSession(
  session: Session | null | undefined
): EntitlementsMap {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as EntitlementsMap;
  }
  return {};
}

export function getUserEntitlementsFromUser(
  user: Record<string, unknown> | null | undefined
): EntitlementsMap {
  if (!user) return {};
  const claim = user[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as EntitlementsMap;
  }
  return {};
}

export function getUserRolesFromUser(user: Record<string, unknown> | null | undefined): string[] {
  if (!user) return [];
  const claim = user[ROLES_CLAIM];
  if (!Array.isArray(claim)) return [];
  return claim.filter((r): r is string => typeof r === 'string');
}

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: EntitlementsMap
): boolean {
  if (!requiredKeys?.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}

export function userHasAllRequiredKeys(
  requiredKeys: string[],
  userEntitlements: EntitlementsMap
): boolean {
  if (!requiredKeys?.length) return true;
  return requiredKeys.every((k) => userEntitlements[k] === true);
}

export function userHasRequiredKeys(
  requiredKeys: string[],
  userEntitlements: EntitlementsMap,
  operator: EntitlementOperator
): boolean {
  if (!requiredKeys?.length) return true;
  return operator === 'all'
    ? userHasAllRequiredKeys(requiredKeys, userEntitlements)
    : userHasSomeRequiredKey(requiredKeys, userEntitlements);
}

/**
 * Memoized entitlement + roles check for client components (HeroSection, FaqCard, etc.).
 * Both entitlements and roles must pass when configured. Only configured checks apply.
 * If user has ADP Employee role, allowed is true. Otherwise: any = has one, all = has all.
 */
export function useComponentEntitlementDecision(
  requiredKeys: string[],
  operator: EntitlementOperator = 'any',
  requiredRoles: string[] = [],
  rolesOperator: EntitlementOperator = 'any'
) {
  const isSecured = requiredKeys.length > 0 || requiredRoles.length > 0;
  const { user, isLoading } = useUser();

  const userEntitlements = useMemo(() => getUserEntitlementsFromUser(user ?? undefined), [user]);
  const userRoles = useMemo(() => getUserRolesFromUser(user ?? undefined), [user]);

  const allowed = useMemo(() => {
    const entitlementsPass = userHasRequiredKeys(requiredKeys, userEntitlements, operator);
    const rolesPass = userHasRequiredRolesLib(requiredRoles, userRoles, rolesOperator);
    return entitlementsPass && rolesPass;
  }, [requiredKeys, userEntitlements, operator, requiredRoles, userRoles, rolesOperator]);

  return { allowed, isLoading, isSecured };
}
