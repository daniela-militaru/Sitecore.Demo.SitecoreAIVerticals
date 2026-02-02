'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { School, ShoppingBag, Utensils, TreePine, Train, Heart, Church, Coffee } from 'lucide-react';

/**
 * LocalAmenitiesSection Component
 * Map section showing local amenities around a development
 * 
 * Features:
 * - Section title
 * - Interactive map placeholder
 * - Amenity category filters
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle/description */
  Subtitle: TextField;
}

const amenityCategories = [
  { icon: School, label: 'Schools & Nurseries', key: 'schools' },
  { icon: ShoppingBag, label: 'Shopping', key: 'shopping' },
  { icon: Utensils, label: 'Bar & Restaurant', key: 'food' },
  { icon: TreePine, label: 'Leisure & Arts', key: 'leisure' },
  { icon: Train, label: 'Transport', key: 'transport' },
  { icon: Heart, label: 'Doctors', key: 'doctors' },
  { icon: Church, label: 'Church', key: 'church' },
  { icon: Coffee, label: 'Other Services', key: 'other' },
];

export type LocalAmenitiesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: LocalAmenitiesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component local-amenities-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-4">
          <span className="text-[#003057]">Local </span>
          <span className="text-[#0072CE]">Amenities</span>
        </h2>

        {/* Subtitle */}
        {fields.Subtitle && (
          <p className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-6">
            <Text field={fields.Subtitle} />
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Toggle */}
          <div className="lg:w-48 shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button className="shrink-0 px-4 py-2 bg-[#003057] text-white rounded text-sm font-medium">
                Map
              </button>
              <button className="shrink-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#003057] rounded text-sm font-medium transition-colors">
                Satellite
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
              <div className="text-center text-[#4a4a4a]">
                <p className="text-lg">Interactive Map</p>
                <p className="text-sm">Map integration required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenity Categories */}
        <div className="mt-6">
          <p className="text-sm text-[#4a4a4a] mb-4">
            Explore the local area around {fields.Title ? <Text field={fields.Title} /> : 'Bramcote Hills Rise'}:
          </p>
          <div className="flex flex-wrap gap-3">
            {amenityCategories.map((category) => (
              <button
                key={category.key}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded hover:border-[#0072CE] hover:text-[#0072CE] text-sm transition-colors"
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
