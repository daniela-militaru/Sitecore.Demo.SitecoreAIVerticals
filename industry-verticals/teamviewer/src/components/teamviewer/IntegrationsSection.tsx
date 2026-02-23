'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  Placeholder,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  LinkText: TextField;
  Link: LinkField;
}

const defaultFields: Fields = {
  Heading: { value: 'Integrated into your systems' },
  LinkText: { value: 'View all integrations' },
  Link: { value: { href: '#integrations' } },
};

export type IntegrationsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IntegrationsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phIntegrationLogos = `integration-logos-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component integrations-section py-12 lg:py-20 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: 'rgb(247, 247, 247)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 lg:mb-12 lg:text-4xl">
          <Text field={fields.Heading} />
        </h2>

        {/*
          Integration logos grid:
          - Mobile / Tablet: 4 per row, centered
          - Desktop: all 8 in one row, centered
        */}
        <div className="integration-logos-grid mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:gap-x-12 lg:gap-y-6">
          <Placeholder name={phIntegrationLogos} rendering={props.rendering} />
        </div>

        {/* View All Link */}
        <div className="text-center">
          <SitecoreLink
            field={fields.Link}
            className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
          >
            <Text field={fields.LinkText} />
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Scoped styles: mobile/tablet 4 per row, desktop all in one row */}
      <style jsx>{`
        .integration-logos-grid :global(> *) {
          flex: 0 0 calc(25% - 1.5rem);
          max-width: calc(25% - 1.5rem);
        }
        @media (min-width: 1024px) {
          .integration-logos-grid :global(> *) {
            flex: 0 0 auto;
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
};
