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
import { ArrowRight } from 'lucide-react';

/**
 * BusinessSizeCard Component
 * Individual business size card used inside BusinessSizeSection
 * e.g., "Small Business (1-199 Employees)", "Midsized Business", "Large Business", "Global Business"
 *
 * Layout:
 * - Illustration/image at top
 * - Employee count label (e.g., "1-199 EMPLOYEES")
 * - Business size title (e.g., "Small Business")
 * - Description paragraph
 * - List of service links with arrow icons
 * - White card with border
 */

interface Fields {
  Image: ImageField;
  EmployeeCountLabel: TextField;
  Title: TextField;
  Description: RichTextField;
  Link1: LinkField;
  Link2: LinkField;
  Link3: LinkField;
  Link4: LinkField;
  Link5: LinkField;
}

const defaultFields: Fields = {
  Image: { value: { src: '/illustrations/small-business.svg', alt: 'Small Business' } },
  EmployeeCountLabel: { value: '1-199 EMPLOYEES' },
  Title: { value: 'Small Business' },
  Description: {
    value:
      '<p>Faster, easier, more reliable solutions designed to help you focus on what matters.</p>',
  },
  Link1: { value: { href: '/payroll-services', text: 'Payroll Services' } },
  Link2: { value: { href: '/hr-services', text: 'HR Services' } },
  Link3: { value: { href: '/hcm-solutions', text: 'HCM Solutions' } },
  Link4: { value: { href: '/time-attendance', text: 'Time and Attendance' } },
  Link5: { value: { href: '/talent', text: 'Talent' } },
};

export type BusinessSizeCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: BusinessSizeCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Title?.value;
  if (!hasContent) return null;

  const links = [fields.Link1, fields.Link2, fields.Link3, fields.Link4, fields.Link5].filter(
    (link) => link?.value?.href
  );

  return (
    <div className={`component business-size-card ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
        {/* Illustration */}
        {fields.Image?.value?.src && (
          <div className="flex items-center justify-center px-6 pt-6">
            <SitecoreImage field={fields.Image} className="h-28 w-auto object-contain lg:h-36" />
          </div>
        )}

        {/* Content */}
        <div className="flex grow flex-col p-6">
          {/* Employee Count Label */}
          {fields.EmployeeCountLabel?.value && (
            <p className="mb-1 text-center text-xs font-semibold tracking-wider text-[#555] uppercase">
              <Text field={fields.EmployeeCountLabel} />
            </p>
          )}

          {/* Title */}
          <h3 className="mb-3 text-center text-xl font-bold text-[#1A1A2E]">
            <Text field={fields.Title} />
          </h3>

          {/* Description */}
          {fields.Description?.value && (
            <div className="mb-5 text-center text-sm leading-relaxed text-[#555]">
              <RichText field={fields.Description} />
            </div>
          )}

          {/* Service Links */}
          {links.length > 0 && (
            <div className="mt-auto border-t border-gray-100">
              {links.map((link, i) => (
                <SitecoreLink
                  key={i}
                  field={link}
                  className="flex items-center justify-between border-b border-gray-100 py-3 text-sm text-[#333] transition-colors hover:text-[#D0271D]"
                >
                  <span>{link.value?.text}</span>
                  <ArrowRight className="h-4 w-4" />
                </SitecoreLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
