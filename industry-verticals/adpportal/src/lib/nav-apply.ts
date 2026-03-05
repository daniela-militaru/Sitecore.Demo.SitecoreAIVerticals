// lib/nav-apply.ts
import { getOrSetAccessDecision } from 'lib/entitlements';

export type NavItem = {
  Id: string;
  Href: string;
  Querystring: string;
  Children?: NavItem[];
  Styles?: string[];
  __requiredAuth0Keys?: string[];
};

export type NavFields = Record<string, NavItem>;
export type RedirectMap = Record<string, string>;
export type RequiredKeysMap = Record<string, string[]>;

/**
 * MUST match nav-metadata.ts normalization:
 * - remove braces
 * - remove dashes
 * - lowercase
 *
 * This makes:
 *   "d1d29ce1-878a-479f-8ae6-878634a68ad5"
 * and
 *   "D1D29CE1878A479F8AE6878634A68AD5"
 * map to the same key.
 */
function normalizeId(id: string): string {
  return id.trim().replace(/[{}-]/g, '').toLowerCase();
}

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || /^(mailto:|tel:)/i.test(href);
}

function normalizeHref(input?: string | null): string {
  if (!input) return '/';
  const trimmed = input.trim();

  // Keep absolute URLs or schemes as-is
  if (isExternalHref(trimmed)) return trimmed;

  // Internal path
  const base = trimmed.split('#')[0].split('?')[0];
  const withSlash = base.startsWith('/') ? base : `/${base}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

export function enrichNavTree(params: {
  fields: NavFields;
  redirectMap: RedirectMap; // normalized itemId -> redirectUrl
  requiredKeysMap: RequiredKeysMap; // normalized itemId -> required auth0 keys
  debug?: boolean;
  traceId?: string;
}): NavFields {
  const { fields, redirectMap, requiredKeysMap, debug, traceId } = params;

  const rewriteItem = (it: NavItem): NavItem => {
    const idKey = normalizeId(it.Id);

    const next: NavItem = {
      ...it,
      __requiredAuth0Keys: requiredKeysMap[idKey] ?? [],
    };

    // Debug: show the join result per item
    if (debug) {
      console.log('[NAV APPLY][JOIN]', {
        traceId,
        id: it.Id,
        idKey,
        hasRequired: (next.__requiredAuth0Keys?.length ?? 0) > 0,
        hasRedirect: Boolean(redirectMap[idKey]),
      });
    }

    const redirectTo = redirectMap[idKey];
    if (redirectTo) {
      const before = next.Href;
      next.Href = normalizeHref(redirectTo);

      if (debug) {
        console.log('[NAV APPLY][REDIRECT]', {
          traceId,
          idKey,
          before,
          after: next.Href,
          redirectTo,
        });
      }
    }

    if (Array.isArray(it.Children) && it.Children.length > 0) {
      next.Children = it.Children.map(rewriteItem);
    }

    if (debug && (next.__requiredAuth0Keys?.length || 0) > 0) {
      console.log('[NAV APPLY][REQ]', { traceId, idKey, keys: next.__requiredAuth0Keys });
    }

    return next;
  };

  const out: NavFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (!v) continue;
    out[k] = rewriteItem(v);
  }
  return out;
}

export function filterNavTree(params: {
  fields: NavFields;
  userEntitlements: Record<string, boolean>;
  isEditingOrPreview: boolean;
  isEmployee: boolean;
  language: string;
  userSub: string | undefined;
  debug?: boolean;
  traceId?: string;
}): NavFields {
  const {
    fields,
    userEntitlements,
    isEditingOrPreview,
    isEmployee,
    language,
    userSub,
    debug,
    traceId,
  } = params;

  if (isEditingOrPreview || isEmployee) return fields;

  const filterItem = (it: NavItem): NavItem | null => {
    const required = it.__requiredAuth0Keys ?? [];
    const allowed = getOrSetAccessDecision(it.Id, language, required, userEntitlements, userSub);

    if (!allowed) {
      if (debug) {
        console.log('[NAV FILTER][DENY]', {
          traceId,
          id: it.Id,
          idKey: normalizeId(it.Id),
          required,
        });
      }
      return null;
    }

    const next: NavItem = { ...it };

    if (Array.isArray(it.Children) && it.Children.length > 0) {
      const kids = it.Children.map(filterItem).filter((x): x is NavItem => Boolean(x));
      if (kids.length > 0) next.Children = kids;
    }

    return next;
  };

  const out: NavFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (!v) continue;
    const filtered = filterItem(v);
    if (filtered) out[k] = filtered;
  }

  if (debug) {
    console.log('[NAV FILTER][DONE]', {
      traceId,
      before: Object.keys(fields).length,
      after: Object.keys(out).length,
    });
  }

  return out;
}
