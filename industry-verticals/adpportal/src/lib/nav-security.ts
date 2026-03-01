// lib/nav-security.ts
import { getRequiredAuth0EntitlementKeysForItem, userHasSomeRequiredKey } from './entitlements';

/**
 * Keep Title/NavigationTitle as unknown to avoid `any`.
 * Your Navigation.tsx will treat these as Sitecore field JSON objects anyway.
 */
export type NavItem = {
  Id: string;
  DisplayName?: string;
  Title?: unknown;
  NavigationTitle?: unknown;
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
      if (Array.isArray(it.Children) && it.Children.length > 0) walk(it.Children);
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

      if (debug && keys.length > 0) {
        console.log('[NAV][SECURED ITEM]', { itemId: id, requiredAuth0Keys: keys });
      }
    })
  );

  return map;
}

/**
 * Attach __requiredAuth0Keys to each nav node (returns a cloned tree).
 * IMPORTANT: do NOT assign Children: undefined (Next SSR serialization).
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
      }

      out.push(next);
    }

    return out;
  };

  return filterRec(items);
}

/**
 * ---- Layout traversal types (no `any`) ----
 */

type RenderingLike = {
  componentName?: string;
  name?: string;
  fields?: unknown;
  placeholders?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRenderingLike(value: unknown): value is RenderingLike {
  return isObject(value);
}

function getRoutePlaceholders(layout: unknown): unknown {
  if (!isObject(layout)) return undefined;
  const sitecore = layout['sitecore'];
  if (!isObject(sitecore)) return undefined;
  const route = sitecore['route'];
  if (!isObject(route)) return undefined;
  return route['placeholders'];
}

/**
 * Collect all renderings by walking placeholders recursively.
 * Placeholders in Layout Service can be:
 * - array of renderings
 * - object where each key -> array of renderings
 */
function findRenderings(layout: unknown): RenderingLike[] {
  const placeholders = getRoutePlaceholders(layout);
  if (!placeholders) return [];

  const found: RenderingLike[] = [];

  const walk = (node: unknown) => {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const entry of node) {
        if (isRenderingLike(entry)) {
          found.push(entry);
          if (entry.placeholders) walk(entry.placeholders);
        }
      }
      return;
    }

    if (isObject(node)) {
      for (const v of Object.values(node)) {
        walk(v);
      }
    }
  };

  walk(placeholders);
  return found;
}

/**
 * Extract nav items from a Navigation rendering fields structure:
 * In your component you do: Object.values(fields)
 * So here we interpret rendering.fields as a record of items.
 */
function extractNavItemsFromRendering(rendering: RenderingLike): NavItem[] | null {
  if (!rendering.fields || !isObject(rendering.fields)) return null;

  const values = Object.values(rendering.fields).filter(Boolean);

  const navLike = values.filter((v) => isObject(v) && typeof v['Id'] === 'string');
  if (navLike.length === 0) return null;

  // We trust the shape here because it came from your Navigation rendering fields.
  return navLike as unknown as NavItem[];
}

/**
 * Mutate layout: attach required keys and filter nav items SSR.
 * Returns a cloned layout object (safe to assign back to page.layout).
 */
export async function secureNavigationInLayout(opts: {
  layout: unknown;
  language: string;
  userEntitlements: Record<string, boolean>;
  debug?: boolean;
}): Promise<unknown> {
  const { layout, language, userEntitlements, debug } = opts;

  // If layout doesn't look like Sitecore Layout, no-op
  const routePlaceholders = getRoutePlaceholders(layout);
  if (!routePlaceholders) return layout;

  // Clone to avoid mutating original
  const nextLayout: unknown =
    typeof structuredClone === 'function'
      ? structuredClone(layout)
      : JSON.parse(JSON.stringify(layout));

  const renderings = findRenderings(nextLayout);

  for (const rendering of renderings) {
    const componentName = rendering.componentName ?? rendering.name;
    if (componentName !== 'Navigation') continue;

    const items = extractNavItemsFromRendering(rendering);
    if (!items) continue;

    const itemIds = collectNavItemIds(items);
    const requiredMap = await buildRequiredKeysMapForItemIds(itemIds, language, debug);

    const withKeys = attachRequiredKeys(items, requiredMap);
    const filtered = filterNavTree(withKeys, userEntitlements);

    // Rebuild rendering.fields as Record<string, NavItem>
    const newFields: Record<string, NavItem> = {};
    filtered.forEach((it, idx) => {
      newFields[String(idx)] = it;
    });

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
