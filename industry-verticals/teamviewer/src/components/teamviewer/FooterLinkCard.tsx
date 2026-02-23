'use client';

import type { JSX } from 'react';
import { LinkField, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  FooterLink: LinkField;
}

const defaultFields: Fields = {
  FooterLink: { value: { href: '#', text: 'Link' } },
};

export type FooterLinkCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FooterLinkCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  if (!fields.FooterLink?.value) return null;

  return (
    <div className={`component footer-link-card ${styles || ''}`} id={id}>
      <SitecoreLink
        field={fields.FooterLink}
        className="block text-sm text-gray-300 hover:text-white hover:underline"
      />
    </div>
  );
};
