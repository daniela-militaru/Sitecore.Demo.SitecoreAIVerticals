'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown, Grid3X3, List, MapPin, Search } from 'lucide-react';

/**
 * FilterSection Component
 * Filter bar for region/search pages with location, price, bedrooms, completion filters
 * Includes view toggles (Grid/List/Map)
 * 
 * Fields:
 * - LocationLabel, PriceLabel, BedroomsLabel, CompletionLabel: Filter labels
 */

interface Fields {
  LocationLabel: TextField;
  PriceLabel: TextField;
  BedroomsLabel: TextField;
  CompletionLabel: TextField;
}

export type FilterSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FilterSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'map'>('grid');

  return (
    <div
      className={`component filter-section bg-white border-b border-gray-200 py-4 md:py-6 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Location Filter */}
          <div>
            <label className="block text-xs font-medium text-[#003057] mb-1">
              {fields.LocationLabel ? <Text field={fields.LocationLabel} /> : 'Location'}
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#0072CE] focus:border-transparent">
                <option>East Midlands</option>
                <option>+ 70 Miles</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-xs font-medium text-[#003057] mb-1">
              {fields.PriceLabel ? <Text field={fields.PriceLabel} /> : 'Price'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-6 text-sm text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
                  <option>Any</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <span className="flex items-center text-sm text-gray-400">to</span>
              <div className="relative flex-1">
                <select className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-6 text-sm text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
                  <option>Any</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-xs font-medium text-[#003057] mb-1">
              {fields.BedroomsLabel ? <Text field={fields.BedroomsLabel} /> : 'Bedrooms'}
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
                <option>5+</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Completion Date Filter */}
          <div>
            <label className="block text-xs font-medium text-[#003057] mb-1">
              {fields.CompletionLabel ? <Text field={fields.CompletionLabel} /> : 'Completion Date'}
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
                <option>Any</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View Toggles & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* View Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeView === 'grid'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeView === 'list'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeView === 'map'
                  ? 'bg-[#003057] text-white'
                  : 'text-[#003057] hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Map View
            </button>
          </div>

          {/* Showhome Search */}
          <button className="flex items-center gap-2 text-sm text-[#003057] hover:text-[#0072CE] transition-colors">
            <Search className="w-4 h-4" />
            Search for a showhome
          </button>
        </div>
      </div>
    </div>
  );
};
