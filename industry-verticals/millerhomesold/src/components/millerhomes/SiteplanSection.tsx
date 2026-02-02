'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  RichTextField,
  ImageField,
  Text,
  RichText,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * SiteplanSection Component
 * Interactive siteplan/map section for development pages
 * 
 * Features:
 * - Section title and description
 * - Interactive map placeholder (actual map would be custom integration)
 * - "Open 3D walkthrough" button
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Siteplan image (fallback) */
  SiteplanImage: ImageField;
  /** 3D walkthrough button text */
  WalkthroughButtonText: TextField;
}

export type SiteplanSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SiteplanSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`component siteplan-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-4">
          <span className="text-[#003057]">
            {fields.Title ? <Text field={fields.Title} /> : 'Bramcote Hills Rise'}{' '}
          </span>
          <span className="text-[#0072CE]">Siteplan</span>
        </h2>

        {/* Description */}
        {fields.Description && (
          <div className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-8">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Siteplan Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-4 border-[#0072CE] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Siteplan Image */}
          {fields.SiteplanImage ? (
            <SitecoreImage
              field={fields.SiteplanImage}
              className="w-full h-full object-contain"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="text-center text-[#4a4a4a]">
              <p className="text-lg">Interactive Siteplan</p>
              <p className="text-sm">Map integration required</p>
            </div>
          )}
        </div>

        {/* 3D Walkthrough Button */}
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 bg-[#003057] hover:bg-[#002040] text-white font-medium py-3 px-6 rounded transition-colors">
            {fields.WalkthroughButtonText ? (
              <Text field={fields.WalkthroughButtonText} />
            ) : (
              'Open 3D walkthrough'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
