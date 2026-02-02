'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  useSitecoreContext,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PageTitleSection Component
 * Displays a page title with optional subtitle/description
 * Used on region pages like "New homes in East Midlands"
 * 
 * Fields:
 * - Title: Main page heading (e.g., "New homes in East Midlands")
 * - Subtitle: Subheading text
 * - Description: Rich text description
 */

interface Fields {
  /** Main page title */
  Title: TextField;
  /** Subtitle text */
  Subtitle: TextField;
  /** Rich text description with links */
  Description: RichTextField;
}

export type PageTitleSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PageTitleSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component page-title-section bg-white py-8 md:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        {fields.Title && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#0072CE] mb-4">
            <Text field={fields.Title} />
          </h1>
        )}

        {/* Subtitle */}
        {fields.Subtitle && (
          <h2 className="text-lg md:text-xl font-semibold text-[#003057] mb-4">
            <Text field={fields.Subtitle} />
          </h2>
        )}

        {/* Description */}
        {fields.Description && (
          <div className="prose prose-sm md:prose-base max-w-none text-[#4a4a4a] [&_a]:text-[#0072CE] [&_a]:underline">
            <RichText field={fields.Description} />
          </div>
        )}
      </div>
    </div>
  );
};
