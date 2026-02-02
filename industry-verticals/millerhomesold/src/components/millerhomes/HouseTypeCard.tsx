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
import { Bed, Ruler, Home, Car, Heart, ChevronRight } from 'lucide-react';

/**
 * HouseTypeCard Component
 * Card for displaying a house type in the development page grid
 * 
 * Features:
 * - Hero image
 * - House name and status (Coming Soon, Available, etc.)
 * - Description
 * - Specifications (beds, sqft, type, parking)
 * - Price
 * - CTA button
 */

interface Fields {
  /** House image */
  Image: ImageField;
  /** House name */
  Name: TextField;
  /** Status (Coming Soon, Available Now, etc.) */
  Status: TextField;
  /** Description */
  Description: TextField;
  /** Number of bedrooms */
  Bedrooms: TextField;
  /** House type (Detached, Semi, etc.) */
  HouseType: TextField;
  /** Garden type */
  Garden: TextField;
  /** Parking spaces */
  Parking: TextField;
  /** Price text */
  Price: TextField;
  /** CTA link */
  CTALink: LinkField;
}

export type HouseTypeCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  const isComingSoon = (fields.Status?.value as string).toLowerCase().includes('coming soon');

  return (
    <div
      className={`component house-type-card bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ${styles || ''}`}
      id={id}
    >
      {/* Image */}
      <div className="relative">
        {fields.Image && (
          <div className="aspect-4/3 overflow-hidden">
            <SitecoreImage
              field={fields.Image}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Save Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
          <Heart className="w-4 h-4 text-[#003057]" />
        </button>

        {/* Arrow */}
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
          <ChevronRight className="w-5 h-5 text-[#003057]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        {fields.Name && (
          <h3 className="text-lg font-bold text-[#0072CE] mb-1">
            <Text field={fields.Name} />
          </h3>
        )}

        {/* Status */}
        {fields.Status && (
          <p className={`text-sm font-medium mb-2 ${isComingSoon ? 'text-[#D4A84B]' : 'text-green-600'}`}>
            <Text field={fields.Status} />
          </p>
        )}

        {/* Description */}
        {fields.Description && (
          <p className="text-sm text-[#4a4a4a] mb-3 line-clamp-2">
            <Text field={fields.Description} />
          </p>
        )}

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#4a4a4a] mb-4">
          {fields.Bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-[#0072CE]" />
              <Text field={fields.Bedrooms} /> Bedrooms
            </div>
          )}
          {fields.HouseType && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4 text-[#0072CE]" />
              <Text field={fields.HouseType} />
            </div>
          )}
          {fields.Garden && (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4 text-[#0072CE]" />
              <Text field={fields.Garden} />
            </div>
          )}
          {fields.Parking && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-[#0072CE]" />
              <Text field={fields.Parking} /> Parking
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-xs text-[#4a4a4a]">Prices from</span>
          <p className="text-xl font-bold text-[#003057]">
            {fields.Price ? <Text field={fields.Price} /> : '£TBA'}
          </p>
        </div>

        {/* CTA */}
        {fields.CTALink ? (
          <SitecoreLink
            field={fields.CTALink}
            className="block w-full bg-[#003057] hover:bg-[#002040] text-white text-center font-medium py-2.5 px-4 rounded transition-colors text-sm"
          />
        ) : (
          <button className="w-full bg-[#003057] hover:bg-[#002040] text-white font-medium py-2.5 px-4 rounded transition-colors text-sm">
            Find out more
          </button>
        )}
      </div>
    </div>
  );
};
