'use client';

import React, { type JSX, useState } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ContactFormSection Component
 * "Let's find the perfect solution for your business" form section
 *
 * Layout:
 * - Title + subtitle
 * - "How can we help today?" radio group (Quote / Demo / Sales question)
 * - Form fields: First Name, Last Name, Area of Interest, Email, Job Title,
 *   Phone Number, Business Name, # of Employees, Postcode, Country, ADP client Y/N, Comments
 * - "Get Started" submit button
 * - Phone number below
 * - Privacy disclaimer text
 * - White/light background
 */

interface Fields {
  Title: TextField;
  Subtitle: TextField;
  HelpTypeLabel: TextField;
  Option1: TextField;
  Option2: TextField;
  Option3: TextField;
  FirstNameLabel: TextField;
  LastNameLabel: TextField;
  AreaOfInterestLabel: TextField;
  EmailLabel: TextField;
  EmailPlaceholder: TextField;
  JobTitleLabel: TextField;
  PhoneNumberLabel: TextField;
  BusinessNameLabel: TextField;
  EmployeesLabel: TextField;
  PostcodeLabel: TextField;
  CountryLabel: TextField;
  CurrentClientLabel: TextField;
  CommentsLabel: TextField;
  SubmitText: TextField;
  PhoneText: TextField;
  DisclaimerText: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: "Let's find the perfect solution for your business" },
  Subtitle: { value: 'How can we help today?' },
  HelpTypeLabel: { value: 'How can we help today?' },
  Option1: { value: 'Quote' },
  Option2: { value: 'Demo' },
  Option3: { value: 'Sales question' },
  FirstNameLabel: { value: 'First Name' },
  LastNameLabel: { value: 'Last Name' },
  AreaOfInterestLabel: { value: 'Area of interest' },
  EmailLabel: { value: 'Email' },
  EmailPlaceholder: { value: 'Enter your business email' },
  JobTitleLabel: { value: 'Job Title' },
  PhoneNumberLabel: { value: 'Phone Number' },
  BusinessNameLabel: { value: 'Business Name' },
  EmployeesLabel: { value: '# of Employees' },
  PostcodeLabel: { value: 'Postcode' },
  CountryLabel: { value: 'Country' },
  CurrentClientLabel: { value: 'Are you a current ADP client?' },
  CommentsLabel: { value: 'Comments' },
  SubmitText: { value: 'Get Started' },
  PhoneText: { value: 'Call us at: 0800 1707 677' },
  DisclaimerText: {
    value:
      '<p>By submitting this form you are informed that ADP may contact you about its products, services, and offers, according to our <a href="/privacy">Privacy statement for Business contacts</a>.</p>',
  },
};

export type ContactFormSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContactFormSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const [selectedOption, setSelectedOption] = useState('quote');

  return (
    <section
      className={`component contact-form-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-2xl px-4">
        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {/* Subtitle / Radio Group */}
        <p className="mb-4 text-center text-sm text-[#555]">
          <Text field={fields.Subtitle} />
        </p>

        {/* Help Type Radio */}
        <div className="mb-8 flex items-center justify-center gap-6">
          <label className="flex items-center gap-2 text-sm text-[#333]">
            <input
              type="radio"
              name="helpType"
              value="quote"
              checked={selectedOption === 'quote'}
              onChange={() => setSelectedOption('quote')}
              className="h-4 w-4 accent-[#D0271D]"
            />
            <Text field={fields.Option1} />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#333]">
            <input
              type="radio"
              name="helpType"
              value="demo"
              checked={selectedOption === 'demo'}
              onChange={() => setSelectedOption('demo')}
              className="h-4 w-4 accent-[#D0271D]"
            />
            <Text field={fields.Option2} />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#333]">
            <input
              type="radio"
              name="helpType"
              value="sales"
              checked={selectedOption === 'sales'}
              onChange={() => setSelectedOption('sales')}
              className="h-4 w-4 accent-[#D0271D]"
            />
            <Text field={fields.Option3} />
          </label>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.FirstNameLabel} />
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.LastNameLabel} />
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Area of Interest */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.AreaOfInterestLabel} />
            </label>
            <select className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]">
              <option value="payroll">Payroll</option>
              <option value="hr">HR</option>
              <option value="time-attendance">Time & Attendance</option>
              <option value="talent">Talent</option>
              <option value="hcm">HCM</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.EmailLabel} />
            </label>
            <input
              type="email"
              placeholder={fields.EmailPlaceholder?.value as string}
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.JobTitleLabel} />
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.PhoneNumberLabel} />
            </label>
            <input
              type="tel"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.BusinessNameLabel} />
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Employees + Postcode row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#333]">
                <Text field={fields.EmployeesLabel} />
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#333]">
                <Text field={fields.PostcodeLabel} />
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.CountryLabel} />
            </label>
            <select className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]">
              <option value="uk">United Kingdom</option>
              <option value="ie">Ireland</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Current ADP Client */}
          <div className="text-center">
            <p className="mb-2 text-sm text-[#333]">
              <Text field={fields.CurrentClientLabel} />
            </p>
            <div className="flex items-center justify-center gap-6">
              <label className="flex items-center gap-2 text-sm text-[#333]">
                <input
                  type="radio"
                  name="currentClient"
                  value="yes"
                  className="h-4 w-4 accent-[#D0271D]"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-[#333]">
                <input
                  type="radio"
                  name="currentClient"
                  value="no"
                  defaultChecked
                  className="h-4 w-4 accent-[#D0271D]"
                />
                No
              </label>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#333]">
              <Text field={fields.CommentsLabel} />
            </label>
            <textarea
              rows={4}
              className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-[#333] outline-none focus:border-[#D0271D] focus:ring-1 focus:ring-[#D0271D]"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-[#D0271D] px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
            >
              <Text field={fields.SubmitText} />
            </button>
          </div>

          {/* Phone */}
          <p className="text-center text-sm text-[#333]">
            <Text field={fields.PhoneText} />
          </p>

          {/* Disclaimer */}
          <div className="text-center text-xs leading-relaxed text-[#777]">
            <RichText field={fields.DisclaimerText} />
          </div>
        </form>
      </div>
    </section>
  );
};
