'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  Text,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * VirtualTourBannerSection Component
 * Blue banner promoting 3D virtual tour (Hampton style)
 * 
 * Features:
 * - Full-width blue background
 * - Heading text
 * - CTA button for virtual tour
 */

interface Fields {
  /** Banner text (e.g., "Step inside the Hampton using our 3D virtual tour.") */
  Text: TextField;
  /** CTA link */
  CTALink: LinkField;
  /** CTA text */
  CTAText: TextField;
}

export type VirtualTourBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: VirtualTourBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component virtual-tour-banner-section bg-[#003057] py-8 md:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        {/* Text */}
        <p className="text-white text-lg md:text-xl mb-6">
          {fields.Text ? (
            <Text field={fields.Text} />
          ) : (
            'Step inside the Hampton using our 3D virtual tour.'
          )}
        </p>

        {/* CTA Button */}
        {fields.CTALink ? (
          <SitecoreLink
            field={fields.CTALink}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#003057] font-medium py-3 px-6 rounded transition-colors text-sm"
          />
        ) : (
          <button className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-[#003057] text-white font-medium py-3 px-6 rounded transition-colors text-sm bg-transparent">
            {fields.CTAText ? <Text field={fields.CTAText} /> : 'Have a look at this home'}
          </button>
        )}
      </div>
    </div>
  );
};
