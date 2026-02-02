'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Bed, Bath, Car, Trees, MapPin, Calendar, Heart, Navigation, Video } from 'lucide-react';

/**
 * HouseTypeInfoSection Component
 * Main info section for house type detail pages (Hampton style)
 * 
 * Features:
 * - House name with development subtitle
 * - Address with directions link
 * - Specs row (beds, baths, parking, garden)
 * - Description and key features
 * - Price sidebar with CTAs
 */

interface Fields {
  /** House type name (e.g., "Hampton") */
  Name: TextField;
  /** Development name (e.g., "at Bramcote Hills Rise") */
  DevelopmentName: TextField;
  /** Full address */
  Address: TextField;
  /** Price */
  Price: TextField;
  /** Price prefix (e.g., "Prices range from") */
  PricePrefix: TextField;
  /** Number of bedrooms */
  Bedrooms: TextField;
  /** Number of bathrooms */
  Bathrooms: TextField;
  /** Parking info */
  ParkingSpaces: TextField;
  /** Garden info */
  Garden: TextField;
  /** Description */
  Description: RichTextField;
  /** Key Features (rich text with bullet list) */
  KeyFeatures: RichTextField;
  /** Development link */
  DevelopmentLink: LinkField;
}

export type HouseTypeInfoSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeInfoSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component house-type-info-section bg-white py-8 md:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Main Info */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#0072CE] mb-1">
              {fields.Name ? <Text field={fields.Name} /> : 'Hampton'}
            </h1>
            <h2 className="text-xl md:text-2xl font-light text-[#003057] mb-4">
              {fields.DevelopmentName ? <Text field={fields.DevelopmentName} /> : 'at Bramcote Hills Rise'}
            </h2>

            {/* Address */}
            <div className="flex items-center gap-2 text-sm text-[#4a4a4a] mb-6">
              <MapPin className="w-4 h-4 text-[#0072CE]" />
              <span>{fields.Address ? <Text field={fields.Address} /> : 'Coventry Lane, Bramcote, Nottingham, Nottinghamshire, NG9 3GJ'}</span>
              <button className="text-[#0072CE] hover:underline font-medium ml-2">
                Get Directions
              </button>
            </div>

            {/* Specs Row */}
            <div className="flex flex-wrap gap-6 md:gap-8 py-4 border-y border-gray-200 mb-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#0072CE]" />
                <span className="text-[#003057] font-medium">
                  {fields.Bedrooms ? <Text field={fields.Bedrooms} /> : '3'} Beds
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#0072CE]" />
                <span className="text-[#003057] font-medium">
                  {fields.Bathrooms ? <Text field={fields.Bathrooms} /> : '3'} Baths
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#0072CE]" />
                <span className="text-[#003057] font-medium">
                  {fields.ParkingSpaces ? <Text field={fields.ParkingSpaces} /> : 'Parking Spaces'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trees className="w-5 h-5 text-[#0072CE]" />
                <span className="text-[#003057] font-medium">
                  {fields.Garden ? <Text field={fields.Garden} /> : 'Garden'}
                </span>
              </div>
            </div>

            {/* Description */}
            {fields.Description ? (
              <div className="prose prose-sm max-w-none text-[#4a4a4a] mb-6 leading-relaxed">
                <RichText field={fields.Description} />
              </div>
            ) : (
              <p className="text-[#4a4a4a] mb-6 leading-relaxed">
                The superb Hampton, with its dining area opening to the garden, and the light, elegant lounge that is a flexible favourite in our range. The family bathroom makes life run smoothly complementing an ensuite and the en-suite principal bedroom. Bedroom 2 could make an excellent home office with built in cupboards adding extra storage options.
              </p>
            )}

            {/* Key Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#003057] mb-3">Key Features</h3>
              {fields.KeyFeatures ? (
                <div className="prose prose-sm text-[#4a4a4a]">
                  <RichText field={fields.KeyFeatures} />
                </div>
              ) : (
                <ul className="space-y-2 text-sm text-[#4a4a4a]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE] mt-0.5">•</span>
                    <span>Principal bedroom with French doors to the garden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE] mt-0.5">•</span>
                    <span>Downstairs WC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE] mt-0.5">•</span>
                    <span>Driveway parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE] mt-0.5">•</span>
                    <span>Principal bedroom with dressing room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0072CE] mt-0.5">•</span>
                    <span>Sunny private garden</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Column - Price & CTAs */}
          <div className="lg:w-[300px] shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-4">
              {/* Price Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <p className="text-sm text-[#4a4a4a] mb-1">
                  {fields.PricePrefix ? <Text field={fields.PricePrefix} /> : 'Prices range from'}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-[#003057]">
                  {fields.Price ? <Text field={fields.Price} /> : 'TBA'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="p-4 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-4 rounded transition-colors text-sm">
                  <Calendar className="w-4 h-4" />
                  Register for updates
                </button>

                <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Book an appointment
                </button>

                <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                  <Heart className="w-4 h-4" />
                  Add to favourites
                </button>

                <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>

                <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                  <Video className="w-4 h-4" />
                  View Virtual Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
