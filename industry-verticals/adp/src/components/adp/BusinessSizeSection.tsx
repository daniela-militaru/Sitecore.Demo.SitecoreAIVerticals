'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * BusinessSizeSection Component
 * "Payroll Services and HR solutions for your organisation's size"
 * Displays 4 BusinessSizeCards in a horizontal layout
 *
 * Layout:
 * - Title + subtitle text
 * - Desktop: 4-column grid of BusinessSizeCards (via placeholder)
 * - Tablet: 2-column grid
 * - Mobile: Single column stacked cards
 * - Phone number + Free Quote CTA at bottom
 * - Below cards: a grid of quick-link rows (Payroll Services, HR Services, etc.)
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
  PhoneNumber: TextField;
  FreeQuoteText: TextField;
  FreeQuoteLink: TextField;
}

const defaultFields: Fields = {
  Title: { value: "Payroll Services and HR solutions for your organisation's size" },
  Description: {
    value:
      "<p>With over 1,000,000 clients around the globe, we've worked with employers of every size. See how our integrated payroll services and HCM solutions can make work easier for the employees in your organisation.</p>",
  },
  PhoneNumber: { value: '0800 1707 677' },
  FreeQuoteText: { value: 'Free Quote' },
  FreeQuoteLink: { value: '/quote' },
};

export type BusinessSizeSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: BusinessSizeSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phBusinessCards = `business-size-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component business-size-section bg-[#F7F7F7] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {fields.Description?.value && (
          <div className="mx-auto mb-10 max-w-4xl text-center text-sm leading-relaxed text-[#555] lg:mb-12 lg:text-base">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Grid of BusinessSizeCards */}
        <div className="business-size-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Placeholder name={phBusinessCards} rendering={props.rendering} />
        </div>

        {/* Phone + CTA row */}
        {fields.PhoneNumber?.value && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-sm font-semibold text-[#333]">
              <Text field={fields.PhoneNumber} />
            </span>
            {fields.FreeQuoteText?.value && (
              <a
                href={fields.FreeQuoteLink?.value as string}
                className="inline-flex items-center rounded border-2 border-[#D0271D] px-4 py-1.5 text-sm font-semibold text-[#D0271D] transition-colors hover:bg-[#D0271D] hover:text-white"
              >
                <Text field={fields.FreeQuoteText} />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
