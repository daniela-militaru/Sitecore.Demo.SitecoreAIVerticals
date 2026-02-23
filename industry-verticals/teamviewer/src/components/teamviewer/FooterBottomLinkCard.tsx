'use client';

import React, { type JSX } from 'react';
import { LinkField, Link } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Link: LinkField;
}

type FooterBottomLinkCardProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Link: { value: { href: '#', text: 'Product Descriptions' } },
};

export const Default = (props: FooterBottomLinkCardProps): JSX.Element => {
  const fields = props.fields || defaultFields;

  return (
    <Link
      field={fields.Link}
      style={{
        color: 'rgba(255, 255, 255, 0.7)',
        textDecoration: 'none',
        fontSize: '13px',
        transition: 'color 0.2s ease',
        cursor: 'pointer',
      }}
    />
  );
};
