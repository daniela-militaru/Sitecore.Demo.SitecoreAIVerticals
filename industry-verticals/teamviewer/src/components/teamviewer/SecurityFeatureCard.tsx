'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  RichText,
  RichTextField,
  ImageField,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Icon: ImageField;
  Heading: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Icon: { value: { src: '/icon-security.svg', alt: 'Industry-leading security' } },
  Heading: { value: 'Industry-leading security' },
  Description: {
    value: '<p>Our software and IT infrastructure offer the highest standards.</p>',
  },
};

export type SecurityFeatureCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SecurityFeatureCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Heading?.value;
  if (!hasContent) return null;

  return (
    <div className={`component security-feature-card w-full ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col items-center rounded-lg bg-white p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center">
          <SitecoreImage field={fields.Icon} className="h-20 w-20 object-contain" />
        </div>

        {/* Heading */}
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          <Text field={fields.Heading} />
        </h3>

        {/* Description */}
        <div className="security-description text-sm leading-relaxed text-gray-600">
          <RichText field={fields.Description} />
        </div>
      </div>
    </div>
  );
};
