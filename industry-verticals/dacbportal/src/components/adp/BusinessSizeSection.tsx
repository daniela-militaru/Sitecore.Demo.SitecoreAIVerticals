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
        <Text
          tag="h2"
          className="mb-4 text-center text-2xl font-bold text-[#1A1A2E] lg:text-3xl"
          field={fields.Title}
        />

        <RichText
          className="mx-auto mb-10 max-w-4xl text-center text-sm leading-relaxed text-[#555] lg:mb-12 lg:text-base"
          field={fields.Description}
        />

        {/* Flex grid of BusinessSizeCards -- centered, max 4 per row on md+ */}
        <div className="business-size-grid flex flex-wrap justify-center gap-6">
          <Placeholder name={phBusinessCards} rendering={props.rendering} />
        </div>
      </div>

      <style jsx>{`
        .business-size-grid :global(> .business-size-card) {
          width: 100%;
        }
        @media (min-width: 768px) {
          .business-size-grid :global(> .business-size-card) {
            width: calc(25% - 1.125rem);
          }
        }
      `}</style>
    </section>
  );
};
