'use client';

import React, { type JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Title: TextField;
  Links: RichTextField;
}

type FooterLinkGroupCardProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Title: { value: 'Products' },
  Links: {
    value:
      '<ul><li><a href="#">TeamViewer Remote</a></li><li><a href="#">TeamViewer Tensor</a></li><li><a href="#">TeamViewer Frontline</a></li></ul>',
  },
};

export const Default = (props: FooterLinkGroupCardProps): JSX.Element => {
  const fields = props.fields || defaultFields;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '8px',
        }}
      >
        <Text field={fields.Title} />
      </h3>

      <div
        style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '2',
        }}
      >
        <style jsx>{`
          div :global(ul) {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          div :global(li) {
            margin-bottom: 8px;
          }
          div :global(a) {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.2s ease;
          }
          div :global(a:hover) {
            color: #ffffff;
          }
        `}</style>
        <RichText field={fields.Links} />
      </div>
    </div>
  );
};
