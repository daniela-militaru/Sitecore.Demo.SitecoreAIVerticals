'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * PlotAvailabilitySection Component
 * Shows available plots for a house type
 * 
 * Features:
 * - Section title
 * - Filter/sort options
 * - Dynamic placeholder for PlotCard components
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle */
  Subtitle: TextField;
}

export type PlotAvailabilitySectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PlotAvailabilitySectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const phPlots = `plots-${DynamicPlaceholderId}`;

  return (
    <div
      className={`component plot-availability-section bg-gray-50 py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-3">
          <span className="text-[#003057]">
            {fields.Title ? <Text field={fields.Title} /> : 'Available Plots'}
          </span>
        </h2>

        {/* Subtitle */}
        {fields.Subtitle && (
          <p className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-8">
            <Text field={fields.Subtitle} />
          </p>
        )}

        {/* Sort Options */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072CE]">
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Plot Number</option>
              <option>Sort by: Availability</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Placeholder name={phPlots} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
