'use client';

import type { JSX } from 'react';
import { TextField, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * HighlightItemCard Component
 * A single benefit/feature line item with a teal checkmark circle icon.
 * Used inside AddOnCard placeholder to list feature highlights.
 *
 * Layout:
 * - Teal circle with white checkmark SVG on the left
 * - Text label on the right
 * - Horizontal flex layout, vertically centered
 */

interface Fields {
  Label: TextField;
}

const defaultFields: Fields = {
  Label: { value: 'Asset discovery and inventory' },
};

export type HighlightItemCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HighlightItemCardProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const fields = props.fields || defaultFields;

  return (
    <div className={`component highlight-item-card ${styles}`} id={id}>
      <div className="flex items-start gap-3 py-1.5">
        {/* Teal checkmark circle */}
        <div
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: '#2747d0',
            marginTop: '1px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Label */}
        <Text tag="span" field={fields.Label} className="text-sm leading-snug text-gray-700" />
      </div>
    </div>
  );
};
