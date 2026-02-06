'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
  Placeholder,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';

/**
 * FooterSection Component
 * ADP-style footer with contact info, link columns, country selector, social icons, and legal bar
 *
 * Layout:
 * - Top: Contact section (Talk to Sales, Get Support, Login)
 * - Middle: Two columns of links (What We Offer / Who We Serve) + (Resources / About ADP)
 * - Bottom bar: ADP logo, country selector, social icons, legal links
 */

interface Fields {
  /** Contact section */
  ContactHeading: TextField;
  TalkToSalesLabel: TextField;
  TalkToSalesPhone: TextField;
  TalkToSalesLink: LinkField;
  GetSupportLink: LinkField;
  LoginLink: LinkField;

  /** Link column headings */
  WhatWeOfferTitle: TextField;
  WhoWeServeTitle: TextField;
  ResourcesTitle: TextField;
  AboutADPTitle: TextField;

  /** What We Offer links */
  PayrollServicesLink: LinkField;
  PayrollIrelandLink: LinkField;
  PayrollOutsourcingLink: LinkField;
  PayrollSoftwareLink: LinkField;
  ManagedPayrollLink: LinkField;
  HCMLink: LinkField;
  TimeAttendanceLink: LinkField;
  TalentLink: LinkField;
  HRInsightsLink: LinkField;
  HRServicesLink: LinkField;
  PartnerIntegrationsLink: LinkField;
  ProductsLink: LinkField;

  /** Who We Serve links */
  BusinessSizeLink: LinkField;
  IndustryLink: LinkField;
  TestimonialsLink: LinkField;

  /** Resources links */
  ArticlesLink: LinkField;
  TestimonialsResourceLink: LinkField;
  EventsLink: LinkField;
  GlossaryLink: LinkField;
  DemosLink: LinkField;

  /** About ADP links */
  OfficeLocationsLink: LinkField;
  GenderPayReportLink: LinkField;
  PressCentreLink: LinkField;
  InvestorsLink: LinkField;
  ContactUsLink: LinkField;

  /** Logo */
  Logo: ImageField;

  /** Country selector */
  CountryLabel: TextField;
  AllLocationsLink: LinkField;

  /** Social links */
  FacebookLink: LinkField;
  TwitterLink: LinkField;
  YoutubeLink: LinkField;
  LinkedinLink: LinkField;

  /** Legal */
  SiteMapLink: LinkField;
  PrivacyLink: LinkField;
  SlaveryStatementLink: LinkField;
  GenderPayReportsLink: LinkField;
  AccessibilityLink: LinkField;
  CopyrightText: TextField;
  CookiePreferencesText: TextField;
}

