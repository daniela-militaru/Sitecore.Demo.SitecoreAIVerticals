'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Text, Link } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  CTAText: TextField;
  CTALink: LinkField;
}

type ComparisonSectionProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Heading: { value: 'Compare license features' },
  CTAText: { value: '+' },
  CTALink: { value: { href: '#', text: 'Expand' } },
};

export const Default = (props: ComparisonSectionProps): JSX.Element => {
  const fields = props.fields || defaultFields;

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: '40px 20px',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#001E50',
          }}
        >
          <Text field={fields.Heading} />
        </h2>

        <Link
          field={fields.CTALink}
          style={{
            backgroundColor: 'transparent',
            color: '#001E50',
            fontSize: '32px',
            fontWeight: '300',
            width: '48px',
            height: '48px',
            border: '2px solid #001E50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Text field={fields.CTAText} />
        </Link>
      </div>
    </section>
  );
};
