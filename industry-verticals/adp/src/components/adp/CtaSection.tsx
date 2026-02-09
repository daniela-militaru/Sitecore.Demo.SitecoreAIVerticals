'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  LinkField,
  ImageField,
  Link as SitecoreLink,
  Image as SitecoreImage,
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
  Image: ImageField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Title: { value: 'Find the perfect solution for your business' },
  Description: {
    value:
      "<p>You know your business, industry, and employees better than anyone. Tell us some details and we'll recommend a solution that matches your needs.</p>",
  },
  Image: { value: { src: '/images/cta-banner-image.jpg', alt: 'CTA Banner Image' } },
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
      className={`component cta-banner-section bg-[#0A1F44] py-16 lg:py-20 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left: Text & CTA */}
          <div className="flex w-full flex-col items-center lg:w-1/2 lg:items-start">
            <h2 className="mb-5 text-center text-3xl leading-tight font-bold text-white lg:text-left lg:text-4xl xl:text-5xl">
              <Text field={fields.Title} />
            </h2>

            <div className="mb-6 text-center text-base leading-relaxed text-white lg:mb-8 lg:text-left lg:text-lg">
              <RichText field={fields.Description} />
            </div>

            {fields.CTALink?.value?.href ? (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex w-full items-center justify-center rounded-lg bg-white px-10 py-4 text-base font-semibold text-[#D0271D] transition-colors hover:bg-gray-100 sm:w-auto lg:px-8 lg:py-3"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            ) : (
              <button className="inline-flex w-full items-center justify-center rounded-lg bg-white px-10 py-4 text-base font-semibold text-[#D0271D] transition-colors hover:bg-gray-100 sm:w-auto lg:px-8 lg:py-3">
                <Text field={fields.CTAText} />
              </button>
            )}
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2">
            <SitecoreImage
              field={fields.Image}
              className="w-full object-contain"
              alt={fields.Image?.value?.alt || 'Dashboard mockup'}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
