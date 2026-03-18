'use client';

import React, { type JSX } from 'react';
import { ImageField, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TrustedLogoCard Component
 * A single client logo, droppable inside the TrustedLogosSection placeholder.
 *
 * Renders with a `.trusted-logo-card` CSS class so the parent section can
 * discover it via MutationObserver and drive the mobile carousel.
 */

interface Fields {
  Logo: ImageField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/logos/fujifilm.svg', alt: 'Fujifilm' } },
};

export type TrustedLogoCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TrustedLogoCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`trusted-logo-card flex w-full shrink-0 items-center justify-center py-4 ${styles || ''}`}
      id={id}
    >
      <SitecoreImage field={fields.Logo} className="h-8 max-w-35 object-contain lg:h-15" />
    </div>
  );
};
