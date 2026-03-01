// pages/api/nav.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

import client from 'lib/sitecore-client';
import { ENTITLEMENTS_CLAIM } from 'lib/entitlements';
import { secureNavigationInLayout } from 'lib/nav-security';

function getUserEntitlements(session: unknown): Record<string, boolean> {
  const user = (session as { user?: Record<string, unknown> } | null)?.user;
  const claim = user?.[ENTITLEMENTS_CLAIM];

  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as Record<string, boolean>;
  }
  return {};
}

type RenderingLike = {
  componentName?: string;
  name?: string;
  fields?: unknown;
  placeholders?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function findNavigationFields(node: unknown): unknown | null {
  if (!node) return null;

  if (Array.isArray(node)) {
    for (const entry of node) {
      if (isObject(entry)) {
        const r = entry as RenderingLike;
        const name = r.componentName ?? r.name;
        if (name === 'Navigation' && r.fields) return r.fields;

        const deep = findNavigationFields(r.placeholders);
        if (deep) return deep;
      }
    }
    return null;
  }

  if (isObject(node)) {
    for (const v of Object.values(node)) {
      const deep = findNavigationFields(v);
      if (deep) return deep;
    }
  }

  return null;
}

function getPlaceholdersFromLayout(layout: unknown): unknown {
  if (!isObject(layout)) return undefined;
  const sitecore = layout['sitecore'];
  if (!isObject(sitecore)) return undefined;
  const route = sitecore['route'];
  if (!isObject(route)) return undefined;
  return route['placeholders'];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // varies by auth cookie
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie');

  try {
    // Pull a fresh page layout from Edge (home is usually enough for global nav)
    const locale = typeof req.query.locale === 'string' ? req.query.locale : 'en';
    const pageUnknown: unknown = await client.getPage('/', { locale });

    const page = pageUnknown as { layout?: unknown };
    if (!page?.layout) {
      return res.status(200).json({ fields: {} });
    }

    const session = await getSession(req, res);
    const userEntitlements = getUserEntitlements(session);

    // Mutate layout with nav security
    const securedLayout = await secureNavigationInLayout({
      layout: page.layout,
      language: locale,
      userEntitlements,
      debug: true,
    });

    // Extract Navigation fields from mutated layout
    const placeholders = getPlaceholdersFromLayout(securedLayout);
    const navFields = (findNavigationFields(placeholders) as Record<string, unknown>) ?? {};

    console.log('[NAV API] returning fields keys:', Object.keys(navFields));

    return res.status(200).json({ fields: navFields });
  } catch (e: unknown) {
    console.error('[NAV API] error', e);
    return res.status(200).json({ fields: {} });
  }
}