const defaultFields: Fields = {
  ContactHeading: { value: 'Contact Us' },
  TalkToSalesLabel: { value: 'Talk to Sales' },
  TalkToSalesPhone: { value: '0800 1707 677' },
  TalkToSalesLink: { value: { href: 'tel:08001707677', text: '0800 1707 677' } },
  GetSupportLink: { value: { href: '/support', text: 'Get Support' } },
  LoginLink: { value: { href: '/login', text: 'Login' } },

  WhatWeOfferTitle: { value: 'What We Offer' },
  WhoWeServeTitle: { value: 'Who We Serve' },
  ResourcesTitle: { value: 'Resources' },
  AboutADPTitle: { value: 'About ADP' },

  PayrollServicesLink: { value: { href: '/payroll-services', text: 'Payroll Services' } },
  PayrollIrelandLink: { value: { href: '/payroll-ireland', text: 'Payroll services for Ireland' } },
  PayrollOutsourcingLink: {
    value: { href: '/payroll-outsourcing', text: 'Payroll Outsourcing Services' },
  },
  PayrollSoftwareLink: { value: { href: '/payroll-software', text: 'Payroll Software' } },
  ManagedPayrollLink: { value: { href: '/managed-payroll', text: 'Managed Payroll Services' } },
  HCMLink: { value: { href: '/hcm', text: 'HCM' } },
  TimeAttendanceLink: { value: { href: '/time-attendance', text: 'Time and Attendance' } },
  TalentLink: { value: { href: '/talent', text: 'Talent' } },
  HRInsightsLink: { value: { href: '/hr-insights', text: 'HR Insights' } },
  HRServicesLink: { value: { href: '/hr-services', text: 'HR Services' } },
  PartnerIntegrationsLink: {
    value: { href: '/partner-integrations', text: 'Partner Integrations' },
  },
  ProductsLink: { value: { href: '/products', text: 'Products' } },

  BusinessSizeLink: { value: { href: '/business-size', text: 'Business Size' } },
  IndustryLink: { value: { href: '/industry', text: 'Industry' } },
  TestimonialsLink: { value: { href: '/testimonials', text: 'Testimonials' } },

  ArticlesLink: { value: { href: '/articles', text: 'ADP articles and insights' } },
  TestimonialsResourceLink: { value: { href: '/testimonials', text: 'Testimonials' } },
  EventsLink: { value: { href: '/events', text: 'Events' } },
  GlossaryLink: { value: { href: '/glossary', text: 'Payroll & HR Glossary' } },
  DemosLink: { value: { href: '/demos', text: 'Demos' } },

  OfficeLocationsLink: { value: { href: '/office-locations', text: 'Office Locations' } },
  GenderPayReportLink: { value: { href: '/gender-pay-report', text: 'Gender Pay Report' } },
  PressCentreLink: { value: { href: '/press-centre', text: 'Press Centre' } },
  InvestorsLink: { value: { href: '/investors', text: 'Investors' } },
  ContactUsLink: { value: { href: '/contact', text: 'Contact Us' } },

  Logo: { value: { src: '/adp-logo.svg', alt: 'ADP' } },

  CountryLabel: { value: 'United Kingdom' },
  AllLocationsLink: { value: { href: '/worldwide-locations', text: 'All Worldwide Locations' } },

  FacebookLink: { value: { href: 'https://facebook.com/adp' } },
  TwitterLink: { value: { href: 'https://twitter.com/adp' } },
  YoutubeLink: { value: { href: 'https://youtube.com/adp' } },
  LinkedinLink: { value: { href: 'https://linkedin.com/company/adp' } },

  SiteMapLink: { value: { href: '/sitemap', text: 'Site Map' } },
  PrivacyLink: { value: { href: '/privacy', text: 'Privacy' } },
  SlaveryStatementLink: {
    value: { href: '/modern-slavery-statement', text: 'Modern Slavery Statement' },
  },
  GenderPayReportsLink: {
    value: { href: '/gender-pay-reports', text: 'ADP UK Gender Pay Reports' },
  },
  AccessibilityLink: { value: { href: '/accessibility', text: 'Web Accessibility Statement' } },
  CopyrightText: {
    value:
      'ADP and the ADP logo are registered trademarks of ADP, Inc. All other marks are the property of their respective owners. Copyright © 2026 ADP, Inc.',
  },
  CookiePreferencesText: { value: 'Cookie Preferences' },
};

