'use client';

import type { JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TitleAndDescriptionCard Component
 * Renders a centered heading + rich-text description block.
 *
 * Designed to be dropped inside a placeholder in a parent section
 * (e.g. IntroWithTabsSection) so content authors can manage the
 * heading and intro copy independently.
 *
 * Layout:
 * - Centered title (bold, dark) + centered description (muted body text)
 * - Bottom margin to separate from the next element in the parent section
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: {
    value: 'Simplify the complexity of HR to unlock the potential of your business and people.',
  },
  Description: {
    value:
      '<p>Manage payroll, HR administration, time, talent and people data via a single, intuitive employee system of record. We help put your employees in a position to realise their full potential with our human capital management software.</p>',
  },
};

export type TitleAndDescriptionCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TitleAndDescriptionCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const fields = props.fields || defaultFields;

  return (
    <div className="title-and-description-card mb-10" id={id}>
      {/* Heading */}
      <h2 className="mb-4 text-center text-2xl leading-snug font-bold text-[#1A1A2E] lg:text-3xl">
        <Text field={fields.Title} />
      </h2>

      {/* Description */}
      <div className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-[#555] lg:text-base">
        <RichText field={fields.Description} />
      </div>
    </div>
  );
};
