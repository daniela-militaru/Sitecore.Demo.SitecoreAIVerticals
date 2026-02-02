'use client';

import React, { type JSX, useState } from 'react';
import {
  TextField,
  Text,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Search, MapPin, Home } from 'lucide-react';

/**
 * SearchSection Component
 * Dark blue search bar section with location input and quick links
 * 
 * Features:
 * - "Find your new home today" title
 * - Search input with autocomplete placeholder
 * - Search and "Personalise your search" buttons
 * - Quick links: Select by location, Showhomes near me
 */

interface Fields {
  Title: TextField;
  SearchPlaceholder: TextField;
  SearchButtonText: TextField;
  PersonaliseButtonText: TextField;
  PersonaliseButtonLink: LinkField;
  SelectByLocationText: TextField;
  SelectByLocationLink: LinkField;
  ShowhomesText: TextField;
  ShowhomesLink: LinkField;
}

export type SearchSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SearchSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section
      className={`component search-section bg-[#003057] py-6 lg:py-8 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-white text-lg lg:text-xl font-medium mb-4">
          {fields.Title ? (
            <Text field={fields.Title} />
          ) : (
            'Find your new home today'
          )}
        </h2>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={fields.SearchPlaceholder.value as string || 'Search using a postcode, town, development name or region'}
              className="w-full px-4 py-3 pl-10 rounded bg-white text-[#003057] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="button"
            className="bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {fields.SearchButtonText ? (
              <Text field={fields.SearchButtonText} />
            ) : (
              'Search'
            )}
          </button>
          {fields.PersonaliseButtonLink && (
            <SitecoreLink
              field={fields.PersonaliseButtonLink}
              className="bg-[#1a4a70] hover:bg-[#0d3a5c] text-white font-medium py-3 px-6 rounded transition-colors text-center"
            >
              {fields.PersonaliseButtonText ? (
                <Text field={fields.PersonaliseButtonText} />
              ) : (
                'Personalise your search'
              )}
            </SitecoreLink>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <SitecoreLink
            field={fields.SelectByLocationLink || { value: { href: '#' } }}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {fields.SelectByLocationText ? (
              <Text field={fields.SelectByLocationText} />
            ) : (
              'Select by location'
            )}
          </SitecoreLink>
          <SitecoreLink
            field={fields.ShowhomesLink || { value: { href: '#' } }}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            {fields.ShowhomesText ? (
              <Text field={fields.ShowhomesText} />
            ) : (
              'Showhomes near me'
            )}
          </SitecoreLink>
        </div>
      </div>
    </section>
  );
};
