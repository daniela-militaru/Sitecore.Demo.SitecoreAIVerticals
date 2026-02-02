'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, Navigation, Share2, Phone, Calendar, MessageSquare, Download } from 'lucide-react';

/**
 * DevelopmentInfoSection Component
 * Main info section for development pages with title, address, register interest, and contact
 * 
 * Two-column layout:
 * - Left: Development name, address, directions, share, register interest, description
 * - Right: Opening hours, contact buttons, brochure download
 */

interface Fields {
  /** Development name */
  Name: TextField;
  /** Address */
  Address: TextField;
  /** Get directions link */
  DirectionsLink: LinkField;
  /** Section heading (e.g., "Register Your Interest Today") */
  RegisterHeading: TextField;
  /** Release info heading */
  ReleaseHeading: TextField;
  /** Main description */
  Description: RichTextField;
  /** Read more link */
  ReadMoreLink: LinkField;
  /** Opening hours heading */
  OpeningHoursHeading: TextField;
  /** Weekday hours */
  WeekdayHours: TextField;

  /** Weekend hours */
  WeekendHours: TextField;
  /** Call button link */
  CallLink: LinkField;
  /** Appointment button link */
  AppointmentLink: LinkField;
  /** Question button link */
  QuestionLink: LinkField;
  /** WhatsApp link */
  WhatsAppLink: LinkField;
  /** Brochure download link */
  BrochureLink: LinkField;
  /** Personalised brochure link */
  PersonalisedBrochureLink: LinkField;
}

export type DevelopmentInfoSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentInfoSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component development-info-section bg-white py-8 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="flex-1">
            {/* Title */}
            {fields.Name && (
              <h1 className="text-3xl md:text-4xl font-bold text-[#003057] mb-3">
                <Text field={fields.Name} />
              </h1>
            )}

            {/* Address & Actions */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              {fields.Address && (
                <span className="text-[#4a4a4a]">
                  <Text field={fields.Address} />
                </span>
              )}
              {fields.DirectionsLink && (
                <SitecoreLink
                  field={fields.DirectionsLink}
                  className="flex items-center gap-1 text-[#0072CE] hover:underline"
                >
                  <Navigation className="w-4 h-4" />
                </SitecoreLink>
              )}
              <button className="flex items-center gap-1 text-[#0072CE] hover:underline">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Register Interest Heading */}
            {fields.RegisterHeading && (
              <h2 className="text-xl font-bold text-[#003057] mb-2">
                <Text field={fields.RegisterHeading} />
              </h2>
            )}

            {/* Release Heading */}
            {fields.ReleaseHeading && (
              <h3 className="text-lg font-semibold text-[#0072CE] mb-4">
                <Text field={fields.ReleaseHeading} />
              </h3>
            )}

            {/* Description */}
            {fields.Description && (
              <div className="prose prose-sm max-w-none text-[#4a4a4a] mb-4 [&_a]:text-[#0072CE]">
                <RichText field={fields.Description} />
              </div>
            )}

            {/* Read More */}
            {fields.ReadMoreLink && (
              <SitecoreLink
                field={fields.ReadMoreLink}
                className="text-[#0072CE] hover:underline text-sm font-medium"
              />
            )}
          </div>

          {/* Right Column */}
          <div className="lg:w-[320px] flex-shrink-0">
            {/* Opening Hours */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#003057] mb-2">
                {fields.OpeningHoursHeading ? (
                  <Text field={fields.OpeningHoursHeading} />
                ) : (
                  'Our opening hours are:'
                )}
              </h4>
              <div className="text-sm text-[#4a4a4a] space-y-1">
                {fields.WeekdayHours && (
                  <p><strong>Monday - Friday:</strong> <Text field={fields.WeekdayHours} /></p>
                )}
                {fields.WeekendHours && (
                  <p><strong>Saturday & Sunday:</strong> <Text field={fields.WeekendHours} /></p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Register for updates */}
              <button className="w-full flex items-center justify-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-4 rounded transition-colors text-sm">
                <MapPin className="w-4 h-4" />
                Register for updates
              </button>

              {/* Book appointment */}
              {fields.AppointmentLink ? (
                <SitecoreLink
                  field={fields.AppointmentLink}
                  className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent"
                />
              ) : (
                <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Book an appointment
                </button>
              )}

              {/* Ask a question */}
              <button className="w-full flex items-center justify-center gap-2 border border-[#003057] text-[#003057] hover:bg-[#003057] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                <MessageSquare className="w-4 h-4" />
                Ask a Question
              </button>

              {/* WhatsApp */}
              <button className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-medium py-3 px-4 rounded transition-colors text-sm bg-transparent">
                <MessageSquare className="w-4 h-4" />
                Launch WhatsApp
              </button>
            </div>

            {/* Downloads */}
            <div className="mt-6 space-y-2">
              <button className="flex items-center gap-2 text-[#003057] hover:text-[#0072CE] text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
              <button className="flex items-center gap-2 text-[#003057] hover:text-[#0072CE] text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Create Personalised Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
