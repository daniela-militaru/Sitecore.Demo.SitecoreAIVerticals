'use client';

import React, { type JSX, useState } from 'react';
import {
  TextField,
  Text,
  LinkField,
  Link as SitecoreLink,
  ImageField,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';

/**
 * HeaderSection Component
 * ADP-style header with logo, navigation, phone number, and Free Quote CTA
 *
 * Layout:
 * - Desktop: ADP logo left, main nav center, phone + Free Quote right
 * - Mobile: Hamburger left, ADP logo center-left, phone + Free Quote right
 * - Sticky top navigation
 */

interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
  PhoneNumber: TextField;
  PhoneLink: LinkField;
  FreeQuoteText: TextField;
  FreeQuoteLink: LinkField;
  NavItem1Text: TextField;
  NavItem1Link: LinkField;
  NavItem2Text: TextField;
  NavItem2Link: LinkField;
  NavItem3Text: TextField;
  NavItem3Link: LinkField;
  NavItem4Text: TextField;
  NavItem4Link: LinkField;
  CloseMenuText: TextField;
  OpenMenuText: TextField;
}

const defaultFields: Fields = {
  Logo: { value: { src: '/adp-logo.svg', alt: 'ADP' } },
  LogoLink: { value: { href: '/' } },
  PhoneNumber: { value: '0800 1707 677' },
  PhoneLink: { value: { href: 'tel:08001707677' } },
  FreeQuoteText: { value: 'Free Quote' },
  FreeQuoteLink: { value: { href: '/quote' } },
  NavItem1Text: { value: 'Payroll Services' },
  NavItem1Link: { value: { href: '/payroll-services' } },
  NavItem2Text: { value: 'HR' },
  NavItem2Link: { value: { href: '/hr' } },
  NavItem3Text: { value: 'Time & Attendance' },
  NavItem3Link: { value: { href: '/time-attendance' } },
  NavItem4Text: { value: 'About ADP' },
  NavItem4Link: { value: { href: '/about' } },
  CloseMenuText: { value: 'Close menu' },
  OpenMenuText: { value: 'Open menu' },
};

export type HeaderSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeaderSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phHeaderNav = `header-nav-${DynamicPlaceholderId}`;

  return (
    <header
      className={`component header-section sticky top-0 z-50 bg-white shadow-sm ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger - Mobile/Tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center text-[#333] lg:hidden"
              aria-label={
                isMobileMenuOpen
                  ? (fields.CloseMenuText?.value as string)
                  : (fields.OpenMenuText?.value as string)
              }
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* ADP Logo */}
            <SitecoreLink field={fields.LogoLink} className="block shrink-0">
              {fields.Logo?.value?.src ? (
                <SitecoreImage field={fields.Logo} className="h-8 w-auto lg:h-10" />
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-black tracking-tight text-[#D0271D]">adp</span>
                </div>
              )}
            </SitecoreLink>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {fields.NavItem1Link?.value?.href && (
              <SitecoreLink
                field={fields.NavItem1Link}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <Text field={fields.NavItem1Text} />
                <ChevronDown className="h-3.5 w-3.5" />
              </SitecoreLink>
            )}
            {fields.NavItem2Link?.value?.href && (
              <SitecoreLink
                field={fields.NavItem2Link}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <Text field={fields.NavItem2Text} />
                <ChevronDown className="h-3.5 w-3.5" />
              </SitecoreLink>
            )}
            {fields.NavItem3Link?.value?.href && (
              <SitecoreLink
                field={fields.NavItem3Link}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <Text field={fields.NavItem3Text} />
                <ChevronDown className="h-3.5 w-3.5" />
              </SitecoreLink>
            )}
            {fields.NavItem4Link?.value?.href && (
              <SitecoreLink
                field={fields.NavItem4Link}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <Text field={fields.NavItem4Text} />
                <ChevronDown className="h-3.5 w-3.5" />
              </SitecoreLink>
            )}

            {/* Placeholder for additional nav items */}
            <div className="header-nav-wrapper flex items-center">
              <Placeholder name={phHeaderNav} rendering={props.rendering} />
            </div>
          </nav>

          {/* Right: Phone + Free Quote */}
          <div className="flex items-center gap-3">
            {/* Phone - desktop only */}
            {fields.PhoneLink?.value?.href && (
              <SitecoreLink
                field={fields.PhoneLink}
                className="hidden items-center gap-2 text-sm font-semibold text-[#333] transition-colors hover:text-[#D0271D] lg:flex"
              >
                <Phone className="h-4 w-4" />
                <Text field={fields.PhoneNumber} />
              </SitecoreLink>
            )}

            {/* Free Quote Button */}
            {fields.FreeQuoteLink?.value?.href && (
              <SitecoreLink
                field={fields.FreeQuoteLink}
                className="inline-flex items-center rounded border-2 border-[#D0271D] px-4 py-1.5 text-sm font-semibold text-[#D0271D] transition-colors hover:bg-[#D0271D] hover:text-white"
              >
                <Text field={fields.FreeQuoteText} />
              </SitecoreLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex flex-col gap-1">
              {fields.NavItem1Link?.value?.href && (
                <SitecoreLink
                  field={fields.NavItem1Link}
                  className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-medium text-[#333] hover:text-[#D0271D]"
                >
                  <Text field={fields.NavItem1Text} />
                  <ChevronDown className="h-4 w-4" />
                </SitecoreLink>
              )}
              {fields.NavItem2Link?.value?.href && (
                <SitecoreLink
                  field={fields.NavItem2Link}
                  className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-medium text-[#333] hover:text-[#D0271D]"
                >
                  <Text field={fields.NavItem2Text} />
                  <ChevronDown className="h-4 w-4" />
                </SitecoreLink>
              )}
              {fields.NavItem3Link?.value?.href && (
                <SitecoreLink
                  field={fields.NavItem3Link}
                  className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-medium text-[#333] hover:text-[#D0271D]"
                >
                  <Text field={fields.NavItem3Text} />
                  <ChevronDown className="h-4 w-4" />
                </SitecoreLink>
              )}
              {fields.NavItem4Link?.value?.href && (
                <SitecoreLink
                  field={fields.NavItem4Link}
                  className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-medium text-[#333] hover:text-[#D0271D]"
                >
                  <Text field={fields.NavItem4Text} />
                  <ChevronDown className="h-4 w-4" />
                </SitecoreLink>
              )}
            </nav>

            {/* Mobile placeholder nav items */}
            <div className="mobile-nav-wrapper mt-2">
              <Placeholder name={phHeaderNav} rendering={props.rendering} />
            </div>

            {/* Mobile phone link */}
            {fields.PhoneLink?.value?.href && (
              <SitecoreLink
                field={fields.PhoneLink}
                className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 text-sm font-semibold text-[#333]"
              >
                <Phone className="h-4 w-4" />
                <Text field={fields.PhoneNumber} />
              </SitecoreLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
