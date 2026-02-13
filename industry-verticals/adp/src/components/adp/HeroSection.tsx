'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * HeroSection Component
 * ADP hero with headline, subtitle, optional email input + CTA, and hero image
 *
 * Layout:
 * - Desktop: Two-column (text left, image right) with white background
 * - Mobile: Stacked (text top, image bottom)
 * - Optionally features an email input field (homepage) or just a CTA button (product pages)
 * - Optional floating badges on the hero image
 *
 * Usage:
 * - Homepage: provide EmailPlaceholder + Badge fields for the full hero
 * - Product pages (e.g. HCM): omit EmailPlaceholder + Badges for a simpler hero
 */

interface Fields {
  Title: TextField;
  Subtitle: RichTextField;
  /** Optional -- if empty, only the CTA button is shown without an email input */
  EmailPlaceholder: TextField;
  CTAText: TextField;
  CTALink: LinkField;
  HeroImage: ImageField;
}

const defaultFields: Fields = {
  Title: { value: 'Experience better payroll and HR' },
  Subtitle: {
    value: '<p>Award-winning payroll services and HR solutions for all business sizes</p>',
  },
  EmailPlaceholder: { value: 'Enter your business email' },
  CTAText: { value: 'Get Pricing' },
  CTALink: { value: { href: '/get-pricing' } },
  HeroImage: { value: { src: '/hero-image.jpg', alt: 'ADP Payroll and HR Solutions' } },
};

export type HeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section className={`component hero-section bg-white py-8 lg:py-16 ${styles || ''}`} id={id}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 lg:max-w-lg lg:pt-8">
            <h1 className="mb-4 text-3xl leading-tight font-bold text-[#1A1A2E] lg:text-5xl lg:leading-tight">
              <Text field={fields.Title} />
            </h1>

            <div className="mb-6 text-base leading-relaxed text-[#555] lg:text-lg">
              <RichText field={fields.Subtitle} />
            </div>

            {/* Email Input + CTA (or just CTA if no email placeholder) */}
            {fields.EmailPlaceholder?.value ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder={fields.EmailPlaceholder.value as string}
                  className="flex-1 rounded border border-gray-300 px-4 py-3 text-sm text-[#333] transition-colors outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
                />
                <SitecoreLink
                  field={fields.CTALink}
                  className="inline-flex items-center justify-center rounded bg-[#D0271D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
                >
                  <Text field={fields.CTAText} />
                </SitecoreLink>
              </div>
            ) : (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center justify-center rounded bg-[#D0271D] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative flex-1">
            <div className="relative overflow-hidden rounded-lg">
              <SitecoreImage field={fields.HeroImage} className="h-auto w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
