'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  LinkField,
  Link as SitecoreLink,
  Image as SitecoreImage,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  getEntitlementOperatorFromField,
  getRequiredAuth0KeysFromEntitlements,
  getRequiredRolesFromField,
  useComponentEntitlementDecision,
} from '@/lib/entitlements/componentEntitlements';
import type { EntitlementItem, RoleItem } from '@/lib/entitlements/componentEntitlements';

/**
 * serviceCard Component
 * Individual service card used inside servicesSection
 * "Global implementation team", "Compliance-ready", "Trusted provider", etc.
 *
 * Layout:
 * - Centered icon/illustration at top
 * - Bold title
 * - Description text with optional bold/linked keywords
 * - White card with subtle border, centered content
 */

interface Fields {
  Icon: ImageField;
  Title: TextField;
  Description: RichTextField;
  Link: LinkField;
  LinkText: TextField;
  Entitlements: EntitlementItem[];
  EntitlementOperator?: LinkField;
  Roles: RoleItem[];
  RolesOperator: LinkField;
}

const defaultFields: Fields = {
  Icon: { value: { src: '/icons/global-team.svg', alt: 'Global implementation team' } },
  Title: { value: 'Global implementation team' },
  Description: {
    value:
      '<p>Thousands of ADP professionals in 140 countries are on hand to advise and support your <strong>global payroll</strong> adoption.</p>',
  },
  Link: {
    value: { href: 'https://www.adp.com/what-we-offer/global-solutions/global-payroll.aspx' },
  },
  LinkText: { value: 'Learn more about our global payroll solutions' },
  Entitlements: [],
  EntitlementOperator: { value: { id: '{95926502-E249-4B28-90F7-CEBF2F744D53}', value: '' } },
  Roles: [],
  RolesOperator: { value: { id: '', value: '' } },
};

export type serviceCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: serviceCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;

  const requiredKeys = useMemo(
    () => getRequiredAuth0KeysFromEntitlements(fields?.Entitlements),
    [fields?.Entitlements]
  );
  const operator = useMemo(
    () => getEntitlementOperatorFromField(fields?.EntitlementOperator),
    [fields?.EntitlementOperator]
  );
  const requiredRoles = useMemo(() => getRequiredRolesFromField(fields?.Roles), [fields?.Roles]);
  const rolesOperator = useMemo(
    () => getEntitlementOperatorFromField(fields?.RolesOperator),
    [fields?.RolesOperator]
  );
  const { allowed, isLoading, isSecured } = useComponentEntitlementDecision(
    requiredKeys,
    operator,
    requiredRoles,
    rolesOperator
  );

  if (!isEditingOrPreview && isSecured) {
    if (isLoading) return null;
    if (!allowed) return null;
  }

  const hasContent = fields.Title?.value;
  if (!hasContent) return null;

  return (
    <div className={`component service-card w-full ${styles || ''}`} id={id}>
      <div className="flex h-full flex-col items-center rounded-lg border border-[#d0d0d0] bg-white px-6 pt-8 pb-8 text-center lg:px-8 lg:pt-10 lg:pb-10">
        {/* Icon */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center">
          <SitecoreImage field={fields.Icon} className="h-14 w-14 object-contain" />
        </div>
        {/* Title */}
        {fields.Link?.value?.href ? (
          <SitecoreLink field={fields.Link}>
            <Text
              tag="h3"
              field={fields.Title}
              className="mb-3 text-lg font-bold text-[#D0271D] lg:text-xl"
            />
          </SitecoreLink>
        ) : (
          <Text
            tag="h3"
            field={fields.Title}
            className="mb-3 text-lg font-bold text-[#D0271D] lg:text-xl"
          />
        )}
        {/* Description -- links and bold text styled red via scoped CSS */}
        <div className="service-card-description text-sm leading-relaxed text-[#333]">
          <RichText field={fields.Description} />
        </div>
      </div>

      <style jsx>{`
        .service-card-description :global(a),
        .service-card-description :global(strong) {
          color: #d0271d;
        }
        .service-card-description :global(a) {
          text-decoration: none;
        }
        .service-card-description :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
