'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * IndustryServicesSection Component
 * "Payroll Services and HR solutions that meet your industry needs"
 * Grid of ServiceCard components
 *
 * Layout:
 * - Title + subtitle/description paragraph
 * - Desktop: 3x2 grid of ServiceCards (via placeholder)
 * - Mobile: Single column stacked
 * - White/light background
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'Payroll Services and HR solutions that meet your industry needs' },
  Description: {
    value:
      '<p>Whether you need an HR services, payroll software or managed payroll services, ADP have been helping businesses like yours to automate all or part of their payroll processes for over 75 years. Our payroll outsourcing services combine both your payroll and human information systems (HRIS), with thousands of experts available to answer any questions.</p><p>Our human capital management (HCM) software unites HR, payroll, time, talent, tax and benefits in one elegant Human Resource Management (HRMS) solution to maximise the potential of your employees.</p>',
  },
};

export type IndustryServicesSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IndustryServicesSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phServiceCards = `service-cards-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component industry-services-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {fields.Description?.value && (
          <div className="mx-auto mb-10 max-w-4xl text-center text-sm leading-relaxed text-[#555] lg:mb-12 lg:text-base">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Grid of ServiceCards */}
        <div className="services-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={phServiceCards} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
