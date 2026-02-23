'use client';

import { type JSX } from 'react';
import { TextField, Placeholder, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
}

type FAQSectionProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Heading: { value: 'Pricing FAQ' },
};

export const Default = (props: FAQSectionProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const fields = props.fields || defaultFields;
  const { rendering, params } = props;

  const phFAQCards = `faq-cards-${params?.DynamicPlaceholderId || '1'}`;

  return (
    <section className={`component faq-section bg-white py-12 lg:py-20 ${styles}`} id={id}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          className="mb-10 text-center text-2xl font-bold lg:mb-12 lg:text-3xl"
          style={{ color: '#0d1b3e' }}
        >
          <Text field={fields.Heading} />
        </h2>

        <div>
          <Placeholder name={phFAQCards} rendering={rendering} />
        </div>
      </div>
    </section>
  );
};
