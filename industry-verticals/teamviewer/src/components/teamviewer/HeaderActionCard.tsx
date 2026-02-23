'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Label: TextField;
  Link: LinkField;
  Type: TextField; // "text", "button", "primary-button"
}

const defaultFields: Fields = {
  Label: { value: 'Sign In' },
  Link: { value: { href: '#signin' } },
  Type: { value: 'text' },
};

export type HeaderActionCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeaderActionCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Label?.value;
  if (!hasContent) return null;

  const type = fields.Type?.value || 'text';

  const baseClasses = 'inline-flex items-center justify-center text-sm font-semibold';
  const typeClasses = {
    text: 'px-3 py-2 text-gray-700 hover:text-gray-900',
    button: 'rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50',
    'primary-button': 'rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700',
  };

  return (
    <div className={`component header-action-card ${styles || ''}`} id={id}>
      <SitecoreLink
        field={fields.Link}
        className={`${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.text}`}
      >
        <Text field={fields.Label} />
      </SitecoreLink>
    </div>
  );
};
