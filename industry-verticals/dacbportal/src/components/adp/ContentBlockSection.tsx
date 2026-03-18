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
 * ContentBlockSection Component
 * Alternating image + text content block used on product pages (e.g. HCM).
 *
 * Layout:
 * - Desktop: Two-column layout with image on one side, text on the other
 * - Image position is configurable (left or right) via the ImagePosition field
 * - Text includes: heading, description, optional bullet points (RichText), CTA button
 * - Mobile: Stacked (image top, text below)
 * - Optional light gray background (alternating blocks)
 *
 * Usage examples on HCM page:
 * - "HCM management voor maximaal 1000 medewerkers" (image right)
 * - "HCM management voor ondernemingen met meer dan 1000 medewerkers" (image left)
 * - "Een alles-in-een oplossing voor al uw medewerkers" (image right)
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
  /** Optional bullet points or additional rich text content */
  BulletPoints: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
  BlockImage: ImageField;
  /** "left" or "right" -- determines which side the image appears on desktop */
  ImagePosition: TextField;
  /** Optional background color variant: "white" (default) or "gray" */
  BackgroundVariant: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'HCM management for up to 1000 employees' },
  Description: {
    value:
      '<p>HCM payroll is designed for small to medium-sized businesses looking for a uniform administration and accurate payroll.</p>',
  },
  BulletPoints: {
    value:
      '<ul><li>Manage payroll, HR administration, time, talent and people data via a single, intuitive employee system of record.</li><li>Access the information and compliance solutions you need to help businesses succeed.</li></ul>',
  },
  CTAText: { value: 'Explore HCM' },
  CTALink: { value: { href: '/hcm' } },
  BlockImage: {
    value: { src: '/images/hcm-block.jpg', alt: 'HCM management solutions' },
  },
  ImagePosition: { value: 'right' },
  BackgroundVariant: { value: 'white' },
};

export type ContentBlockSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContentBlockSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const imageOnLeft = (fields.ImagePosition?.value as string)?.toLowerCase() === 'left';
  const bgColor =
    (fields.BackgroundVariant?.value as string)?.toLowerCase() === 'gray'
      ? 'bg-[#F7F7F7]'
      : 'bg-white';

  return (
    <section
      className={`component content-block-section ${bgColor} py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex flex-col items-center gap-8 lg:gap-12 ${
            imageOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          {/* Image */}
          <div className="w-full flex-1">
            {fields.BlockImage?.value?.src && (
              <SitecoreImage
                field={fields.BlockImage}
                className="h-auto w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* Text Content */}
          <div className="w-full flex-1">
            <h2 className="mb-4 text-2xl leading-snug font-bold text-[#1A1A2E] lg:text-3xl">
              <Text field={fields.Title} />
            </h2>

            {fields.Description?.value && (
              <div className="mb-4 text-sm leading-relaxed text-[#555] lg:text-base">
                <RichText field={fields.Description} />
              </div>
            )}

            {fields.BulletPoints?.value && (
              <div className="content-block-bullets mb-6 text-sm leading-relaxed text-[#555] lg:text-base [&_li]:relative [&_li]:mb-2 [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-2 [&_li]:before:left-0 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-[#D0271D] [&_li]:before:content-[''] [&_ul]:list-none [&_ul]:pl-0">
                <RichText field={fields.BulletPoints} />
              </div>
            )}

            {fields.CTALink?.value?.href && fields.CTAText?.value && (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center rounded bg-[#D0271D] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
