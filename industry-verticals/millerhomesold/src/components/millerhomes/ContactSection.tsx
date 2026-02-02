'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
  Text,
  RichText,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, Phone, Calendar, Download, MessageSquare } from 'lucide-react';

/**
 * ContactSection Component
 * "Visit us anytime, no appointment needed" contact section
 * 
 * Features:
 * - Large background image
 * - Opening hours
 * - Address with directions
 * - Contact buttons (call, appointment, brochure)
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle */
  Subtitle: TextField;
  /** Opening hours text */
  OpeningHours: RichTextField;
  /** Address */
  Address: TextField;
  /** Get directions link */
  DirectionsLink: LinkField;
  /** Phone link */
  PhoneLink: LinkField;
  /** Ask question link */
  QuestionLink: LinkField;
  /** Brochure download link */
  BrochureLink: LinkField;
  /** Personalised brochure link */
  PersonalisedBrochureLink: LinkField;
  /** Appointment link */
  AppointmentLink: LinkField;
  /** Background image */
  BackgroundImage: ImageField;
}

export type ContactSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContactSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div
      className={`component contact-section relative py-16 md:py-24 ${styles || ''}`}
      id={id}
    >
      {/* Background Image */}
      {fields.BackgroundImage ? (
        <div className="absolute inset-0 z-0">
          <SitecoreImage
            field={fields.BackgroundImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#003057]/80" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#003057]" />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-2">
            {fields.Title ? (
              <Text field={fields.Title} />
            ) : (
              'Visit us anytime,'
            )}
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white mb-8">
            {fields.Subtitle ? (
              <Text field={fields.Subtitle} />
            ) : (
              'no appointment needed.'
            )}
          </p>

          {/* Opening Hours */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Our opening hours are:</h3>
            {fields.OpeningHours ? (
              <div className="text-white/80 text-sm">
                <RichText field={fields.OpeningHours} />
              </div>
            ) : (
              <div className="text-white/80 text-sm">
                <p><strong>Monday - Friday:</strong> 10.30am to 5.30pm</p>
                <p><strong>Saturday & Sunday:</strong> 10.30am to 5.30pm</p>
              </div>
            )}
          </div>

          {/* Address */}
          {fields.Address && (
            <p className="text-white/80 text-sm mb-6">
              <Text field={fields.Address} />
            </p>
          )}

          {/* Action Buttons Row 1 */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm border border-white/20">
              <MapPin className="w-4 h-4" />
              Get Directions
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm border border-white/20">
              <Phone className="w-4 h-4" />
              01234567890
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm border border-white/20">
              <MessageSquare className="w-4 h-4" />
              Ask a Question
            </button>
          </div>

          {/* Action Buttons Row 2 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm border border-white/20">
              <Download className="w-4 h-4" />
              Download Brochure
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm border border-white/20">
              <Download className="w-4 h-4" />
              Create Personalised Brochure
            </button>
          </div>

          {/* Book Appointment */}
          <button className="flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-3 px-6 rounded transition-colors">
            <Calendar className="w-5 h-5" />
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
};
