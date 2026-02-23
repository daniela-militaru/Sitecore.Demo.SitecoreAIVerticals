'use client';

import type { JSX } from 'react';
import {
  ImageField,
  LinkField,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/teamviewer-logo.svg', alt: 'TeamViewer' } },
  LogoLink: { value: { href: '/' } },
};

export type HeaderLogoCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeaderLogoCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  if (!fields.Logo?.value) return null;

  return (
    <div className={`component header-logo-card ${styles || ''}`} id={id}>
      <SitecoreLink field={fields.LogoLink} className="flex items-center">
        <SitecoreImage field={fields.Logo} className="h-8 w-auto" />
      </SitecoreLink>
    </div>
  );
};
