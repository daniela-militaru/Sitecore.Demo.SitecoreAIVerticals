'use client';

import type { JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialCard Component
 * A single client testimonial with quote and author, designed to be placed
 * inside the TestimonialCarouselSection placeholder.
 *
 * Features:
 * - Large quote text (styled for white-on-dark)
 * - Author name + title below
 * - Full-width flex-shrink-0 so it acts as a carousel slide
 *
 * Must be wrapped with the class "testimonial-card" for the parent
 * MutationObserver slide count to detect it.
 */

interface Fields {
  /** The client quote (rich text for bold/italic formatting) */
  Quote: RichTextField;
  /** Author name and title, e.g. "Traci Memmott, Global Head of Payroll, PayPal" */
  Author: TextField;
}

const defaultFields: Fields = {
  Quote: {
    value:
      '<p>&ldquo;99.9% of our employees are now paid on ADP, and our payroll problems are at an all-time low &hellip; Our recent employee survey saw significant improvement.&rdquo;</p>',
  },
  Author: { value: 'Traci Memmott Global Head of Payroll, PayPal' },
};

export type TestimonialCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Quote?.value || fields.Author?.value;
  if (!hasContent) return null;

  return (
    <div className={`component testimonial-card w-full shrink-0 px-4 ${styles || ''}`} id={id}>
      {/* Quote */}
      {fields.Quote?.value && (
        <div className="mb-6 text-lg leading-relaxed text-white lg:text-2xl lg:leading-relaxed">
          <RichText field={fields.Quote} />
        </div>
      )}

      {/* Author */}
      {fields.Author?.value && (
        <p className="text-sm text-white/70">
          <Text field={fields.Author} />
        </p>
      )}
    </div>
  );
};
