'use client';

import React, { type JSX, useState, useEffect, useCallback } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  LinkField,
  Link as SitecoreLink,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialCarouselSection Component
 * "MEET OUR CLIENTS" section with client testimonial quote carousel
 *
 * Layout:
 * - Dark navy background (#1A1A2E)
 * - "MEET OUR CLIENTS" label
 * - Large quote text (centered)
 * - Client name + title
 * - Dot indicators
 * - Two CTA buttons below (e.g. "Talk to an Expert", "Request a demo")
 *
 * Uses placeholder for testimonial data, but can also have direct fields
 * for a simpler single-quote version
 */

interface Fields {
  Label: TextField;
  Quote1: RichTextField;
  Quote1Author: TextField;
  Quote2: RichTextField;
  Quote2Author: TextField;
  Quote3: RichTextField;
  Quote3Author: TextField;
  CTA1Text: TextField;
  CTA1Link: LinkField;
  CTA2Text: TextField;
  CTA2Link: LinkField;
}

const defaultFields: Fields = {
  Label: { value: 'MEET OUR CLIENTS' },
  Quote1: {
    value:
      '<p>"99.9% of our employees are now paid on ADP, and our payroll problems are at an all-time low ... Our recent employee survey saw significant improvement."</p>',
  },
  Quote1Author: { value: 'Traci Memmott Global Head of Payroll, PayPal' },
  Quote2: {
    value:
      '<p>"ADP is a great partner and we are impressed by the transformation of ADP\'s iHCM Payroll. We are confident that our processes continue to improve."</p>',
  },
  Quote2Author: { value: 'Tom Morrison, Global Head of Payroll, Amazon' },
  Quote3: {
    value:
      '<p>"Our ADP team is knowledgeable and there to advise us and answer our questions. That, combined with ADP\'s robust and adaptable global technology, gives us confidence our employees are taken care of."</p>',
  },
  Quote3Author: { value: 'Greg Harmer, Global Head of Payroll, Amazon' },
  CTA1Text: { value: 'Talk to an Expert' },
  CTA1Link: { value: { href: '/contact' } },
  CTA2Text: { value: 'Request a demo' },
  CTA2Link: { value: { href: '/demo' } },
};

export type TestimonialCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  // Build quotes array from fields
  const quotes = [
    { text: fields.Quote1, author: fields.Quote1Author },
    { text: fields.Quote2, author: fields.Quote2Author },
    { text: fields.Quote3, author: fields.Quote3Author },
  ].filter((q) => q.text?.value);

  const [activeIndex, setActiveIndex] = useState(0);
  const totalQuotes = quotes.length;

  // Autoplay
  useEffect(() => {
    if (isEditing || totalQuotes <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalQuotes);
    }, 6000);
    return () => clearInterval(interval);
  }, [isEditing, totalQuotes]);

  const handleGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      className={`component testimonial-carousel-section bg-[#1A1A2E] py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Label */}
        <p className="mb-6 text-xs font-bold tracking-widest text-white/70 uppercase">
          <Text field={fields.Label} />
        </p>

        {/* Quote Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {quotes.map((quote, i) => (
              <div key={i} className="w-full shrink-0 px-4">
                <div className="mb-6 text-lg leading-relaxed text-white lg:text-2xl lg:leading-relaxed">
                  <RichText field={quote.text} />
                </div>
                <p className="text-sm text-white/70">
                  <Text field={quote.author} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {totalQuotes > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => handleGoTo(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === activeIndex ? 'bg-white' : 'bg-white/30'
                }`}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {fields.CTA1Link?.value?.href && (
            <SitecoreLink
              field={fields.CTA1Link}
              className="inline-flex min-w-45 items-center justify-center rounded bg-[#D0271D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b8221a]"
            >
              <Text field={fields.CTA1Text} />
            </SitecoreLink>
          )}
          {fields.CTA2Link?.value?.href && (
            <SitecoreLink
              field={fields.CTA2Link}
              className="inline-flex min-w-45 items-center justify-center rounded border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1A1A2E]"
            >
              <Text field={fields.CTA2Text} />
            </SitecoreLink>
          )}
        </div>
      </div>
    </section>
  );
};
