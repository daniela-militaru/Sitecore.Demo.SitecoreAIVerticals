'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Badge: TextField;
  Description: RichTextField;
  LinkText: TextField;
  Link: LinkField;
}

const defaultFields: Fields = {
  Badge: { value: 'TEAMVIEWER FOR ENTERPRISE' },
  Description: {
    value:
      'Secure, scalable, and flexible, TeamViewer solutions are built for the complex needs of global enterprises.',
  },
  LinkText: { value: 'Learn more' },
  Link: { value: { href: '#enterprise' } },
};

export type EnterpriseFeatureSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: EnterpriseFeatureSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component enterprise-feature-section text-white ${styles || ''}`}
      id={id}
      style={{ backgroundColor: '#0d1b3e' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        {/* Desktop layout: badge + description left, button right */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left side: badge + description */}
          <div className="flex flex-col gap-2">
            {/* Badge - only visible on desktop */}
            <div className="hidden lg:block">
              <span
                className="inline-block rounded px-3 py-1 text-xs font-bold tracking-wider text-white uppercase"
                style={{ backgroundColor: '#3056ef' }}
              >
                <Text field={fields.Badge} />
              </span>
            </div>

            {/* Description */}
            <RichText
              className="text-sm leading-relaxed text-white sm:text-base"
              field={fields.Description}
            />
          </div>

          {/* CTA - underlined link on mobile/tablet, outlined button on desktop */}
          <div className="shrink-0">
            {/* Mobile / Tablet: underlined link */}
            <SitecoreLink
              field={fields.Link}
              className="inline-block font-semibold text-white underline lg:hidden"
            >
              <Text field={fields.LinkText} />
            </SitecoreLink>

            {/* Desktop: outlined button */}
            <SitecoreLink
              field={fields.Link}
              className="hidden rounded-full border-2 border-white bg-white px-8 py-2.5 text-sm font-semibold transition-colors hover:bg-transparent hover:text-white lg:inline-block"
              style={{ color: '#0d1b3e' }}
            >
              <Text field={fields.LinkText} />
            </SitecoreLink>
          </div>
        </div>
      </div>
    </section>
  );
};
