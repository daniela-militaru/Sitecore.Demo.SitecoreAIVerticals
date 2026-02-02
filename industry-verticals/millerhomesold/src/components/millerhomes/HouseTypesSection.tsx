'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
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
}

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
    <div
      className={`component house-types-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-3">
          <span className="text-[#003057]">
            {fields.Title ? <Text field={fields.Title} /> : 'Homes at Bramcote Hills Rise'}
          </span>
        </h2>

        {/* Subtitle */}
        {fields.Subtitle && (
          <p className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-8">
            <Text field={fields.Subtitle} />
          </p>
        )}

        {/* Filter Bar */}
        <div className="mb-8">
          {/* Show Availability Toggle */}
          <div className="flex justify-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-[#4a4a4a] cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#0072CE]" />
              Show Availability
            </label>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-[#0072CE] hover:underline"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Bedrooms */}
              <div>
                <h4 className="text-sm font-medium text-[#003057] mb-3">Choose a home type:</h4>
                <div className="relative">
                  <select className="w-full md:w-auto appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
                    <option>Choose a home type</option>
                    <option>Detached</option>
                    <option>Semi-detached</option>
                    <option>Terraced</option>
                    <option>Apartment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* No. of bedrooms */}
              <div>
                <h4 className="text-sm font-medium text-[#003057] mb-3">No. of bedrooms:</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, '5+'].map((num) => (
                    <button
                      key={num}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded hover:border-[#0072CE] hover:text-[#0072CE] text-sm transition-colors"
                    >
                      <Bed className="w-4 h-4" />
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#003057] mb-2">Min price:</label>
                  <input
                    type="text"
                    placeholder="Minimum price"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#003057] mb-2">Max price:</label>
                  <input
                    type="text"
                    placeholder="Maximum price"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
                  />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#0072CE]" />
                  <Home className="w-4 h-4 text-[#0072CE]" />
                  Moving Soon
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#0072CE]" />
                  <Calendar className="w-4 h-4 text-[#0072CE]" />
                  Ready Now
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#0072CE]" />
                  <Ruler className="w-4 h-4 text-[#0072CE]" />
                  Part Exchange
                </label>
              </div>

              {/* View All */}
              <div className="text-center pt-2">
                <button className="text-[#0072CE] hover:underline text-sm font-medium">
                  View full selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* House Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Placeholder name={phHouseTypes} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
