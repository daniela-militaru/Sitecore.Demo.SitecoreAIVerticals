// lib/nav-layout.ts
import type { NavFields } from 'lib/nav-apply';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

type RenderingLike = {
  componentName?: string;
  name?: string;
  fields?: unknown;
  placeholders?: unknown;
};

function findNavigationRendering(layout: unknown): RenderingLike | null {
  if (!isObject(layout)) return null;
  const sitecore = layout['sitecore'];
  if (!isObject(sitecore)) return null;
  const route = sitecore['route'];
  if (!isObject(route)) return null;

  const walk = (node: unknown): RenderingLike | null => {
    if (!node) return null;

    if (Array.isArray(node)) {
      for (const entry of node) {
        if (isObject(entry)) {
          const r = entry as RenderingLike;
          const name = r.componentName ?? r.name;
          if (name === 'Navigation') return r;

          const deep = walk(r.placeholders);
          if (deep) return deep;
        }
      }
      return null;
    }

    if (isObject(node)) {
      for (const v of Object.values(node)) {
        const deep = walk(v);
        if (deep) return deep;
      }
    }
    return null;
  };

  return walk(route['placeholders']);
}

export function getNavigationFieldsFromLayout(layout: unknown): NavFields | null {
  const r = findNavigationRendering(layout);
  if (!r?.fields || typeof r.fields !== 'object') return null;
  return r.fields as NavFields;
}

export function setNavigationFieldsOnLayout(layout: unknown, newFields: NavFields): unknown {
  const r = findNavigationRendering(layout);
  if (!r) return layout;
  r.fields = newFields;
  return layout;
}
