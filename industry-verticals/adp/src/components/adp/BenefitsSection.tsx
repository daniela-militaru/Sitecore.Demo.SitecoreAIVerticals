'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * BenefitsSection Component
 * "The benefits of choosing ADP" section with a grid of BenefitCards
 *
 * Layout:
 * - Desktop: Title + 3x2 grid of BenefitCard components (via placeholder)
 * - Tablet: 3-column grid
 * - Mobile: Single column stacked cards
 * - White/light background
 */

interface Fields {
  Title: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'The benefits of choosing ADP' },
};

export type BenefitsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: BenefitsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phBenefitCards = `benefit-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component benefits-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1A1A2E] lg:mb-12 lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {/* Grid of BenefitCards */}
        <div className="benefits-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={phBenefitCards} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
