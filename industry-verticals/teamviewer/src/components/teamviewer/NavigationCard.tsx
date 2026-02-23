'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  NavLabel: TextField;
  NavLink: LinkField;
}

const defaultFields: Fields = {
  NavLabel: { value: 'Products' },
  NavLink: { value: { href: '#products' } },
};

export type NavigationCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: NavigationCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.NavLabel?.value;
  if (!hasContent) return null;

  return (
    <div className={`component navigation-card ${styles || ''}`} id={id}>
      <SitecoreLink
        field={fields.NavLink}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <Text field={fields.NavLabel} />
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </SitecoreLink>
    </div>
  );
};
