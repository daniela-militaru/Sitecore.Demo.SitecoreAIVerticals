import type { Session } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useMemo } from 'react';
import { ADP_EMPLOYEE_ROLE, ENTITLEMENTS_CLAIM } from '../entitlements';

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

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: EntitlementsMap
): boolean {
  if (!requiredKeys?.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}

/**
 * True if the user has the ADP Employee role (user.roles includes ADP_EMPLOYEE_ROLE).
 * Employees see everything regardless of entitlements.
 */
export function isEmployeeFromUser(user: Record<string, unknown> | null | undefined): boolean {
  if (!user) return false;
  const roles = user.roles;
  if (!Array.isArray(roles)) return false;
  return roles.includes(ADP_EMPLOYEE_ROLE);
}

/**
 * Memoized entitlement check for client components (HeroSection, FaqCard, etc.).
 * If user has ADP Employee role, allowed is true (see everything). Otherwise uses required keys.
 */
export function useComponentEntitlementDecision(requiredKeys: string[]) {
  const isSecured = requiredKeys.length > 0;
  const { user, isLoading } = useUser();

  const userEntitlements = useMemo(() => getUserEntitlementsFromUser(user ?? undefined), [user]);

  const isEmployee = useMemo(() => isEmployeeFromUser(user ?? undefined), [user]);

  const allowed = useMemo(
    () => isEmployee || userHasSomeRequiredKey(requiredKeys, userEntitlements),
    [isEmployee, requiredKeys, userEntitlements]
  );

  return { allowed, isLoading, isSecured };
}
