'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  RichTextField,
  Text,
  RichText,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * MyMillerHomeSection Component
 * Promotional section for My Miller Home app (Hampton page style)
 * 
 * Features:
 * - "Welcome To My Miller Home" heading
 * - Description text
 * - Benefits list
 * - CTA button
 * - Phone mockup image on right
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Description */
  Description: RichTextField;
  /** CTA link */
  CTALink: LinkField;
  /** CTA text */
  CTAText: TextField;
  /** Phone mockup image */
  Image: ImageField;
}

export type MyMillerHomeSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: MyMillerHomeSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component my-miller-home-section bg-[#f5f5f5] py-12 md:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-light mb-2">
              <span className="text-[#003057]">Welcome To</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-[#003057]">My</span>
              <span className="text-[#003057]"> Miller</span>
              <span className="text-[#0072CE]"> Home</span>
            </h3>

            {/* Description */}
            {fields.Description ? (
              <div className="prose prose-sm max-w-none text-[#4a4a4a] mb-6">
                <RichText field={fields.Description} />
              </div>
            ) : (
              <div className="text-[#4a4a4a] mb-6 space-y-4">
                <p>
                  My Miller Home is your personalised app and website where you can:
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE]">•</span>
                    <span>Save your favourite homes and developments in My Miller Home to browse at your leisure, while we keep you updated by managing the communications your receive from us as you and find the new home service at the moment you need</span>
                  </li>
                </ul>
              </div>
            )}

            {/* CTA Button */}
            {fields.CTALink ? (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center gap-2 border-2 border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-6 rounded transition-colors text-sm bg-transparent"
              />
            ) : (
              <button className="inline-flex items-center gap-2 border-2 border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-6 rounded transition-colors text-sm bg-transparent">
                {fields.CTAText ? <Text field={fields.CTAText} /> : 'Find Out More'}
              </button>
            )}
          </div>

          {/* Phone Mockup */}
          <div className="lg:w-1/3 flex-shrink-0">
            {fields.Image ? (
              <SitecoreImage
                field={fields.Image}
                className="w-full max-w-[280px] mx-auto h-auto"
              />
            ) : (
              <div className="w-full max-w-[280px] mx-auto aspect-[9/16] bg-gray-200 rounded-3xl flex items-center justify-center">
                <span className="text-[#4a4a4a] text-sm">Phone mockup</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
