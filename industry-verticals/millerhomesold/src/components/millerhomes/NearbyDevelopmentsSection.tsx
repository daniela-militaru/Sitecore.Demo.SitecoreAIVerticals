'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  Placeholder,
  useSitecoreContext,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, RefreshCw } from 'lucide-react';

/**
 * NearbyDevelopmentsSection Component
 * "Other Developments Nearby" section with map and location controls
 * 
 * Features:
 * - Section title with styled "Developments" in blue
 * - Subtitle text
 * - Map placeholder area
 * - Location indicator and change location link
 * - Loading spinner animation
 */

interface Fields {
  TitlePart1: TextField;
  TitleHighlight: TextField;
  Subtitle: TextField;
  LocationText: TextField;
  ChangeLocationText: TextField;
}

export type NearbyDevelopmentsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: NearbyDevelopmentsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const phMapContent = `mapContent-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component nearby-developments-section py-12 lg:py-16 bg-white ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-light text-[#003057] mb-4">
          {fields.TitlePart1 ? (
            <>
              <Text field={fields.TitlePart1} />{' '}
              <span className="text-[#0072CE]">
                <Text field={fields.TitleHighlight} />
              </span>
            </>
          ) : (
            <>
              Other <span className="text-[#0072CE]">Developments</span> Nearby
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-sm md:text-base mb-8">
          {fields.Subtitle ? (
            <Text field={fields.Subtitle} />
          ) : (
            'You may also be interested in these nearby developments.'
          )}
        </p>

        {/* Map Area */}
        <div className="relative bg-gray-100 rounded-lg min-h-[300px] md:min-h-[400px] flex items-center justify-center mb-6">
          {/* Loading Spinner */}
          <div className="flex flex-col items-center gap-3 text-[#0072CE]">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="text-sm text-gray-500">Loading map...</span>
          </div>

          {/* Map Placeholder */}
          <Placeholder name={phMapContent} rendering={props.rendering} />
        </div>

        {/* Location Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Showing developments near</span>
            <span className="font-medium text-[#003057] underline">
              {fields.LocationText ? (
                <Text field={fields.LocationText} />
              ) : (
                'You'
              )}
            </span>
          </div>
          <button className="flex items-center gap-2 text-[#0072CE] hover:text-[#005ba3] transition-colors">
            <MapPin className="w-4 h-4" />
            {fields.ChangeLocationText ? (
              <Text field={fields.ChangeLocationText} />
            ) : (
              'Change location'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
