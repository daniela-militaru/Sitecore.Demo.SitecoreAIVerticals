// pages/api/nav.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

import client from 'lib/sitecore-client';
import { ENTITLEMENTS_CLAIM } from 'lib/entitlements';
import { secureNavigationInLayout } from 'lib/nav-security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This varies by auth cookie
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie');

  try {
    // Pull a fresh page layout from Edge (home is usually enough to obtain global navigation)
    const locale = (req.query.locale as string) || 'en';
    const page = await client.getPage('/', { locale });

    if (!page?.layout) {
      return res.status(200).json({ fields: {} });
    }

    const session = await getSession(req, res);
    const userEntitlements =
      (session?.user?.[ENTITLEMENTS_CLAIM] as Record<string, boolean> | undefined) || {};

    // Mutate layout with nav security
    page.layout = await secureNavigationInLayout({
      layout: page.layout,
      language: locale,
      userEntitlements,
      debug: true,
    });

    // Extract the Navigation rendering fields from the mutated layout and return it.
    // The client component expects Record<string, NavItemFields>.
    const route = page.layout?.sitecore?.route;
    const placeholders = route?.placeholders;

    const findNavigationFields = (node: any): any | null => {
      if (!node) return null;
      if (Array.isArray(node)) {
        for (const r of node) {
          const name = r?.componentName || r?.name;
          if (name === 'Navigation' && r?.fields) return r.fields;
          const deep = findNavigationFields(r?.placeholders);
          if (deep) return deep;
        }
        return null;
      }
      if (typeof node === 'object') {
        for (const key of Object.keys(node)) {
          const deep = findNavigationFields(node[key]);
          if (deep) return deep;
        }
      }
      return null;
    };

    const navFields = findNavigationFields(placeholders) || {};
    console.log('[NAV API] returning fields keys:', Object.keys(navFields || {}));

    return res.status(200).json({ fields: navFields });
  } catch (e: any) {
    console.error('[NAV API] error', e);
    return res.status(200).json({ fields: {} });
  }
}
