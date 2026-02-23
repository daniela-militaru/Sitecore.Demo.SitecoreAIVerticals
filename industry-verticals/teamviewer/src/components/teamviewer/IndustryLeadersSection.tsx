'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Heading: { value: 'Industry leaders win with TeamViewer' },
  CTAText: { value: 'Discover more' },
  CTALink: { value: { href: '#case-studies' } },
};

export type IndustryLeadersSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IndustryLeadersSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phTestimonials = `testimonials-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component industry-leaders-section bg-white py-12 lg:py-20 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 lg:mb-14 lg:text-4xl">
          <Text field={fields.Heading} />
        </h2>

        {/*
          Testimonials layout:
          - Mobile: 1 card per row
          - Tablet: 2 per row, last card centered
          - Desktop: 3 per row, always centered
        */}
        <div className="testimonials-grid flex flex-wrap justify-center gap-6 lg:gap-8">
          <Placeholder name={phTestimonials} rendering={props.rendering} />
        </div>

        {/* Discover More Button */}
        <div className="mt-10 text-center lg:mt-14">
          <SitecoreLink
            field={fields.CTALink}
            className="inline-block rounded-full border border-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            <Text field={fields.CTAText} />
          </SitecoreLink>
        </div>
      </div>

      {/* Scoped styles: control card widths per breakpoint */}
      <style jsx>{`
        .testimonials-grid :global(> *) {
          flex: 0 0 100%;
          max-width: 100%;
        }
        @media (min-width: 640px) {
          .testimonials-grid :global(> *) {
            flex: 0 0 calc(50% - 0.75rem);
            max-width: calc(50% - 0.75rem);
          }
        }
        @media (min-width: 1024px) {
          .testimonials-grid :global(> *) {
            flex: 0 0 calc(33.333% - 1.334rem);
            max-width: calc(33.333% - 1.334rem);
          }
        }
      `}</style>
    </section>
  );
};
