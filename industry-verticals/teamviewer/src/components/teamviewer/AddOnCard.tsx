'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * AddOnCard Component
 * An add-on product card for the pricing page.
 *
 * Layout:
 * - Green "30-DAY FREE TRIAL" badge positioned overlapping the top-left card border
 * - Rounded illustration image area with light background
 * - Bold heading, gray description text
 * - Placeholder for HighlightItemCard children (checkmark list items)
 * - Optional CTA link at the bottom
 *
 * Responsive:
 * - Full width within its grid cell on all breakpoints
 */

interface Fields {
  Badge: TextField;
  Image: ImageField;
  Heading: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Badge: { value: '30-DAY FREE TRIAL' },
  Image: {
    value: {
      src: 'https://placehold.co/400x200/f0f4ff/6366f1?text=Add-On',
      alt: 'Add-on illustration',
      width: '400',
      height: '200',
    },
  },
  Heading: { value: 'Asset Management' },
  Description: {
    value:
      '<p>Discover and manage every single device, pieces of software, and hidden asset on your network. Benefit from:</p>',
  },
  CTAText: { value: 'Learn more' },
  CTALink: { value: { href: '#' } },
};

export type AddOnCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AddOnCardProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const { DynamicPlaceholderId } = props.params || {};
  const fields = props.fields || defaultFields;

  const phHighlightItems = `highlight-items-${DynamicPlaceholderId || '1'}`;

  return (
    <div className={`component add-on-card ${styles}`} id={id}>
      {/* Wrapper with relative positioning for the badge overlap */}
      <div className="relative pt-3">
        {/* Badge - overlaps the card top-left */}
        <div
          className="absolute top-0 left-4 z-10 rounded px-3 py-1 text-xs font-bold tracking-wide text-white uppercase"
          style={{ backgroundColor: '#1a8a3f' }}
        >
          <Text field={fields.Badge} />
        </div>

        {/* Card */}
        <div
          className="flex h-full flex-col overflow-hidden rounded-xl"
          style={{ border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}
        >
          {/* Image area */}
          <div
            className="flex items-center justify-center px-5 py-6"
            style={{ backgroundColor: '#f0f4ff', minHeight: '160px' }}
          >
            <SitecoreImage field={fields.Image} className="max-h-32 w-auto object-contain" />
          </div>

          {/* Content area */}
          <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
            {/* Heading */}

            <Text
              tag="h3"
              field={fields.Heading}
              className="mb-2 text-base font-bold"
              style={{ color: '#0d1b3e' }}
            />

            {/* Description */}

            <RichText
              tag="div"
              className="mb-3 text-sm leading-relaxed text-gray-500"
              field={fields.Description}
            />

            {/* Highlight items placeholder */}
            <div className="mb-4">
              <Placeholder name={phHighlightItems} rendering={props.rendering} />
            </div>

            {/* CTA link (optional) */}
            <div className="mt-auto">
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                <Text field={fields.CTAText} />
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </SitecoreLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
