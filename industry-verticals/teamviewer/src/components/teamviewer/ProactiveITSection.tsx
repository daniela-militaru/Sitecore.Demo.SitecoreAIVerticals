'use client';

import React, { type JSX } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'The pinnacle of proactive IT' },
};

export type ProactiveITSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ProactiveITSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phBenefitCards = `benefit-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component proactive-it-section py-12 lg:py-20 ${styles || ''}`}
      style={{ backgroundColor: 'rgb(247, 247, 247)' }}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 lg:mb-14 lg:text-4xl">
          <Text field={fields.Heading} className="text-[#050a52]" />
        </h2>

        {/*
          Benefits layout:
          - Mobile: 1 card per row
          - Tablet: 2 per row, last card centered
          - Desktop: 3 per row, always centered
        */}
        <div className="benefit-cards-grid flex flex-wrap justify-center gap-6 lg:gap-8">
          <Placeholder name={phBenefitCards} rendering={props.rendering} />
        </div>
      </div>

      {/* Scoped styles: control card widths per breakpoint */}
      <style jsx>{`
        .benefit-cards-grid :global(> *) {
          flex: 0 0 100%;
          max-width: 100%;
        }
        @media (min-width: 640px) {
          .benefit-cards-grid :global(> *) {
            flex: 0 0 calc(50% - 0.75rem);
            max-width: calc(50% - 0.75rem);
          }
        }
        @media (min-width: 1024px) {
          .benefit-cards-grid :global(> *) {
            flex: 0 0 calc(33.333% - 1.334rem);
            max-width: calc(33.333% - 1.334rem);
          }
        }
      `}</style>
    </section>
  );
};
