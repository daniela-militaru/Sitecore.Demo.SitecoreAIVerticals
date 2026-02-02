'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
  Text,
  RichText,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PersonaliseSection Component
 * "Personalise your brand new home" promotional section
 * 
 * Features:
 * - Dark blue background
 * - Title and description
 * - CTA buttons
 * - Optional image
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Primary CTA link */
  PrimaryLink: LinkField;
  /** Secondary CTA link */
  SecondaryLink: LinkField;
  /** Background or feature image */
  Image: ImageField;
}

export type PersonaliseSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PersonaliseSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component personalise-section bg-[#003057] py-12 md:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-4">
            {fields.Title ? (
              <Text field={fields.Title} />
            ) : (
              <>
                <span className="font-bold">Personalise your</span>
                <br />
                brand new home
              </>
            )}
          </h2>

          {/* Description */}
          {fields.Description && (
            <div className="text-white/80 mb-6 max-w-xl">
              <RichText field={fields.Description} />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {fields.PrimaryLink ? (
              <SitecoreLink
                field={fields.PrimaryLink}
                className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors"
              />
            ) : (
              <button className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors">
                Use our options visualiser
              </button>
            )}

            {fields.SecondaryLink ? (
              <SitecoreLink
                field={fields.SecondaryLink}
                className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-[#003057] font-medium py-3 px-6 rounded transition-colors bg-transparent"
              />
            ) : (
              <button className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-[#003057] font-medium py-3 px-6 rounded transition-colors bg-transparent">
                Download options brochure
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
