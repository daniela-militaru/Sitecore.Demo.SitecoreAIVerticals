'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TrustedLogosSection Component
 * "Trusted by IT teams around the world" section with partner logos
 *
 * Layout:
 * - Desktop: up to 12 logos per row, centered
 * - Tablet / Mobile: up to 6 logos per row, centered, overflow wraps to next line
 * - Each row is always horizontally centered
 */

interface Fields {
  Heading: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Trusted by IT teams around the world' },
};

export type TrustedLogosSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TrustedLogosSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phLogos = `trusted-logos-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component trusted-logos-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <Text
          tag="h2"
          className="mb-2 text-center text-2xl font-bold lg:text-3xl"
          field={fields.Heading}
        />

        {/* Logos grid: flex-wrap with max items per row controlled via basis */}
        <div className="trusted-logos-grid flex flex-wrap items-center justify-center gap-6 lg:gap-8">
          <Placeholder name={phLogos} rendering={props.rendering} />
        </div>
      </div>

      {/* Scoped styles to size each logo item for correct wrapping:
          Mobile/Tablet: basis ~16.666% = max 6 per row
          Desktop: basis ~8.333% = max 12 per row */}
      <style jsx>{`
        .trusted-logos-grid :global(> *) {
          flex: 0 0 auto;
          max-width: calc(100% / 6 - 1.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .trusted-logos-grid :global(> *) {
            max-width: calc(100% / 12 - 2rem);
          }
        }
      `}</style>
    </section>
  );
};

export const Boxed = (props: TrustedLogosSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phLogos = `trusted-logos-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component trusted-logos-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <Text
          tag="h2"
          className="mb-2 text-center text-2xl font-bold lg:text-3xl"
          field={fields.Heading}
        />

        {/* Logos grid: flex-wrap with max items per row controlled via basis */}
        <div className="trusted-logos-grid flex flex-wrap items-center justify-center gap-6 lg:gap-8">
          <Placeholder name={phLogos} rendering={props.rendering} />
        </div>
      </div>

      {/* Scoped styles to size each logo item for correct wrapping:
          Mobile/Tablet: basis ~16.666% = max 6 per row
          Desktop: basis ~8.333% = max 12 per row */}
      <style jsx>{`
        .trusted-logos-grid :global(> *) {
          flex: 0 0 auto;
          max-width: calc(100% / 3 - 1.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .trusted-logos-grid :global(> *) {
            max-width: calc(100% / 6 - 2rem);
          }
        }
      `}</style>
    </section>
  );
};
