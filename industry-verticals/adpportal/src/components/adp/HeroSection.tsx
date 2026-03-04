/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import type { JSX } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  getRequiredAuth0KeysFromEntitlements,
  getUserEntitlementsFromUser,
  userHasSomeRequiredKey,
} from '@/lib/entitlements/componentEntitlements';
import type { EntitlementItem } from '@/lib/entitlements/componentEntitlements';

interface Fields {
  Title: TextField;
  Subtitle: RichTextField;
  EmailPlaceholder: TextField;
  CTAText: TextField;
  CTALink: LinkField;
  HeroImage: ImageField;

  // ✅ Entitlements lives on the datasource, so it comes through as a datasource field here
  Entitlements: EntitlementItem[];
}

const defaultFields: Fields = {
  Title: { value: 'Experience better payroll and HR' },
  Subtitle: {
    value: '<p>Award-winning payroll services and HR solutions for all business sizes</p>',
  },
  EmailPlaceholder: { value: 'Enter your business email' },
  CTAText: { value: 'Get Pricing' },
  CTALink: { value: { href: '/get-pricing' } },
  HeroImage: { value: { src: '/hero-image.jpg', alt: 'ADP Payroll and HR Solutions' } },
  Entitlements: [],
};

export type HeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeroSectionProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  // Edit/Preview bypass (must always show)
  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;

  console.log('HeroSection Entitlements:', fields.Entitlements);
  const requiredKeys = getRequiredAuth0KeysFromEntitlements(fields?.Entitlements);
  console.log('Required Auth0 Keys for this component:', requiredKeys);
  const isSecured = requiredKeys.length > 0;

  const { user, isLoading } = useUser();

  if (!isEditingOrPreview && isSecured) {
    // Fail-closed while Auth0 user is loading to avoid flicker/leakage
    if (isLoading) return null;

    // Not logged in => hide secured component
    if (!user) return null;

    const entitlements = getUserEntitlementsFromUser(user as any);
    const allowed = userHasSomeRequiredKey(requiredKeys, entitlements);

    if (!allowed) return null;
  }

  return (
    <section className={`component hero-section bg-white py-8 lg:py-16 ${styles || ''}`} id={id}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 lg:max-w-lg lg:pt-8">
            <h1 className="mb-4 text-3xl leading-tight font-bold text-[#1A1A2E] lg:text-5xl lg:leading-tight">
              <Text field={fields.Title} />
            </h1>

            <div className="mb-6 text-base leading-relaxed text-[#555] lg:text-lg">
              <RichText field={fields.Subtitle} />
            </div>

            {fields.EmailPlaceholder?.value ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder={fields.EmailPlaceholder.value as string}
                  className="flex-1 rounded border border-gray-300 px-4 py-3 text-sm text-[#333] transition-colors outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
                />
                <SitecoreLink
                  field={fields.CTALink}
                  className="inline-flex items-center justify-center rounded bg-[#D0271D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
                >
                  <Text field={fields.CTAText} />
                </SitecoreLink>
              </div>
            ) : (
              <SitecoreLink
                field={fields.CTALink}
                className="inline-flex items-center justify-center rounded bg-[#D0271D] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative flex-1">
            <div className="relative overflow-hidden rounded-lg">
              <SitecoreImage field={fields.HeroImage} className="h-auto w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
