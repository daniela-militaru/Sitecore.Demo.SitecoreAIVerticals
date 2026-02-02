'use client';

import type { JSX } from 'react';
import {
  TextField,
  LinkField,
  ImageField,
  Text,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DevelopmentHeroSection Component
 * Hero section for development detail pages with virtual tour overlay
 * 
 * Features:
 * - Large hero image with carousel navigation
 * - "View our homes from anywhere" virtual tour overlay
 * - Map toggle button
 */

interface Fields {
  /** Hero image */
  Image: ImageField;
  /** Virtual tour heading */
  VirtualTourHeading: TextField;
  /** Virtual tour subheading */
  VirtualTourSubheading: TextField;
  /** Virtual tour CTA */
  VirtualTourLink: LinkField;
  /** Map button text */
  MapButtonText: TextField;
}

export type DevelopmentHeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentHeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component development-hero-section relative ${styles || ''}`}
      id={id}
    >
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        {fields.Image && (
          <SitecoreImage
            field={fields.Image}
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation Arrows */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10">
          <ChevronLeft className="w-6 h-6 text-[#003057]" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10">
          <ChevronRight className="w-6 h-6 text-[#003057]" />
        </button>

        {/* Virtual Tour Overlay */}
        <div className="absolute inset-0 bg-[#003057]/70 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-2">
              {fields.VirtualTourHeading ? (
                <Text field={fields.VirtualTourHeading} />
              ) : (
                'View our homes from anywhere'
              )}
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-6 max-w-md mx-auto">
              {fields.VirtualTourSubheading ? (
                <Text field={fields.VirtualTourSubheading} />
              ) : (
                'Explore our homes with a virtual tour'
              )}
            </p>
            {fields.VirtualTourLink ? (
              <SitecoreLink
                field={fields.VirtualTourLink}
                className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors"
              />
            ) : (
              <button className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors">
                <Play className="w-5 h-5" />
                Play video
              </button>
            )}
          </div>
        </div>

        {/* Map Toggle */}
        <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-[#003057] font-medium py-2 px-4 rounded shadow-lg transition-colors text-sm z-10">
          {fields.MapButtonText ? (
            <Text field={fields.MapButtonText} />
          ) : (
            'Map'
          )}
        </button>
      </div>
    </div>
  );
};
