'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * BenefitCard Component
 * Individual benefit card used inside BenefitsSection
 * "Global implementation team", "Compliance-ready", "Trusted provider", etc.
 *
 * Layout:
 * - Centered icon/illustration at top
 * - Bold title
 * - Description text with optional bold/linked keywords
 * - White card with subtle border, centered content
 */

interface Fields {
  Icon: ImageField;
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Icon: { value: { src: '/icons/global-team.svg', alt: 'Global implementation team' } },
  Title: { value: 'Global implementation team' },
  Description: {
    value:
      '<p>Thousands of ADP professionals in 140 countries are on hand to advise and support your <strong>global payroll</strong> adoption.</p>',
  },
};

export type BenefitCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: BenefitCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Title?.value;
  if (!hasContent) return null;

  return (
    <div className={`component benefit-card ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center lg:p-8">
        {/* Icon */}
        {fields.Icon?.value?.src && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center">
            <SitecoreImage field={fields.Icon} className="h-12 w-12 object-contain" />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 text-lg font-bold text-[#1A1A2E]">
          <Text field={fields.Title} />
        </h3>

        {/* Description */}
        {fields.Description?.value && (
          <div className="text-sm leading-relaxed text-[#555]">
            <RichText field={fields.Description} />
          </div>
        )}
      </div>
    </div>
  );
};
