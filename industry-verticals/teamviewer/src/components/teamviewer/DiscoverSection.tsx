'use client';

import React, { type JSX, useState } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  Tab1Label: TextField;
  Tab2Label: TextField;
  Tab3Label: TextField;
}

const defaultFields: Fields = {
  Heading: { value: 'Discover what sets TeamViewer apart' },
  Tab1Label: { value: 'Industry-leading security' },
  Tab2Label: { value: 'Powerful add-ons' },
  Tab3Label: { value: 'Non-profits and education' },
};

export type DiscoverSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DiscoverSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const [activeTab, setActiveTab] = useState(0);

  const phSecurityCards = `discover-security-${DynamicPlaceholderId}`;

  const tabs = [
    { label: fields.Tab1Label, placeholder: phSecurityCards },
    { label: fields.Tab2Label, placeholder: phSecurityCards },
    { label: fields.Tab3Label, placeholder: phSecurityCards },
  ];

  return (
    <section
      className={`component discover-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 lg:mb-12 lg:text-3xl">
          <Text field={fields.Heading} />
        </h2>

        {/* Tabs */}
        <div className="mb-10 flex justify-center border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`pb-4 text-sm font-semibold transition-colors lg:text-base ${
                  activeTab === index
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Text field={tab.label} />
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={tabs[activeTab].placeholder} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
