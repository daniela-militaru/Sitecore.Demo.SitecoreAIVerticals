'use client';

import React, { type JSX, useState } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Menu, X, ChevronDown, Home } from 'lucide-react';

/**
 * HeaderSection Component
 * Main site header with logo, navigation, utility links, and mobile menu
 * 
 * Includes:
 * - Logo
 * - Main navigation with dropdowns
 * - Utility links (Corporate, Login/Register, My Miller Home)
 * - "Find My New Home" CTA button
 * - Mobile hamburger menu
 */

interface NavItem {
  fields: {
    Title: TextField;
    Link: LinkField;
    HasDropdown: { value: boolean };
  };
}

interface Fields {
  Logo: ImageField;
  LogoLink: LinkField;
  NavigationItems: NavItem[];
  CorporateLink: LinkField;
  LoginLink: LinkField;
  MyMillerHomeLink: LinkField;
  FindHomeButtonText: TextField;
  FindHomeButtonLink: LinkField;
}

export type HeaderSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeaderSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phMegaMenu = `megaMenu-${DynamicPlaceholderId}`;

  return (
    <header
      className={`component header-section bg-white sticky top-0 z-40 shadow-sm ${styles || ''}`}
      id={id}
    >
      {/* Top utility bar - hidden on mobile */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end gap-6 py-2 text-sm">
            {fields.CorporateLink && (
              <SitecoreLink
                field={fields.CorporateLink}
                className="text-[#003057] hover:text-[#0072CE] transition-colors"
              />
            )}
            {fields.LoginLink && (
              <SitecoreLink
                field={fields.LoginLink}
                className="text-[#003057] hover:text-[#0072CE] transition-colors"
              />
            )}
            {fields.MyMillerHomeLink && (
              <SitecoreLink
                field={fields.MyMillerHomeLink}
                className="flex items-center gap-2 text-[#003057] hover:text-[#0072CE] transition-colors"
              >
                <Home className="w-4 h-4" />
              </SitecoreLink>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {fields.LogoLink ? (
              <SitecoreLink field={fields.LogoLink} className="block">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#003057]">miller</span>
                  <span className="text-2xl font-light text-[#0072CE]">homes</span>
                </div>
              </SitecoreLink>
            ) : (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#003057]">miller</span>
                <span className="text-2xl font-light text-[#0072CE]">homes</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {fields.NavigationItems?.map((item, index) => (
              <div key={index} className="relative group">
                <SitecoreLink
                  field={item.fields.Link}
                  className="flex items-center gap-1 text-[#003057] hover:text-[#0072CE] font-medium text-sm transition-colors py-2"
                >
                  <Text field={item.fields.Title} />
                  {item.fields.HasDropdown?.value && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </SitecoreLink>
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            {fields.FindHomeButtonLink && (
              <SitecoreLink
                field={fields.FindHomeButtonLink}
                className="inline-flex items-center gap-2 bg-[#e85a1e] hover:bg-[#d14d14] text-white font-medium py-2.5 px-5 rounded transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                {fields.FindHomeButtonText && <Text field={fields.FindHomeButtonText} />}
              </SitecoreLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#003057]"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              {fields.NavigationItems?.map((item, index) => (
                <SitecoreLink
                  key={index}
                  field={item.fields.Link}
                  className="flex items-center justify-between text-[#003057] hover:text-[#0072CE] font-medium py-3 border-b border-gray-100"
                >
                  <Text field={item.fields.Title} />
                  {item.fields.HasDropdown?.value && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </SitecoreLink>
              ))}
            </nav>

            {/* Mobile utility links */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200">
              {fields.CorporateLink && (
                <SitecoreLink
                  field={fields.CorporateLink}
                  className="text-[#003057] hover:text-[#0072CE] py-2 text-sm"
                />
              )}
              {fields.LoginLink && (
                <SitecoreLink
                  field={fields.LoginLink}
                  className="text-[#003057] hover:text-[#0072CE] py-2 text-sm"
                />
              )}
              {fields.MyMillerHomeLink && (
                <SitecoreLink
                  field={fields.MyMillerHomeLink}
                  className="flex items-center gap-2 text-[#003057] hover:text-[#0072CE] py-2 text-sm"
                >
                  <Home className="w-4 h-4" />
                </SitecoreLink>
              )}
            </div>

            {/* Mobile CTA */}
            {fields.FindHomeButtonLink && (
              <SitecoreLink
                field={fields.FindHomeButtonLink}
                className="flex items-center justify-center gap-2 bg-[#e85a1e] hover:bg-[#d14d14] text-white font-medium py-3 px-5 rounded mt-4 text-sm"
              >
                <Home className="w-4 h-4" />
                {fields.FindHomeButtonText && <Text field={fields.FindHomeButtonText} />}
              </SitecoreLink>
            )}
          </div>
        </div>
      )}

      {/* Mega Menu Placeholder */}
      <Placeholder name={phMegaMenu} rendering={props.rendering} />
    </header>
  );
};
