'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PromoBannerSection Component
 * Full-width promotional banner with colored background (e.g., red ADP banner)
 * "FREE PAYROLL MATURITY BENCHMARK TOOL"
 *
 * Layout:
 * - Desktop: Two-column (text + CTA left, image right) on colored background
 * - Mobile: Stacked vertically
 * - Bold uppercase text with CTA link/button
 */

interface Fields {
  Title: TextField;
  CTAText: TextField;
  CTALink: LinkField;
  BackgroundColor: TextField;
  Image: ImageField;
}

const defaultFields: Fields = {
  Title: { value: 'FREE PAYROLL MATURITY BENCHMARK TOOL' },
  CTAText: { value: 'Calculate your score today' },
  CTALink: { value: { href: '/payroll-maturity-benchmark' } },
  BackgroundColor: { value: '#D0271D' },
  Image: { value: { src: '/promo-benchmark.jpg', alt: 'Payroll Maturity Benchmark' } },
};

export type PromoBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PromoBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const bgColor = (fields.BackgroundColor?.value as string) || '#D0271D';

  return (
    <section
      className={`component promo-banner-section ${styles || ''}`}
      id={id}
      style={{ backgroundColor: bgColor }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6 py-10 lg:flex-row lg:justify-between lg:py-14">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="mb-4 text-2xl font-black uppercase leading-tight text-white lg:text-4xl">
              <Text field={fields.Title} />
            </h2>
            {fields.CTALink?.value?.href && (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center rounded border-2 border-white px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#D0271D]"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            )}
          </div>

          {/* Image */}
          {fields.Image?.value?.src && (
            <div className="shrink-0">
              <SitecoreImage
                field={fields.Image}
                className="h-40 w-auto rounded object-cover lg:h-52"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
