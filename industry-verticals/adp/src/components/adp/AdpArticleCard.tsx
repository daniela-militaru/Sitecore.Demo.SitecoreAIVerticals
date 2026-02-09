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
import { ArrowRight } from 'lucide-react';

/**
 * ArticleCard Component
 * Individual article/insight card used inside ArticlesCarouselSection
 *
 * Layout:
 * - Article image at top
 * - Category/tag label (e.g., "GUIDEBOOK", "STORY", "REPORT")
 * - Article title
 * - CTA link with arrow (e.g., "Download now", "Access the study", "Download report")
 * - White card with subtle border
 */

interface Fields {
  Image: ImageField;
  Tag: TextField;
  Title: TextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Image: { value: { src: '/articles/payroll-guide.jpg', alt: 'Payroll Guide' } },
  Tag: { value: 'GUIDEBOOK' },
  Title: { value: "What's the potential of your payroll organisation in 2026?" },
  CTAText: { value: 'Download now' },
  CTALink: { value: { href: '/articles/payroll-potential' } },
};

export type ArticleCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ArticleCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Title?.value;
  if (!hasContent) return null;

  return (
    <div
      className={`component article-card w-full shrink-0 px-2 md:w-1/2 lg:w-1/3 ${styles || ''}`}
      id={id}
    >
      <div className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm">
        {/* Image */}
        {fields.Image?.value?.src && (
          <div className="relative aspect-4/3 overflow-hidden bg-[#0A1F4A]">
            <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex grow flex-col p-6 lg:p-8">
          {/* Tag */}
          {fields.Tag?.value && (
            <p className="mb-4 text-xs font-bold tracking-widest text-[#555] uppercase">
              <Text field={fields.Tag} />
            </p>
          )}

          {/* Title - Plain text */}
          <h3 className="mb-auto text-xl leading-snug font-normal text-[#1A1A2E] lg:text-2xl">
            <Text field={fields.Title} />
          </h3>

          {/* Separator line */}
          <div className="my-8 border-t border-gray-300" />

          {/* CTA */}
          {fields.CTALink?.value?.href && (
            <SitecoreLink
              field={fields.CTALink}
              className="inline-flex items-center gap-2 text-base font-semibold text-[#D0271D] transition-colors hover:text-[#b8221a]"
            >
              <Text field={fields.CTAText} />
              <ArrowRight className="h-4 w-4" />
            </SitecoreLink>
          )}
        </div>
      </div>
    </div>
  );
};
