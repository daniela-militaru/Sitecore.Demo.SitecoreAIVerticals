'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * CtaBannerSection Component
 * "Find the perfect solution for your business" CTA banner
 *
 * Layout:
 * - Light gray/blue background
 * - Centered or left-aligned title + description + CTA button
 * - Desktop: horizontal padding, Mobile: stacked
 * - Used for midpage call-to-action sections
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Title: { value: 'Find the perfect solution for your business' },
  Description: {
    value:
      "<p>You know your business, industry, and employees better than anyone. Tell us some details and we'll recommend a solution that matches your needs.</p>",
  },
  CTAText: { value: 'Start Your Quote' },
  CTALink: { value: { href: '/quote' } },
};

export type CtaBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CtaBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component cta-banner-section bg-[#F7F7F7] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-3xl px-4 text-center lg:text-left">
        <h2 className="mb-4 text-2xl font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        <div className="mb-6 text-sm leading-relaxed text-[#555] lg:text-base">
          <RichText field={fields.Description} />
        </div>

        {fields.CTALink?.value?.href && (
          <SitecoreLink
            field={fields.CTALink}
            className="inline-flex items-center rounded border-2 border-[#D0271D] px-6 py-2.5 text-sm font-semibold text-[#D0271D] transition-colors hover:bg-[#D0271D] hover:text-white"
          >
            <Text field={fields.CTAText} />
          </SitecoreLink>
        )}
      </div>
    </section>
  );
};
