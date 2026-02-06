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
  PhoneNumber: TextField;
  FreeQuoteText: TextField;
  FreeQuoteLink: LinkField;
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
  PhoneNumber: { value: '0800 1707 677' },
  FreeQuoteText: { value: 'Free Quote' },
  FreeQuoteLink: { value: { href: '/quote' } },
  Quote: {
    value:
      '<p>"Our ADP team is knowledgeable and there to advise us and answer our questions. That, combined with ADP\'s robust and adaptable global technology, gives us confidence our employees are taken care of."</p>',
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
      className={`component case-study-section bg-[#F7F7F7] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {/* Subtitle */}
        {fields.Subtitle?.value && (
          <div className="mb-8 text-sm text-[#555] lg:text-base">
            <RichText field={fields.Subtitle} />
          </div>
        )}

        {/* Client Logo */}
        {fields.ClientLogo?.value?.src && (
          <div className="mb-8 flex justify-center">
            <SitecoreImage
              field={fields.ClientLogo}
              className="h-12 w-auto object-contain lg:h-16"
            />
          </div>
        )}

        {/* Phone + Free Quote bar */}
        {fields.PhoneNumber?.value && (
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="text-sm font-semibold text-[#333]">
              <Text field={fields.PhoneNumber} />
            </span>
            {fields.FreeQuoteLink?.value?.href && (
              <SitecoreLink
                field={fields.FreeQuoteLink}
                className="inline-flex items-center rounded border-2 border-[#D0271D] px-4 py-1.5 text-sm font-semibold text-[#D0271D] transition-colors hover:bg-[#D0271D] hover:text-white"
              >
                <Text field={fields.FreeQuoteText} />
              </SitecoreLink>
            )}
          </div>
        )}

        {/* Quote */}
        {fields.Quote?.value && (
          <div className="mb-4 text-base leading-relaxed text-[#333] italic lg:text-lg">
            <RichText field={fields.Quote} />
          </div>
        )}

        {/* Quote Author */}
        {fields.QuoteAuthor?.value && (
          <p className="mb-8 text-sm text-[#555]">
            <Text field={fields.QuoteAuthor} />
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {fields.CTA1Link?.value?.href && (
            <SitecoreLink
              field={fields.CTA1Link}
              className="inline-flex min-w-40 items-center justify-center rounded bg-[#D0271D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
            >
              <Text field={fields.CTA1Text} />
            </SitecoreLink>
          )}
          {fields.CTA2Link?.value?.href && (
            <SitecoreLink
              field={fields.CTA2Link}
              className="inline-flex min-w-40 items-center justify-center rounded border-2 border-[#1A1A2E] px-6 py-3 text-sm font-semibold text-[#1A1A2E] transition-colors hover:bg-[#1A1A2E] hover:text-white"
            >
              <Text field={fields.CTA2Text} />
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </SitecoreLink>
          )}
        </div>
      </div>
    </section>
  );
};
