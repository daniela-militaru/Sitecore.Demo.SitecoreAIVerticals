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
 * CaseStudySection Component
 * Featured client case study section
 * e.g., "Amazon overcame their payroll challenges with ADP"
 *
 * Layout:
 * - Title + subtitle
 * - Client logo (large, e.g. Amazon)
 * - Quote with author attribution
 * - Two CTA buttons ("Watch Video", "See case study")
 * - Light gray background
 */

interface Fields {
  Title: TextField;
  Subtitle: RichTextField;
  ClientLogo: ImageField;
  Image: ImageField;
  Quote: RichTextField;
  QuoteAuthor: TextField;
  CTA1Text: TextField;
  CTA1Link: LinkField;
  CTA2Text: TextField;
  CTA2Link: LinkField;
}

const defaultFields: Fields = {
  Title: { value: 'Amazon overcame their payroll challenges with ADP' },
  Subtitle: {
    value: '<p>Learn how ADP is supporting Amazon on the payroll transformation journey</p>',
  },
  ClientLogo: { value: { src: '/logos/amazon-large.svg', alt: 'Amazon' } },
  Image: { value: { src: '/images/amazon-workers.jpg', alt: 'Amazon delivery workers' } },
  Quote: {
    value:
      '<p>"Our ADP team is knowledgeable and there to advise us and answer our questions. That, combined with ADP\'s robust and adaptable global technology, gives us confidence that our employees are taken care of."</p>',
  },
  QuoteAuthor: { value: 'Greg Harmer, Global Head of Payroll, Amazon' },
  CTA1Text: { value: 'Watch Video' },
  CTA1Link: { value: { href: '/case-studies/amazon-video' } },
  CTA2Text: { value: 'See case study' },
  CTA2Link: { value: { href: '/case-studies/amazon' } },
};

export type CaseStudySectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CaseStudySectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <section
      className={`component case-study-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Title + Subtitle */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1A1A2E] lg:text-4xl">
            <Text field={fields.Title} />
          </h2>
          <div className="text-base text-[#555] lg:text-lg">
            <RichText field={fields.Subtitle} />
          </div>
        </div>

        {/* Two-column layout: image first on mobile, content left + image right on desktop */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image - First on mobile, right on desktop */}
          <div className="flex items-center justify-center lg:order-2 lg:justify-end">
            <SitecoreImage
              field={fields.Image}
              className="h-auto w-full max-w-lg rounded-lg object-cover lg:max-w-none"
            />
          </div>

          {/* Content: Logo, Quote, Author, CTAs - Second on mobile, left on desktop */}
          <div className="flex flex-col justify-center lg:order-1">
            {/* Client Logo */}
            <div className="mb-8">
              <SitecoreImage
                field={fields.ClientLogo}
                className="h-16 w-auto object-contain lg:h-20"
              />
            </div>

            {/* Quote */}
            <div className="mb-6 text-lg leading-relaxed text-[#1A1A2E] lg:text-xl">
              <RichText field={fields.Quote} />
            </div>

            {/* Quote Author */}
            <p className="mb-8 text-sm font-semibold text-[#1A1A2E]">
              <Text field={fields.QuoteAuthor} />
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <SitecoreLink
                field={fields.CTA1Link}
                className="inline-flex items-center justify-center rounded bg-[#D0271D] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#b8221a]"
              >
                <Text field={fields.CTA1Text} />
              </SitecoreLink>
              <SitecoreLink
                field={fields.CTA2Link}
                className="inline-flex items-center gap-2 text-base font-semibold text-[#D0271D] transition-colors hover:text-[#b8221a]"
              >
                <Text field={fields.CTA2Text} />
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </SitecoreLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
