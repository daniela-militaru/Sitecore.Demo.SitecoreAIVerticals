'use client';

import React, { type JSX, useState, useEffect, useRef } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TrustedLogosSection Component
 * "Trusted payroll and HR Services for over a million companies worldwide"
 *
 * Logo items are dropped via <Placeholder> as TrustedLogoCard components.
 * The section discovers `.trusted-logo-card` children via MutationObserver,
 * shows them in a row on desktop and a carousel on mobile.
 *
 * Layout:
 * - Desktop: Title + row of logos side by side
 * - Mobile: Title + single-slide carousel with dot indicators + autoplay
 */

interface Fields {
  Title: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Trusted payroll and HR Services for over a million companies worldwide' },
};

export type TrustedLogosSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TrustedLogosSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phLogos = `trustedLogos-${DynamicPlaceholderId}`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [totalLogos, setTotalLogos] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Discover .trusted-logo-card children via MutationObserver
  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const countCards = () => {
      const cards = container.querySelectorAll('.trusted-logo-card');
      setTotalLogos(cards.length);
    };

    countCards();
    const observer = new MutationObserver(countCards);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Autoplay for mobile carousel
  useEffect(() => {
    if (totalLogos <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalLogos);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalLogos]);

  return (
    <section
      className={`component trusted-logos-section bg-white py-10 lg:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-lg font-bold text-[#1A1A2E] lg:text-xl">
          <Text field={fields.Title} />
        </h2>

        {/* Desktop: Row of logos side by side */}
        <div className="hidden lg:block">
          <div ref={trackRef} className="flex items-center justify-center gap-10 lg:gap-16">
            <Placeholder name={phLogos} rendering={props.rendering} />
          </div>
        </div>

        {/* Mobile: Single-slide carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden">
            <div
              className="trusted-logos-mobile-track flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              <Placeholder name={phLogos} rendering={props.rendering} />
            </div>
          </div>

          {/* Dot Indicators */}
          {totalLogos > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: totalLogos }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === activeIndex ? 'bg-[#D0271D]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to logo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scoped styles for responsive logo display */}
      <style jsx>{`
        /* Desktop: logos sit inline in the flex row */
        @media (min-width: 1024px) {
          .trusted-logos-section :global(.trusted-logo-card) {
            width: auto;
            flex-shrink: 0;
          }
        }
        /* Mobile: each logo is a full-width slide */
        @media (max-width: 1023px) {
          .trusted-logos-mobile-track :global(.trusted-logo-card) {
            width: 100%;
            flex-shrink: 0;
          }
        }
      `}</style>
    </section>
  );
};
