'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Menu } from 'lucide-react';

/**
 * StickyCtaBarSection Component
 * Sticky bottom bar visible on mobile/tablet with hamburger, ADP logo, phone number, and Free Quote button
 *
 * Layout:
 * - Fixed to bottom of viewport on mobile/tablet
 * - Hidden on desktop (lg and above)
 * - Left: hamburger menu icon
 * - Center: ADP logo + phone number
 * - Right: "Free Quote" bordered button
 */

interface Fields {
  Logo: ImageField;
  PhoneNumber: TextField;
  PhoneLink: LinkField;
  FreeQuoteText: TextField;
  FreeQuoteLink: LinkField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/adp-logo.svg', alt: 'ADP' } },
  PhoneNumber: { value: '0800 1707 677' },
  PhoneLink: { value: { href: 'tel:08001707677' } },
  FreeQuoteText: { value: 'Free Quote' },
  FreeQuoteLink: { value: { href: '/quote' } },
};

export type StickyCtaBarSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: StickyCtaBarSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`component sticky-cta-bar-section fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg lg:hidden ${styles || ''}`}
      id={id}
    >
      <div className="flex items-center justify-between px-3 py-2">
        {/* Hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center text-[#333]"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo + Phone */}
        <div className="flex items-center gap-3">
          {fields.Logo?.value?.src ? (
            <SitecoreImage field={fields.Logo} className="h-6 w-auto" />
          ) : (
            <span className="text-lg font-black text-[#D0271D]">adp</span>
          )}

          {fields.PhoneLink?.value?.href && (
            <SitecoreLink field={fields.PhoneLink} className="text-xs font-semibold text-[#333]">
              <Text field={fields.PhoneNumber} />
            </SitecoreLink>
          )}
        </div>

        {/* Free Quote Button */}
        {fields.FreeQuoteLink?.value?.href && (
          <SitecoreLink
            field={fields.FreeQuoteLink}
            className="inline-flex items-center rounded border-2 border-[#D0271D] px-3 py-1 text-xs font-semibold text-[#D0271D] transition-colors hover:bg-[#D0271D] hover:text-white"
          >
            <Text field={fields.FreeQuoteText} />
          </SitecoreLink>
        )}
      </div>
    </div>
  );
};
