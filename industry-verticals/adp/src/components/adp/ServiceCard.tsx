'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ServiceCard Component
 * Individual service card used inside IndustryServicesSection
 * "Payroll Services", "HCM - Human Capital Management", "Time & Attendance", etc.
 *
 * Layout:
 * - Bordered square icon at top
 * - Bold title below
 * - Description paragraph
 * - Optional CTA link at bottom
 * - White card with border
 */

interface Fields {
  Icon: ImageField;
  Title: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Icon: { value: { src: '/icons/payroll-services.svg', alt: 'Payroll Services' } },
  Title: { value: 'Payroll Services' },
  Description: {
    value:
      '<p>Whether your workforce is local or global, we offer fast, easy and accurate payroll so you save time and money.</p>',
  },
  CTAText: { value: '' },
  CTALink: { value: { href: '' } },
};

export type ServiceCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ServiceCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Title?.value;
  if (!hasContent) return null;

  return (
    <div className={`component service-card ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 text-center lg:p-8">
        {/* Icon */}
        {fields.Icon?.value?.src && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200">
            <SitecoreImage field={fields.Icon} className="h-8 w-8 object-contain" />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 text-lg font-bold text-[#1A1A2E]">
          <Text field={fields.Title} />
        </h3>

        {/* Description */}
        {fields.Description?.value && (
          <div className="mb-4 grow text-sm leading-relaxed text-[#555]">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Optional CTA */}
        {fields.CTALink?.value?.href && fields.CTAText?.value && (
          <div className="mt-auto">
            <SitecoreLink
              field={fields.CTALink}
              className="text-sm font-semibold text-[#D0271D] transition-colors hover:underline"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>
        )}
      </div>
    </div>
  );
};
