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

export type FeaturesSectionProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Heading: { value: 'TeamViewer ONE' },
  LinkText: { value: 'Explore the all-in-one platform' },
  Link: { value: { href: '#platform' } },
};

export const Default = (props: FeaturesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phFeatureCards = `feature-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component features-section bg-gray-50 py-12 lg:py-16 ${styles || ''} pr-4`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <Text
          tag="h2"
          field={fields.Heading}
          className="mb-8 text-center text-2xl font-bold text-gray-900 lg:text-3xl"
        />

        {/* Feature Cards Grid */}
        <div className="col-12 mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Placeholder name={phFeatureCards} rendering={props.rendering} />
        </div>

        {/* Link */}
        <div className="text-center">
          <SitecoreLink
            field={fields.Link}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <Text field={fields.LinkText} />
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </SitecoreLink>
        </div>
      </div>
    </section>
  );
};
