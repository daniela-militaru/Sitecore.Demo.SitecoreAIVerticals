'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  RichText,
  RichTextField,
  ImageField,
  LinkField,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Heading: TextField;
  Description: RichTextField;
  LinkText: TextField;
  Link: LinkField;
  Image: ImageField;
}

export type FeatureCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FeatureCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const fields = props.fields;

  return (
    <div className={`component feature-card w-full`} id={id}>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Content */}
        <div className="flex-1 p-6">
          <Text tag="h3" field={fields.Heading} className="mb-2 text-xl font-bold text-gray-900" />
          <RichText
            className="feature-description mb-4 text-sm text-gray-600"
            field={fields.Description}
          />
          <SitecoreLink
            field={fields.Link}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            <Text field={fields.LinkText} />
          </SitecoreLink>
        </div>

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
};
