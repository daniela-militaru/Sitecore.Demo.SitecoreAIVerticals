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
import { MapPin, Heart, ChevronRight } from 'lucide-react';

/**
 * DevelopmentCard Component
 * Card for displaying a development in search results/grid
 * 
 * Features:
 * - Hero image with carousel indicators
 * - Match count badge (e.g., "31 Homes Matching Your Requirements")
 * - Development name and description
 * - Location, price range
 * - Region badge
 * - CTA button
 * - Save/favorite functionality
 * - Optional promotional banner
 */

interface Fields {
  /** Main development image */
  Image: ImageField;
  /** Number of matching homes text */
  MatchCount: TextField;
  /** Development name */
  Name: TextField;
  /** Development description */
  Description: RichTextField;
  /** Location/address */
  Location: TextField;
  /** Price range text */
  PriceRange: TextField;
  /** Region text (e.g., "Within region") */
  Region: TextField;
  /** Promotional banner text (optional) */
  PromoBanner: TextField;
  /** Event/release info (optional) */
  EventInfo: TextField;
  /** CTA link */
  CTALink: LinkField;
}

export type DevelopmentCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  const hasPromoBanner = fields.PromoBanner?.value;
  const hasEventInfo = fields.EventInfo?.value;

  return (
    <div
      className={`component development-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${styles || ''}`}
      id={id}
    >
      {/* Image Container */}
      <div className="relative">
        {/* Promo Banner */}
        {hasPromoBanner && (
          <div className="absolute top-0 left-0 right-0 bg-[#D4A84B] text-white text-xs font-medium py-1.5 px-3 z-10">
            <Text field={fields.PromoBanner} />
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {fields.Image && (
            <SitecoreImage
              field={fields.Image}
              className="w-full h-full object-cover"
            />
          )}

          {/* Image Navigation Arrow */}
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
            <ChevronRight className="w-5 h-5 text-[#003057]" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/50" />
            <span className="w-2 h-2 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Save Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-10">
          <Heart className="w-4 h-4 text-[#003057]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Match Count */}
        {fields.MatchCount && (
          <p className="text-xs font-medium text-[#0072CE] mb-2 flex items-center gap-1">
            <Text field={fields.MatchCount} />
            <Heart className="w-3 h-3" />
          </p>
        )}

        {/* Name */}
        {fields.Name && (
          <h3 className="text-lg font-bold text-[#003057] mb-2">
            <Text field={fields.Name} />
          </h3>
        )}

        {/* Description */}
        {fields.Description && (
          <div className="text-sm text-[#4a4a4a] mb-3 line-clamp-3">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Location */}
        {fields.Location && (
          <div className="flex items-start gap-2 text-sm text-[#4a4a4a] mb-2">
            <MapPin className="w-4 h-4 text-[#0072CE] flex-shrink-0 mt-0.5" />
            <Text field={fields.Location} />
          </div>
        )}

        {/* Price Range */}
        {fields.PriceRange && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-[#0072CE]">£</span>
            <span className="text-[#003057] font-medium">
              <Text field={fields.PriceRange} />
            </span>
          </div>
        )}

        {/* Region */}
        {fields.Region && (
          <div className="flex items-center gap-2 text-sm text-[#4a4a4a] mb-3">
            <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">⊙</span>
            <Text field={fields.Region} />
          </div>
        )}

        {/* Event Info */}
        {hasEventInfo && (
          <div className="bg-gray-50 rounded p-3 mb-3 text-sm text-[#4a4a4a]">
            <Text field={fields.EventInfo} />
          </div>
        )}

        {/* CTA Button */}
        {fields.CTALink && (
          <SitecoreLink
            field={fields.CTALink}
            className="block w-full bg-[#003057] hover:bg-[#002040] text-white text-center font-medium py-2.5 px-4 rounded transition-colors text-sm"
          />
        )}
      </div>
    </div>
  );
};
