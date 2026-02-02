'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * AnnouncementBannerSection Component
 * Blue announcement banner for releases, events, special offers
 * 
 * Features:
 * - Dark blue background
 * - Heading and description
 * - Expandable "Read more" content
 */

interface Fields {
  /** Banner heading */
  Heading: TextField;
  /** Banner description */
  Description: RichTextField;
  /** Read more link */
  ReadMoreLink: LinkField;
}

export type AnnouncementBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AnnouncementBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component announcement-banner-section bg-[#003057] py-6 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          {fields.Heading && (
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              <Text field={fields.Heading} />
            </h2>
          )}

          {/* Description */}
          {fields.Description && (
            <div className="text-sm md:text-base text-white/90 mb-4 [&_a]:text-[#0072CE] [&_a]:underline">
              <RichText field={fields.Description} />
            </div>
          )}

          {/* Read More */}
          {fields.ReadMoreLink ? (
            <SitecoreLink
              field={fields.ReadMoreLink}
              className="inline-flex items-center gap-1 text-white hover:text-white/80 text-sm font-medium underline transition-colors"
            />
          ) : (
            <button className="inline-flex items-center gap-1 text-white hover:text-white/80 text-sm font-medium underline transition-colors">
              Read more
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
