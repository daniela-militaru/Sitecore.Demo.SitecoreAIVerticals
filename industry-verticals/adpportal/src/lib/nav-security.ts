// lib/nav-security.ts
import { getRequiredAuth0EntitlementKeysForItem, userHasSomeRequiredKey } from './entitlements';

export type NavItem = {
  Id: string;
  DisplayName?: string;
  Title?: any;
  NavigationTitle?: any;
  Href?: string;
  Querystring?: string;
  Children?: NavItem[];
  Styles?: string[];
  // Not in Sitecore: we attach it for client-side re-filtering
  __requiredAuth0Keys?: string[];
};

/**
 * Walk a nav tree and collect all item IDs.
 */
export function collectNavItemIds(items: NavItem[]): string[] {
  const out: string[] = [];
  const walk = (arr: NavItem[]) => {
    for (const it of arr) {
      if (it?.Id) out.push(it.Id);
      if (it?.Children?.length) walk(it.Children);
    }
  };
  walk(items);
  return Array.from(new Set(out));
}

/**
 * Resolve required Auth0 keys for a set of item IDs.
 */
export async function buildRequiredKeysMapForItemIds(
  itemIds: string[],
  language: string,
  debug?: boolean
): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  await Promise.all(
    itemIds.map(async (id) => {
      const keys = await getRequiredAuth0EntitlementKeysForItem(id, language);
      map[id] = keys;
      if (debug && keys.length) {
        // This is the "secured" detection debug signal you wanted.
        console.log('[NAV][SECURED ITEM]', { itemId: id, requiredAuth0Keys: keys });
      }
    })
  );
  return map;
}

/**
 * Attach __requiredAuth0Keys to each nav node (mutates a cloned tree).
 */
export function attachRequiredKeys(
  items: NavItem[],
  requiredMap: Record<string, string[]>
): NavItem[] {
  const clone = (arr: NavItem[]): NavItem[] =>
    arr.map((it) => {
      const next: NavItem = {
        ...it,
        __requiredAuth0Keys: requiredMap[it.Id] ?? [],
      };

      if (Array.isArray(it.Children) && it.Children.length > 0) {
        next.Children = clone(it.Children);
      } else {
        // IMPORTANT: do NOT assign next.Children = undefined
        // Leave it absent.
      }

      return next;
    });

  return clone(items);
}

/**
 * Filter nav tree based on userEntitlements and required keys.
 */
export function filterNavTree(
  items: NavItem[],
  userEntitlements: Record<string, boolean>
): NavItem[] {
  const filterRec = (arr: NavItem[]): NavItem[] => {
    const out: NavItem[] = [];

    for (const it of arr) {
      const required = it.__requiredAuth0Keys ?? [];
      const allowed = userHasSomeRequiredKey(required, userEntitlements);
      if (!allowed) continue;

      const next: NavItem = { ...it };

      if (Array.isArray(it.Children) && it.Children.length > 0) {
        next.Children = filterRec(it.Children);
      } else {
        // again: don't set undefined
      }

      out.push(next);
    }

    return out;
  };

  return filterRec(items);
}

/**
 * Heuristic: find Navigation renderings in Layout Service data and return a reference to their fields object.
 * This avoids hardcoding placeholder paths.
 */
function findRenderings(layout: any): any[] {
  const route = layout?.sitecore?.route;
  if (!route) return [];

  const found: any[] = [];

  const walkPlaceholders = (placeholders: any) => {
    if (!placeholders) return;

    if (Array.isArray(placeholders)) {
      for (const rendering of placeholders) {
        if (rendering) {
          found.push(rendering);
          if (rendering.placeholders) walkPlaceholders(rendering.placeholders);
        }
      }
      return;
    }

    // object of arrays
    for (const key of Object.keys(placeholders)) {
      walkPlaceholders(placeholders[key]);
    }
  };

  walkPlaceholders(route?.placeholders);
  return found;
}

/**
 * Extract nav items from a Navigation rendering fields structure:
 * In your component, `fields` is Record<string, NavItemFields>.
 * In Layout Service, renderings.fields typically matches that.
 */
function extractNavItemsFromRendering(rendering: any): NavItem[] | null {
  const fieldsObj = rendering?.fields;
  if (!fieldsObj || typeof fieldsObj !== 'object') return null;

  const values = Object.values(fieldsObj).filter(Boolean) as any[];
  // Detect by shape: must have Id and (Href or Children)
  const navLike = values.filter((v) => v && typeof v === 'object' && typeof v.Id === 'string');
  if (!navLike.length) return null;

  // In your Navigation.tsx you treat it as "Object.values(fields)".
  return navLike as NavItem[];
}

/**
 * Mutate layout: attach required keys and filter nav items SSR.
 * Returns a new layout object (safe to assign back to page.layout).
 */
export async function secureNavigationInLayout(opts: {
  layout: any;
  language: string;
  userEntitlements: Record<string, boolean>;
  debug?: boolean;
}): Promise<any> {
  const { layout, language, userEntitlements, debug } = opts;
  if (!layout?.sitecore?.route) return layout;

  const renderings = findRenderings(layout);

  // Clone layout shallowly so we can safely mutate nested fields
  const nextLayout = structuredClone ? structuredClone(layout) : JSON.parse(JSON.stringify(layout));
  const nextRenderings = findRenderings(nextLayout);

  for (let i = 0; i < nextRenderings.length; i++) {
    const rendering = nextRenderings[i];

    // Only apply to the Navigation component
    // You can adjust this check if your componentName differs.
    const componentName = rendering?.componentName || rendering?.name;
    const looksLikeNavigation = componentName === 'Navigation';

    if (!looksLikeNavigation) continue;

    const items = extractNavItemsFromRendering(rendering);
    if (!items) continue;

    const itemIds = collectNavItemIds(items);
    const requiredMap = await buildRequiredKeysMapForItemIds(itemIds, language, debug);

    const withKeys = attachRequiredKeys(items, requiredMap);
    const filtered = filterNavTree(withKeys, userEntitlements);

    // Rebuild rendering.fields as the same shape: Record<string, NavItem>
    // We keep original keys where possible, but simplest is re-indexing:
    const newFields: Record<string, NavItem> = {};
    filtered.forEach((it, idx) => (newFields[String(idx)] = it));

    rendering.fields = newFields;

    if (debug) {
      console.log('[NAV][FILTERED]', {
        totalBefore: items.length,
        totalAfter: filtered.length,
        removed: items.length - filtered.length,
      });
    }
  }

  return nextLayout;
}
