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
  Icon: { value: { src: '/icon-visibility.svg', alt: 'Real-time visibility' } },
  Heading: { value: 'Real-time visibility' },
  Description: {
    value: '<p>Monitor your IT environment and historical data.</p>',
  },
};

export type BenefitCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: BenefitCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Heading?.value;
  if (!hasContent) return null;

  return (
    <div className={`component benefit-card ${styles || ''}`} id={id}>
      <div
        className="flex h-full flex-col items-center rounded-xl px-6 py-10 text-center lg:px-8 lg:py-12"
        style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}
      >
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center lg:h-20 lg:w-20">
          <SitecoreImage field={fields.Icon} className="h-14 w-14 object-contain lg:h-16 lg:w-16" />
        </div>

        {/* Heading */}
        <h3 className="mb-3 text-lg font-bold text-blue-900 lg:text-xl">
          <Text field={fields.Heading} />
        </h3>

        {/* Description */}
        <div className="text-sm leading-relaxed text-gray-600 lg:text-base">
          <RichText field={fields.Description} />
        </div>
      </div>
    </div>
  );
};
