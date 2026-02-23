'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichText,
  RichTextField,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  Description: RichTextField;
  ButtonText: TextField;
  ButtonLink: LinkField;
}

const defaultFields: Fields = {
  Heading: { value: "Let's find the right solution for your business" },
  Description: {
    value:
      '<p>Connect with one of our customer success specialists and start defining your TeamViewer setup.</p>',
  },
  ButtonText: { value: 'Get in touch' },
  ButtonLink: { value: { href: '#contact' } },
};

export type CTASectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CTASectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component cta-section py-14 text-white lg:py-20 ${styles || ''}`}
      id={id}
      style={{ backgroundColor: '#3355FF' }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
          <Text field={fields.Heading} />
        </h2>

        <div className="mb-8 text-base leading-relaxed text-white opacity-90 lg:text-lg">
          <RichText field={fields.Description} />
        </div>

        <SitecoreLink
          field={fields.ButtonLink}
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold transition-colors hover:bg-gray-100"
          style={{ color: '#0d1b3e' }}
        >
          <Text field={fields.ButtonText} />
        </SitecoreLink>
      </div>
    </section>
  );
};
