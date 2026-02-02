import React, { type JSX } from 'react';
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
import { Twitter, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

/**
 * FooterSection Component
 * Main site footer with email signup, navigation columns, badges, and copyright
 * 
 * Layout:
 * - "Be first to know" email signup section (dark blue)
 * - Footer content with link columns (white background)
 * - Accreditation badges
 * - Bottom bar with copyright and legal links
 */

interface FooterLink {
  fields: {
    Title: TextField;
    Link: LinkField;
  };
}

interface FooterColumn {
  fields: {
    Title: TextField;
    Links: FooterLink[];
  };
}

interface Badge {
  fields: {
    Image: ImageField;
    Link: LinkField;
  };
}

interface Fields {
  /** Email signup section */
  SignupTitle: TextField;
  SignupDescription: TextField;
  EmailPlaceholder: TextField;
  SignupButtonText: TextField;
  
  /** Footer columns */
  Columns: FooterColumn[];
  
  /** Social links */
  TwitterLink: LinkField;
  FacebookLink: LinkField;
  InstagramLink: LinkField;
  YoutubeLink: LinkField;
  LinkedinLink: LinkField;
  
  /** Badges */
  TrustpilotBadge: ImageField;
  AccreditationBadges: Badge[];
  
  /** Bottom bar */
  CopyrightText: TextField;
  LegalLinks: FooterLink[];
}

export type FooterSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FooterSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const phFooterContent = `footerContent-${DynamicPlaceholderId}`;

  return (
    <footer
      className={`component footer-section ${styles || ''}`}
      id={id}
    >
      {/* Email Signup Section */}
      <div className="bg-[#003057] text-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="lg:max-w-md">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  {fields.SignupTitle ? (
                    <Text field={fields.SignupTitle} />
                  ) : (
                    'Be first to know'
                  )}
                </h2>
                {fields.SignupDescription && (
                  <p className="text-white/80 text-sm">
                    <Text field={fields.SignupDescription} />
                  </p>
                )}
              </div>
              <div className="flex-1 lg:max-w-md">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder={fields.EmailPlaceholder?.value as string || 'Enter your email here'}
                    className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
                  />
                  <button
                    type="submit"
                    className="bg-white text-[#003057] font-semibold px-6 py-3 rounded hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    {fields.SignupButtonText ? (
                      <Text field={fields.SignupButtonText} />
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white py-10 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Dynamic columns from Sitecore */}
            {fields.Columns?.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="text-[#0072CE] font-semibold text-sm mb-4">
                  <Text field={column.fields.Title} />
                </h3>
                <ul className="space-y-2">
                  {column.fields.Links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <SitecoreLink
                        field={link.fields.Link}
                        className="text-[#003057] hover:text-[#0072CE] text-sm transition-colors"
                      >
                        <Text field={link.fields.Title} />
                      </SitecoreLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Links */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-[#0072CE] font-semibold text-sm mb-4">
                Visit our Inspiration Hub
              </h3>
              <div className="flex items-center gap-3 mt-4">
                {fields.TwitterLink && (
                  <SitecoreLink
                    field={fields.TwitterLink}
                    className="text-[#003057] hover:text-[#0072CE] transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </SitecoreLink>
                )}
                {fields.FacebookLink && (
                  <SitecoreLink
                    field={fields.FacebookLink}
                    className="text-[#003057] hover:text-[#0072CE] transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </SitecoreLink>
                )}
                {fields.InstagramLink && (
                  <SitecoreLink
                    field={fields.InstagramLink}
                    className="text-[#003057] hover:text-[#0072CE] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </SitecoreLink>
                )}
                {fields.YoutubeLink && (
                  <SitecoreLink
                    field={fields.YoutubeLink}
                    className="text-[#003057] hover:text-[#0072CE] transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </SitecoreLink>
                )}
                {fields.LinkedinLink && (
                  <SitecoreLink
                    field={fields.LinkedinLink}
                    className="text-[#003057] hover:text-[#0072CE] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </SitecoreLink>
                )}
              </div>
            </div>
          </div>

          {/* Accreditation Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t border-gray-200">
            {fields.TrustpilotBadge && (
              <SitecoreImage
                field={fields.TrustpilotBadge}
                className="h-8 w-auto object-contain"
              />
            )}
            {fields.AccreditationBadges?.map((badge, index) => (
              <div key={index}>
                {badge.fields.Link ? (
                  <SitecoreLink field={badge.fields.Link}>
                    <SitecoreImage
                      field={badge.fields.Image}
                      className="h-12 w-auto object-contain"
                    />
                  </SitecoreLink>
                ) : (
                  <SitecoreImage
                    field={badge.fields.Image}
                    className="h-12 w-auto object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-[#003057]/70">
            <div>
              {fields.CopyrightText ? (
                <Text field={fields.CopyrightText} />
              ) : (
                <span>&copy; Miller Homes Limited 2026 - All rights reserved. Registered in Scotland No. SC359429</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {fields.LegalLinks?.map((link, index) => (
                <SitecoreLink
                  key={index}
                  field={link.fields.Link}
                  className="hover:text-[#0072CE] transition-colors"
                >
                  <Text field={link.fields.Title} />
                </SitecoreLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for additional footer content */}
      <Placeholder name={phFooterContent} rendering={props.rendering} />
    </footer>
  );
};
