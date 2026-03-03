// src/helpers/navHelpers.tsx

import type { JSX } from 'react';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';

/**
 * IMPORTANT:
 * Do NOT import runtime values from Navigation.tsx here.
 * Only types (or define them locally) to avoid circular dependencies:
 * Navigation.tsx -> navHelpers.tsx -> Navigation.tsx
 */

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
  __requiredAuth0Keys?: string[];
}

export type NavigationFields = Record<string, NavItemFields>;

export const isNavLevel = (fields: NavItemFields, level: number): boolean => {
  return Array.isArray(fields.Styles) && fields.Styles.includes(`level${level}`);
};

export const isNavRootItem = (fields: NavItemFields): boolean => {
  const isFlatLevel =
    Array.isArray(fields.Styles) && fields.Styles.some((style) => style.startsWith('flat-level'));
  return isNavLevel(fields, 0) && !isFlatLevel;
};

export const getLinkContent = (fields: NavItemFields, logoSrc?: string): JSX.Element | string => {
  const isRootItem = isNavRootItem(fields);

  if (isRootItem && logoSrc) {
    const altText =
      fields.NavigationTitle?.value || fields.Title?.value || fields.DisplayName || '';
    return <img src={logoSrc} alt={String(altText)} className="h-auto w-36" />;
  }

  const textField = fields.NavigationTitle || fields.Title;
  if (textField) return <Text field={textField} />;

  return fields.DisplayName;
};

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || /^(mailto:|tel:)/i.test(href);
}

function buildHref(href: string, qs: string): string {
  const base = (href || '/').trim() || '/';
  const query = (qs || '').trim();

  if (!query) return base;
  if (isExternalHref(base)) return base; // don't append querystring to external links

  const clean = query.startsWith('?') ? query.slice(1) : query;
  return base.includes('?') ? `${base}&${clean}` : `${base}?${clean}`;
}

export const getLinkField = (fields: NavItemFields): LinkField => {
  const href = buildHref(fields.Href, fields.Querystring);

  const text =
    fields.NavigationTitle?.value?.toString() ??
    fields.Title?.value?.toString() ??
    fields.DisplayName;

  return {
    value: {
      href,
      linktype: isExternalHref(href) ? 'external' : 'internal',
      title: text,
      text,
      querystring: '', // already merged into href
      anchor: '',
      target: '',
      class: '',
    },
  };
};

/**
 * SXA nav provider sometimes delivers a single root item with Children.
 * This flattens that into top-level items so your component can render it.
 */
export const prepareFields = (fields: NavigationFields, center = true): NavigationFields => {
  const result: NavigationFields = {};
  const entries = Object.entries(fields).filter(([, v]) => Boolean(v));

  if (entries.length === 1 && isNavRootItem(entries[0][1])) {
    const rootItem = entries[0][1];
    const children = rootItem.Children || [];

    const flattenedChildren = [...children];

    const rootClone: NavItemFields = { ...rootItem };
    // IMPORTANT: do not set Children: undefined; remove it
    delete rootClone.Children;

    if (center) {
      const middleIndex = Math.floor(children.length / 2);
      flattenedChildren.splice(middleIndex, 0, rootClone);
    } else {
      flattenedChildren.unshift(rootClone);
    }

    flattenedChildren.forEach((item, idx) => {
      result[String(idx)] = item;
    });

    return result;
  }

  for (const [key, item] of entries) {
    result[key] = item;
  }

  return result;
};
