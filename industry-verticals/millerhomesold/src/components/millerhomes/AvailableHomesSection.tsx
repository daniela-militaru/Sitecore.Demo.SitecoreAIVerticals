'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * AvailableHomesSection Component
 * Section displaying available plots for a house type (Hampton style)
 * 
 * Features:
 * - Section title "Available Homes"
 * - Dynamic placeholder for PlotCard components
 * - "View full listings" CTA
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** CTA text */
  CTAText: TextField;
}

export type AvailableHomesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AvailableHomesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const phPlots = `availablePlots-${DynamicPlaceholderId}`;

  return (
    <div
      className={`component available-homes-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-8">
          <span className="text-[#003057]">Available</span>
          <span className="text-[#0072CE]"> Homes</span>
        </h2>

        {/* Plots Grid via Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Placeholder name={phPlots} rendering={props.rendering} />
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors text-sm">
            {fields.CTAText ? <Text field={fields.CTAText} /> : 'View full listings'}
          </button>
        </div>
      </div>
    </div>
  );
};
