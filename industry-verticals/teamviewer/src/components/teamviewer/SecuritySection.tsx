'use client';

import React, { type JSX } from 'react';
import { TextField, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
}

type SecuritySectionProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Heading: { value: 'Security made in Germany' },
};

export const Default = (props: SecuritySectionProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const { rendering, params } = props;

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: '80px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#001E50',
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          <Text field={fields.Heading} />
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            justifyItems: 'center',
          }}
        >
          <Placeholder
            name={`security-cards-${params?.DynamicPlaceholderId || '1'}`}
            rendering={rendering}
          />
        </div>
      </div>
    </section>
  );
};
