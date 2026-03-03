/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

import client from 'lib/sitecore-client';
import type { Session } from '@auth0/nextjs-auth0';
import { ENTITLEMENTS_CLAIM } from 'lib/entitlements';
import { getNavMetadata } from 'lib/nav-metadata';
import { enrichNavTree, filterNavTree, type NavFields } from 'lib/nav-apply';
import { getNavigationFieldsFromLayout, setNavigationFieldsOnLayout } from 'lib/nav-layout';

function getUserEntitlements(session: Session | null | undefined): Record<string, boolean> {
  const claim = session?.user?.[ENTITLEMENTS_CLAIM];
  if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
    return claim as Record<string, boolean>;
  }
  return {};
}

const EMPLOYEE_EMAIL_DOMAIN = (process.env.ADP_EMPLOYEE_EMAIL_DOMAIN || 'adp.com').toLowerCase();
function isEmployee(session: Session | null | undefined): boolean {
  const email = (session?.user?.email as string | undefined)?.toLowerCase();
  return Boolean(email && email.endsWith(`@${EMPLOYEE_EMAIL_DOMAIN}`));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie');

  try {
    const locale = typeof req.query.locale === 'string' ? req.query.locale : 'en';

    // Editing/Preview bypass: still apply redirects, skip entitlement filtering
    const isEditingOrPreview =
      req.query.editing === '1' ||
      req.query.preview === '1' ||
      (typeof req.query.sc_mode === 'string' &&
        ['edit', 'preview'].includes(req.query.sc_mode.toLowerCase()));

    const page = (await client.getPage('/', { locale })) as { layout?: unknown };
    if (!page?.layout) return res.status(200).json({ fields: {} });

    const session = await getSession(req, res);
    const entitlements = getUserEntitlements(session);
    const employee = isEmployee(session);

    const navFields = getNavigationFieldsFromLayout(page.layout);
    if (!navFields) return res.status(200).json({ fields: {} });

    const collectIds = (fields: NavFields): string[] => {
      const ids: string[] = [];
      const walk = (it: any) => {
        if (it?.Id) ids.push(it.Id);
        if (Array.isArray(it?.Children)) it.Children.forEach(walk);
      };
      Object.values(fields).forEach(walk);
      return [...new Set(ids)];
    };

    const ids = collectIds(navFields);

    // Always fetch redirects; only fetch entitlement keys when NOT editing/preview and NOT employee
    const meta = await getNavMetadata({
      itemIds: ids,
      language: locale,
      includeEntitlements: !isEditingOrPreview && !employee,
      debug: false,
    });

    // Always enrich (redirects always applied)
    const enriched = enrichNavTree({
      fields: navFields,
      redirectMap: meta.redirectMap,
      requiredKeysMap: meta.requiredKeysMap,
    });

    // Filter only when not editing/preview (filter function will bypass automatically)
    const filtered = filterNavTree({
      fields: enriched,
      userEntitlements: entitlements,
      isEditingOrPreview,
      isEmployee: employee,
    });

    setNavigationFieldsOnLayout(page.layout, filtered);

    const updated = getNavigationFieldsFromLayout(page.layout) || {};
    return res.status(200).json({ fields: updated });
  } catch (e: unknown) {
    console.error('[NAV API] error', e);
    return res.status(200).json({ fields: {} });
  }
}
