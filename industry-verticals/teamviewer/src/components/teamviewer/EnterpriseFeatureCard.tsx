/**
 * To delete
 */

'use client';

import type { JSX } from 'react';
import { TextField, Text, RichText, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Secure, scalable, and flexible' },
  Description: {
    value: '<p>TeamViewer solutions are built for the complex needs of global enterprises.</p>',
  },
};

export type EnterpriseFeatureCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: EnterpriseFeatureCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Heading?.value;
  if (!hasContent) return null;

  return (
    <div className={`component enterprise-feature-card w-full ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
        <h3 className="mb-3 text-xl font-bold text-gray-900 lg:text-2xl">
          <Text field={fields.Heading} />
        </h3>
        <div className="enterprise-description text-base text-gray-600">
          <RichText field={fields.Description} />
        </div>
      </div>
    </div>
  );
};
