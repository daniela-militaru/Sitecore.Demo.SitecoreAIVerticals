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
import { Download } from 'lucide-react';

/**
 * SpecificationSection Component
 * Specification details section with image
 * 
 * Features:
 * - Title and rich text description
 * - Downloadable specification PDF
 * - Feature image
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Download link */
  DownloadLink: LinkField;
  /** Feature image */
  Image: ImageField;
}

export type SpecificationSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SpecificationSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component specification-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Content */}
          <div className="flex-1">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#003057] mb-4">
              {fields.Title ? <Text field={fields.Title} /> : 'Specification'}
            </h2>

            {/* Description */}
            {fields.Description && (
              <div className="prose prose-sm max-w-none text-[#4a4a4a] mb-6 [&_a]:text-[#0072CE]">
                <RichText field={fields.Description} />
              </div>
            )}

            {/* Download Button */}
            {fields.DownloadLink ? (
              <SitecoreLink
                field={fields.DownloadLink}
                className="inline-flex items-center gap-2 text-[#003057] hover:text-[#0072CE] font-medium transition-colors"
              />
            ) : (
              <button className="inline-flex items-center gap-2 text-[#003057] hover:text-[#0072CE] font-medium transition-colors">
                <Download className="w-5 h-5" />
                Download Specification
              </button>
            )}
          </div>

          {/* Image */}
          {fields.Image && (
            <div className="lg:w-1/2 flex-shrink-0">
              <div className="rounded-lg overflow-hidden">
                <SitecoreImage
                  field={fields.Image}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
