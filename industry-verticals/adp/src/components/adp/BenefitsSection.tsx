'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder, RichText, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * benefitsSection Component
 * "The benefits of choosing ADP" section with a grid of benefitCards
 *
 * Layout:
 * - Desktop: Title + 3x2 grid of benefitCard components (via placeholder)
 * - Tablet: 3-column grid
 * - Mobile: Single column stacked cards
 * - White/light background
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'The benefits of choosing ADP' },
  Description: { value: '<p>ADP provides a comprehensive suite of benefits to support your business needs.</p>' },
};

export type benefitsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: benefitsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phbenefitCards = `benefit-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component benefits-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1A1A2E] lg:mb-14 lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        <div className="benefits-description mb-10 text-center text-base text-[#555] lg:text-lg">
          <RichText field={fields.Description} />
        </div>

        {/* Flex grid of benefitCards -- centered, max 3 per row on md+ */}
        <div className="benefits-grid flex flex-wrap justify-center gap-6">
          <Placeholder name={phbenefitCards} rendering={props.rendering} />
        </div>
      </div>

      <style jsx>{`
        .benefits-description :global(a) {
          color: #D0271D;
          text-decoration: none;
        }
        .benefits-description :global(a:hover) {
          text-decoration: underline;
        }
        .benefits-grid :global(> .benefit-card) {
          width: 100%;
        }
        @media (min-width: 768px) {
          .benefits-grid :global(> .benefit-card) {
            width: calc(33.333% - 1rem);
          }
        }
      `}</style>
    </section>
  );
};
