'use client';

import React, { type JSX, useState, useCallback } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * FaqSection Component
 * "Antwoorden op veelgestelde vragen" / FAQ accordion section
 *
 * Layout:
 * - Desktop: Title on the left, accordion items on the right (2-column)
 * - Mobile: Title on top, accordion items stacked below
 * - Each FAQ item has a question (clickable) and an expandable answer
 * - Chevron icon rotates on expand/collapse
 */

interface Fields {
  Title: TextField;
  Faq1Question: TextField;
  Faq1Answer: RichTextField;
  Faq2Question: TextField;
  Faq2Answer: RichTextField;
  Faq3Question: TextField;
  Faq3Answer: RichTextField;
  Faq4Question: TextField;
  Faq4Answer: RichTextField;
  Faq5Question: TextField;
  Faq5Answer: RichTextField;
}

const defaultFields: Fields = {
  Title: {
    value: 'Answers to frequently asked questions about ADP HCM and HR services',
  },
  Faq1Question: { value: 'What is Human Capital Management (HCM)?' },
  Faq1Answer: {
    value:
      "<p>Human Capital Management (HCM) is a comprehensive approach to managing an organisation's most valuable asset: its people. It covers everything from recruiting and onboarding to payroll, benefits, performance management and talent development.</p>",
  },
  Faq2Question: {
    value: 'What are the tasks and responsibilities of Human Capital Management?',
  },
  Faq2Answer: {
    value:
      '<p>HCM encompasses workforce planning, talent acquisition, onboarding, performance management, compensation and benefits administration, learning and development, and workforce analytics.</p>',
  },
  Faq3Question: { value: 'What is the difference between HRM and HCM?' },
  Faq3Answer: {
    value:
      '<p>While HRM (Human Resource Management) focuses primarily on the administrative aspects of managing employees, HCM takes a broader strategic approach that views employees as assets to be invested in and developed over time.</p>',
  },
  Faq4Question: {
    value: 'Why should I start with Human Capital Management?',
  },
  Faq4Answer: {
    value:
      '<p>Implementing HCM can lead to improved employee engagement, better talent retention, streamlined processes, more data-driven decision making and ultimately a more productive and profitable organisation.</p>',
  },
  Faq5Question: {
    value: 'How do I choose the right HCM software / solution?',
  },
  Faq5Answer: {
    value:
      "<p>Consider your organisation's size, industry, specific needs and growth plans. Look for a solution that offers comprehensive functionality, scalability, strong security, good user experience and proven customer support.</p>",
  },
};

export type FaqSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FaqSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: fields.Faq1Question, answer: fields.Faq1Answer },
    { question: fields.Faq2Question, answer: fields.Faq2Answer },
    { question: fields.Faq3Question, answer: fields.Faq3Answer },
    { question: fields.Faq4Question, answer: fields.Faq4Answer },
    { question: fields.Faq5Question, answer: fields.Faq5Answer },
  ].filter((faq) => faq.question?.value);

  const toggleFaq = useCallback(
    (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    },
    [openIndex]
  );

  return (
    <section className={`component faq-section bg-white py-12 lg:py-16 ${styles || ''}`} id={id}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Title (left column on desktop) */}
          <div className="lg:w-1/3">
            <h2 className="text-2xl leading-snug font-bold text-[#1A1A2E] lg:text-3xl">
              <Text field={fields.Title} />
            </h2>
          </div>

          {/* FAQ Accordion (right column on desktop) */}
          <div className="flex-1">
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between py-4 text-left"
                    aria-expanded={openIndex === i}
                  >
                    <span className="pr-4 text-sm font-medium text-[#1A1A2E] lg:text-base">
                      <Text field={faq.question} />
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-[#555] transition-transform duration-200 ${
                        openIndex === i ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === i ? 'max-h-96 pb-4' : 'max-h-0'
                    }`}
                  >
                    <div className="text-sm leading-relaxed text-[#555]">
                      <RichText field={faq.answer} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
