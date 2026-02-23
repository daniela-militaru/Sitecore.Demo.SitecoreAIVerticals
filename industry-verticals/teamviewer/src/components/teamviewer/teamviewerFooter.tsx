import {
  ComponentParams,
  ComponentRendering,
  Image,
  ImageField,
  Link,
  LinkField,
  Placeholder,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';

interface Fields {
  Logo: ImageField;
  RegionButtonText: TextField;
  TitleProducts: TextField;
  TitleONEPlatform: TextField;
  TitleSolutions: TextField;
  TitlePartner: TextField;
  TitleResources: TextField;
  TitleSupport: TextField;
  TitleCompany: TextField;
  TitleAdditionalLinks: TextField;
  CopyrightText: TextField;
  ProductDescription: LinkField;
  Imprint: LinkField;
  Contact: LinkField;
  EULA: LinkField;
  Privacy: LinkField;
  Cookies: LinkField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/teamviewer-logo.svg', alt: 'TeamViewer' } },
  RegionButtonText: { value: 'Change Region' },
  TitleProducts: { value: 'Products' },
  TitleONEPlatform: { value: 'ONE Platform' },
  TitleSolutions: { value: 'Solutions' },
  TitlePartner: { value: 'Partner' },
  TitleResources: { value: 'Resources' },
  TitleSupport: { value: 'Support' },
  TitleCompany: { value: 'Company' },
  TitleAdditionalLinks: { value: 'Additional Links' },
  CopyrightText: { value: '© 2024 TeamViewer' },
  ProductDescription: { value: { href: '#', text: 'Product Descriptions' } },
  Imprint: { value: { href: '#', text: 'Imprint' } },
  Contact: { value: { href: '#', text: 'Contact' } },
  EULA: { value: { href: '#', text: 'EULA / DPA' } },
  Privacy: { value: { href: '#', text: 'Privacy & Cookies' } },
  Cookies: { value: { href: '#', text: 'Cookies Settings' } },
};

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterProps) => {
  const id = props.params.RenderingIdentifier;
  const fields = props.fields || defaultFields;

  const phKeyProducts = `footer-products-${props?.params?.DynamicPlaceholderId}`;
  const phKeyONEPlatform = `footer-one-platform-${props?.params?.DynamicPlaceholderId}`;
  const phKeySolutions = `footer-solutions-${props?.params?.DynamicPlaceholderId}`;
  const phKeyPartner = `footer-partner-${props?.params?.DynamicPlaceholderId}`;
  const phKeyResources = `footer-resources-${props?.params?.DynamicPlaceholderId}`;
  const phKeySupport = `footer-support-${props?.params?.DynamicPlaceholderId}`;
  const phKeyCompany = `footer-company-${props?.params?.DynamicPlaceholderId}`;
  const phKeyAdditional = `footer-additional-${props?.params?.DynamicPlaceholderId}`;

  const sections = [
    { key: 'products', title: fields.TitleProducts, phKey: phKeyProducts },
    { key: 'one-platform', title: fields.TitleONEPlatform, phKey: phKeyONEPlatform },
    { key: 'solutions', title: fields.TitleSolutions, phKey: phKeySolutions },
    { key: 'partner', title: fields.TitlePartner, phKey: phKeyPartner },
    { key: 'resources', title: fields.TitleResources, phKey: phKeyResources },
    { key: 'support', title: fields.TitleSupport, phKey: phKeySupport },
    { key: 'company', title: fields.TitleCompany, phKey: phKeyCompany },
    { key: 'additional', title: fields.TitleAdditionalLinks, phKey: phKeyAdditional },
  ];

  return (
    <footer className={`component footer bg-[#050a52] text-white ${props.params.styles}`} id={id}>
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ key, phKey }) => (
            <div key={key}>
              <div className="flex flex-col gap-2 text-sm">
                <Placeholder name={phKey} rendering={props.rendering} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1a2351]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo and Region */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="w-32">
                <Image field={fields.Logo} />
              </div>
              <button className="flex items-center gap-2 text-sm text-white hover:underline">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Text field={fields.RegionButtonText} />
              </button>
            </div>

            {/* Bottom Links */}
            <div className="flex flex-wrap gap-4 text-sm lg:gap-6">
              <Link field={fields.ProductDescription} className="hover:underline" />
              <Link field={fields.Imprint} className="hover:underline" />
              <Link field={fields.Contact} className="hover:underline" />
              <Link field={fields.EULA} className="hover:underline" />
              <Link field={fields.Privacy} className="hover:underline" />
              <Link field={fields.Cookies} className="hover:underline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
