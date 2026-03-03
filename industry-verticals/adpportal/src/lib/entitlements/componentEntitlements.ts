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

export function userHasSomeRequiredKey(
  requiredKeys: string[],
  userEntitlements: EntitlementsMap
): boolean {
  if (!requiredKeys?.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}
