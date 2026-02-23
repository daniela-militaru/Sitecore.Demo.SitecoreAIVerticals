'use client';

import type { JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
  CompanyLogo: ImageField;
  Description: TextField;
  Link: LinkField;
}

const defaultFields: Fields = {
  Image: {
    value: {
      src: 'https://placehold.co/600x400/1a3a5c/ffffff?text=Case+Study',
      alt: 'Case study image',
      width: '600',
      height: '400',
    },
  },
  CompanyLogo: {
    value: {
      src: 'https://placehold.co/120x40/ffffff/333333?text=Logo',
      alt: 'Company logo',
      width: '120',
      height: '40',
    },
  },
  Description: {
    value:
      'Mitsubishi Electric enhances the support experience and improves repair processes with augmented reality.',
  },
  Link: { value: { href: '#case-study' } },
};

export type TestimonialCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component testimonial-card ${styles || ''}`} id={id}>
      <SitecoreLink field={fields.Link} className="group block">
        {/* Image container with logo badge */}
        <div className="relative overflow-hidden rounded-lg">
          <SitecoreImage
            field={fields.Image}
            className="aspect-3/2 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Company logo badge */}
          <div className="absolute top-3 left-3 rounded-md bg-white px-2.5 py-1.5 shadow-sm">
            <SitecoreImage
              field={fields.CompanyLogo}
              className="h-3 w-auto object-contain sm:h-6"
            />
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-snug font-bold text-gray-900 lg:text-base">
          <Text field={fields.Description} />
        </p>
      </SitecoreLink>
    </div>
  );
};
