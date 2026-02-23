'use client';

import type { JSX } from 'react';
import { TextField, Text, ImageField, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Logo: ImageField;
  Name: TextField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/partner-logo.svg', alt: 'Partner' } },
  Name: { value: 'Partner Name' },
};

export type LogoCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: LogoCardProps): JSX.Element | null => {
  const fields = props.fields || defaultFields;

  return <SitecoreImage field={fields.Logo} className="object-contain" />;
};

export const Boxed = (props: LogoCardProps): JSX.Element | null => {
  const fields = props.fields || defaultFields;

  return (
    <div>
      <SitecoreImage field={fields.Logo} className="h-20 w-auto shrink-0 object-contain" />
    </div>
  );
};

export const WithName = (props: LogoCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component logo-with-name-card flex items-center gap-2.5`} id={id}>
      <SitecoreImage field={fields.Logo} className="h-6 w-6 shrink-0 object-contain" />
      <Text
        tag="span"
        field={fields.Name}
        className="text-[8px] font-medium whitespace-nowrap text-gray-700 sm:text-sm"
      />
    </div>
  );
};
