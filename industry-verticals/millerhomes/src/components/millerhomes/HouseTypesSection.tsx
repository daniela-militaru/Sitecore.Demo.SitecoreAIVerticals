'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown, Bed, Home, Calendar, Ruler } from 'lucide-react';

/**
 * HouseTypesSection Component
 * Section displaying available house types with filters
 *
 * Features:
 * - Section title and subtitle
 * - Filter options (bedrooms, type, availability)
 * - Dynamic placeholder for HouseTypeCard components
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section subtitle */
  Subtitle: TextField;
  /** Dictionary key: HouseTypes_ShowAvailability */
  ShowAvailabilityText: TextField;
  /** Dictionary key: HouseTypes_ShowFilters */
  ShowFiltersText: TextField;
  /** Dictionary key: HouseTypes_HideFilters */
  HideFiltersText: TextField;
  /** Dictionary key: HouseTypes_ChooseHomeType */
  ChooseHomeTypeText: TextField;
  /** Dictionary key: HouseTypes_NumBedrooms */
  NumBedroomsText: TextField;
  /** Dictionary key: HouseTypes_MinPrice */
  MinPriceLabel: TextField;
  /** Dictionary key: HouseTypes_MaxPrice */
  MaxPriceLabel: TextField;
  /** Dictionary key: HouseTypes_MinPricePlaceholder */
  MinPricePlaceholder: TextField;
  /** Dictionary key: HouseTypes_MaxPricePlaceholder */
  MaxPricePlaceholder: TextField;
  /** Dictionary key: HouseTypes_MovingSoon */
  MovingSoonText: TextField;
  /** Dictionary key: HouseTypes_ReadyNow */
  ReadyNowText: TextField;
  /** Dictionary key: HouseTypes_PartExchange */
  PartExchangeText: TextField;
  /** Dictionary key: HouseTypes_ViewFullSelection */
  ViewFullSelectionText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Homes at Bramcote Hills Rise' },
  Subtitle: { value: 'Explore our range of beautiful new homes' },
  ShowAvailabilityText: { value: 'Show Availability' },
  ShowFiltersText: { value: 'Show Filters' },
  HideFiltersText: { value: 'Hide Filters' },
  ChooseHomeTypeText: { value: 'Choose a home type' },
  NumBedroomsText: { value: 'No. of bedrooms:' },
  MinPriceLabel: { value: 'Min price:' },
  MaxPriceLabel: { value: 'Max price:' },
  MinPricePlaceholder: { value: 'Minimum price' },
  MaxPricePlaceholder: { value: 'Maximum price' },
  MovingSoonText: { value: 'Moving Soon' },
  ReadyNowText: { value: 'Ready Now' },
  PartExchangeText: { value: 'Part Exchange' },
  ViewFullSelectionText: { value: 'View full selection' },
};

export type HouseTypesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const [showFilters, setShowFilters] = useState(false);

  const phHouseTypes = `houseTypes-${DynamicPlaceholderId}`;

  return (
    <div className={`component house-types-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">
            {fields.Title ? <Text field={fields.Title} /> : 'Homes at Bramcote Hills Rise'}
          </span>
        </h2>

        {/* Subtitle */}
        {fields.Subtitle && (
          <p className="mx-auto mb-8 max-w-2xl text-center text-[#4a4a4a]">
            <Text field={fields.Subtitle} />
          </p>
        )}

        {/* Filter Bar */}
        <div className="mb-8">
          {/* Show Availability Toggle */}
          <div className="mb-4 flex justify-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#4a4a4a]">
              <input type="checkbox" className="h-4 w-4 accent-[#0072CE]" />
              Show Availability
            </label>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-[#0072CE] hover:underline"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="space-y-6 rounded-lg bg-gray-50 p-6">
              {/* Bedrooms */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-[#003057]">Choose a home type:</h4>
                <div className="relative">
                  <select className="w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#0072CE] focus:outline-none md:w-auto">
                    <option>Choose a home type</option>
                    <option>Detached</option>
                    <option>Semi-detached</option>
                    <option>Terraced</option>
                    <option>Apartment</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* No. of bedrooms */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-[#003057]">No. of bedrooms:</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, '5+'].map((num) => (
                    <button
                      key={num}
                      className="flex items-center gap-1 rounded border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-[#0072CE] hover:text-[#0072CE]"
                    >
                      <Bed className="h-4 w-4" />
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#003057]">
                    Min price:
                  </label>
                  <input
                    type="text"
                    placeholder="Minimum price"
                    className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#003057]">
                    Max price:
                  </label>
                  <input
                    type="text"
                    placeholder="Maximum price"
                    className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#0072CE] focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-[#0072CE]" />
                  <Home className="h-4 w-4 text-[#0072CE]" />
                  Moving Soon
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-[#0072CE]" />
                  <Calendar className="h-4 w-4 text-[#0072CE]" />
                  Ready Now
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-[#0072CE]" />
                  <Ruler className="h-4 w-4 text-[#0072CE]" />
                  Part Exchange
                </label>
              </div>

              {/* View All */}
              <div className="pt-2 text-center">
                <button className="text-sm font-medium text-[#0072CE] hover:underline">
                  View full selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* House Types Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Placeholder name={phHouseTypes} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};

