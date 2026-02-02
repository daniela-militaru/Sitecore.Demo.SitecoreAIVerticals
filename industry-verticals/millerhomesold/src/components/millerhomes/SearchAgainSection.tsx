'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Search, MapPin } from 'lucide-react';

/**
 * SearchAgainSection Component
 * "Not found what you were looking for? Search again" section
 * 
 * Features:
 * - Headline text
 * - Search input with location icon
 * - Search button
 * - Advanced search link
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Search placeholder text */
  Placeholder: TextField;
  /** Search button text */
  SearchButtonText: TextField;
  /** Advanced search link text */
  AdvancedSearchText: TextField;
}

export type SearchAgainSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SearchAgainSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component search-again-section bg-[#003057] py-12 md:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white text-center mb-8">
          {fields.Title ? (
            <Text field={fields.Title} />
          ) : (
            'Not found what you were looking for? Search again'
          )}
        </h2>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={fields.Placeholder?.value as string || 'Search using a postcode'}
                className="w-full pl-12 pr-4 py-3 rounded bg-[#1a4a70] border border-[#2a5a80] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
              />
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors">
              <Search className="w-5 h-5" />
              {fields.SearchButtonText ? (
                <Text field={fields.SearchButtonText} />
              ) : (
                'Search'
              )}
            </button>

            {/* Advanced Search */}
            <button className="flex items-center justify-center gap-2 bg-[#1a4a70] hover:bg-[#2a5a80] text-white font-medium py-3 px-6 rounded transition-colors border border-[#2a5a80]">
              {fields.AdvancedSearchText ? (
                <Text field={fields.AdvancedSearchText} />
              ) : (
                'Advanced Search'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
