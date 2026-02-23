'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * AddOnsSection Component
 * "Enhance your TeamViewer experience with our advanced add-ons"
 *
 * Layout:
 * - Desktop: 3 cards per row, centered
 * - Tablet: 2 cards per row, last row centered
 * - Mobile: 1 card per row
 * - Subheading below the heading
 */

interface Fields {
  Heading: TextField;
  Subheading: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Enhance your TeamViewer experience with our advanced add-ons' },
  Subheading: { value: 'Add-ons can be selected at checkout.' },
};

export type AddOnsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AddOnsSectionProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const fields = props.fields || defaultFields;
  const { rendering, params } = props;

  const phAddOnCards = `add-on-cards-${params?.DynamicPlaceholderId || '1'}`;

  return (
    <section className={`component add-ons-section bg-white py-12 lg:py-20 ${styles}`} id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}

        <Text
          tag="h2"
          className="mb-2 text-center text-2xl font-bold lg:text-3xl"
          style={{ color: '#0d1b3e' }}
          field={fields.Heading}
        />

        {/* Subheading */}
        <p className="mb-10 text-center text-sm text-gray-500 lg:mb-14 lg:text-base">
          <Text field={fields.Subheading} />
        </p>

        {/* Add-on cards grid */}
        <div className="add-on-cards-grid flex flex-wrap justify-center gap-6 lg:gap-8">
          <Placeholder name={phAddOnCards} rendering={rendering} />
        </div>
      </div>

      {/* Scoped styles: 1 col mobile, 2 col tablet, 3 col desktop */}
      <style jsx>{`
        .add-on-cards-grid :global(> *) {
          flex: 0 0 100%;
          max-width: 100%;
        }
        @media (min-width: 640px) {
          .add-on-cards-grid :global(> *) {
            flex: 0 0 calc(50% - 0.75rem);
            max-width: calc(50% - 0.75rem);
          }
        }
        @media (min-width: 1024px) {
          .add-on-cards-grid :global(> *) {
            flex: 0 0 calc(33.333% - 1.334rem);
            max-width: calc(33.333% - 1.334rem);
          }
        }
      `}</style>
    </section>
  );
};
