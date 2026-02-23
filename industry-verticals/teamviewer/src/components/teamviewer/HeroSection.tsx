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
  Badge: TextField;
  Heading: TextField;
  Subheading: RichTextField;
  PrimaryButtonText: TextField;
  PrimaryButtonLink: LinkField;
  SecondaryButtonText: TextField;
  SecondaryButtonLink: LinkField;
}

const defaultFields: Fields = {
  Badge: { value: 'NEW' },
  Heading: { value: 'Automated IT. Powered by AI.' },
  Subheading: {
    value: '<p>The remote technology you know and trust, built better.</p>',
  },
  PrimaryButtonText: { value: 'Free business trial' },
  PrimaryButtonLink: { value: { href: '#trial' } },
  SecondaryButtonText: { value: 'View plans and pricing' },
  SecondaryButtonLink: { value: { href: '#pricing' } },
};

export type HeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component hero-section relative overflow-hidden bg-linear-to-br from-[#0B1742] via-[#1a2560] to-[#0B1742] py-16 lg:py-24 ${styles || ''}`}
      id={id}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(82, 139, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(82, 139, 255, 0.15) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1a2560] px-4 py-2 text-sm">
            <span className="rounded bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
              <Text field={fields.Badge} />
            </span>
            <span className="text-white">
              Learn IT lessons, enter the era of proactive IT with TeamViewer ONE
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl xl:text-6xl">
          <Text field={fields.Heading} />
        </h1>

        {/* Subheading */}
        <div className="hero-subheading mb-8 text-lg text-blue-100 lg:text-xl">
          <RichText field={fields.Subheading} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SitecoreLink
            field={fields.PrimaryButtonLink}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700"
          >
            <Text field={fields.PrimaryButtonText} />
          </SitecoreLink>
          <SitecoreLink
            field={fields.SecondaryButtonLink}
            className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
          >
            <Text field={fields.SecondaryButtonText} />
          </SitecoreLink>
        </div>
      </div>
    </section>
  );
};