export type FooterSectionProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phFooterLinks = `footer-links-${DynamicPlaceholderId}`;

  return (
    <footer className={`component footer-section ${styles || ''}`} id={id}>
      {/* Contact Section */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h3 className="mb-4 text-lg font-bold text-[#333]">
            <Text field={fields.ContactHeading} />
          </h3>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-[#333]">
              <Text field={fields.TalkToSalesLabel} /> {'— '}
              <SitecoreLink
                field={fields.TalkToSalesLink}
                className="font-semibold text-[#D0271D] hover:underline"
              />
            </p>
            <SitecoreLink
              field={fields.GetSupportLink}
              className="text-sm text-[#333] hover:underline"
            />
            <SitecoreLink
              field={fields.LoginLink}
              className="text-sm font-semibold text-[#D0271D] hover:underline"
            />
          </div>
        </div>
      </div>

      {/* Link Columns */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {/* What We Offer */}
            <div>
              <h4 className="mb-4 text-sm font-bold text-[#333]">
                <Text field={fields.WhatWeOfferTitle} />
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  fields.PayrollServicesLink,
                  fields.PayrollIrelandLink,
                  fields.PayrollOutsourcingLink,
                  fields.PayrollSoftwareLink,
                  fields.ManagedPayrollLink,
                  fields.HCMLink,
                  fields.TimeAttendanceLink,
                  fields.TalentLink,
                  fields.HRInsightsLink,
                  fields.HRServicesLink,
                  fields.PartnerIntegrationsLink,
                  fields.ProductsLink,
                ].map(
                  (link, i) =>
                    link?.value?.href && (
                      <li key={i}>
                        <SitecoreLink
                          field={link}
                          className="text-sm text-[#555] transition-colors hover:text-[#D0271D]"
                        />
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* Who We Serve */}
            <div>
              <h4 className="mb-4 text-sm font-bold text-[#333]">
                <Text field={fields.WhoWeServeTitle} />
              </h4>
              <ul className="flex flex-col gap-2">
                {[fields.BusinessSizeLink, fields.IndustryLink, fields.TestimonialsLink].map(
                  (link, i) =>
                    link?.value?.href && (
                      <li key={i}>
                        <SitecoreLink
                          field={link}
                          className="text-sm text-[#555] transition-colors hover:text-[#D0271D]"
                        />
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-bold text-[#333]">
                <Text field={fields.ResourcesTitle} />
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  fields.ArticlesLink,
                  fields.TestimonialsResourceLink,
                  fields.EventsLink,
                  fields.GlossaryLink,
                  fields.DemosLink,
                ].map(
                  (link, i) =>
                    link?.value?.href && (
                      <li key={i}>
                        <SitecoreLink
                          field={link}
                          className="text-sm text-[#555] transition-colors hover:text-[#D0271D]"
                        />
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* About ADP */}
            <div>
              <h4 className="mb-4 text-sm font-bold text-[#333]">
                <Text field={fields.AboutADPTitle} />
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  fields.OfficeLocationsLink,
                  fields.GenderPayReportLink,
                  fields.PressCentreLink,
                  fields.InvestorsLink,
                  fields.ContactUsLink,
                ].map(
                  (link, i) =>
                    link?.value?.href && (
                      <li key={i}>
                        <SitecoreLink
                          field={link}
                          className="text-sm text-[#555] transition-colors hover:text-[#D0271D]"
                        />
                      </li>
                    )
                )}
              </ul>
            </div>
          </div>

          {/* Placeholder for additional footer link sections */}
          <div className="footer-links-extra mt-4">
            <Placeholder name={phFooterLinks} rendering={props.rendering} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Logo, Country, Social, Legal */}
      <div className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4">
          {/* Logo + Country Selector */}
          <div className="mb-6 flex flex-col items-center gap-4">
            {/* ADP Logo */}
            {fields.Logo?.value?.src ? (
              <SitecoreImage field={fields.Logo} className="h-8 w-auto" />
            ) : (
              <span className="text-2xl font-black text-[#D0271D]">adp</span>
            )}

            {/* Country Selector */}
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm text-[#333]">
                <Text field={fields.CountryLabel} />
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <SitecoreLink
                field={fields.AllLocationsLink}
                className="text-sm text-[#555] hover:text-[#D0271D]"
              />
            </div>
          </div>

          {/* Social Icons */}
          <div className="mb-6 flex items-center justify-center gap-6">
            {fields.FacebookLink?.value?.href && (
              <SitecoreLink
                field={fields.FacebookLink}
                className="text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </SitecoreLink>
            )}
            {fields.TwitterLink?.value?.href && (
              <SitecoreLink
                field={fields.TwitterLink}
                className="text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SitecoreLink>
            )}
            {fields.YoutubeLink?.value?.href && (
              <SitecoreLink
                field={fields.YoutubeLink}
                className="text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </SitecoreLink>
            )}
            {fields.LinkedinLink?.value?.href && (
              <SitecoreLink
                field={fields.LinkedinLink}
                className="text-[#333] transition-colors hover:text-[#D0271D]"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    clipRule="evenodd"
                  />
                </svg>
              </SitecoreLink>
            )}
          </div>

          {/* Legal Links */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#555]">
            {fields.SiteMapLink?.value?.href && (
              <>
                <SitecoreLink field={fields.SiteMapLink} className="hover:text-[#D0271D]" />
                <span>|</span>
              </>
            )}
            {fields.PrivacyLink?.value?.href && (
              <>
                <SitecoreLink field={fields.PrivacyLink} className="hover:text-[#D0271D]" />
                <span>|</span>
              </>
            )}
            {fields.SlaveryStatementLink?.value?.href && (
              <SitecoreLink field={fields.SlaveryStatementLink} className="hover:text-[#D0271D]" />
            )}
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#555]">
            {fields.GenderPayReportsLink?.value?.href && (
              <SitecoreLink field={fields.GenderPayReportsLink} className="hover:text-[#D0271D]" />
            )}
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#555]">
            {fields.AccessibilityLink?.value?.href && (
              <SitecoreLink field={fields.AccessibilityLink} className="hover:text-[#D0271D]" />
            )}
          </div>

          {/* Copyright */}
          <p className="mb-4 text-center text-xs text-[#777]">
            <Text field={fields.CopyrightText} />
          </p>

          {/* Cookie Preferences */}
          <div className="text-center">
            <button className="text-xs text-[#555] underline hover:text-[#D0271D]">
              <Text field={fields.CookiePreferencesText} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
