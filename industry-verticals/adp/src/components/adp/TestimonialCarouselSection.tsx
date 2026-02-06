'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialCarouselSection Component
 * "MEET OUR CLIENTS" section with client testimonial quote carousel
 *
 * Layout:
 * - Dark navy background (#1A1A2E)
 * - "MEET OUR CLIENTS" label
 * - Carousel of TestimonialCard components (via placeholder)
 * - Dot indicators
 * - CTA buttons via a second placeholder (CtaLinkCard components)
 *
 * Placeholders:
 * - testimonialCards-{DynamicPlaceholderId}: drop TestimonialCard components here
 * - testimonialCtas-{DynamicPlaceholderId}: drop CtaLinkCard components here
 *
 * Uses the same MutationObserver + translateX + --slide-index carousel
 * pattern as NearbyDevelopmentsSection.
 */

interface Fields {
  /** Section label shown above the carousel, e.g. "MEET OUR CLIENTS" */
  Label: TextField;
}

const defaultFields: Fields = {
  Label: { value: 'MEET OUR CLIENTS' },
};

export type TestimonialCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const phTestimonialCards = `testimonialCards-${DynamicPlaceholderId}`;
  const phTestimonialCtas = `testimonialCtas-${DynamicPlaceholderId}`;

  // Count slides from DOM via MutationObserver (same pattern as NearbyDevelopmentsSection)
  useEffect(() => {
    if (!carouselRef.current) return;

    const countSlides = () => {
      const slides = carouselRef.current?.querySelectorAll(':scope > .testimonial-card');
      const count = slides?.length || 0;
      setTotalSlides(count);
    };

    countSlides();
    const observer = new MutationObserver(countSlides);
    observer.observe(carouselRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Autoplay (disabled in editing mode)
  useEffect(() => {
    if (isEditing || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [isEditing, totalSlides]);

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
            ref={carouselRef}
            className="testimonial-carousel-track flex transition-transform duration-500 ease-out"
            style={
              {
                '--slide-index': activeIndex,
              } as React.CSSProperties
            }
          >
            <Placeholder name={phTestimonialCards} rendering={props.rendering} />
          </div>
        </div>
        <style jsx>{`
          .testimonial-carousel-track {
            transform: translateX(calc(-1 * var(--slide-index) * 100%));
          }
        `}</style>

        {/* Dot Indicators */}
        {totalSlides > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
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

        {/* CTA Buttons (via placeholder) */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Placeholder name={phTestimonialCtas} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
