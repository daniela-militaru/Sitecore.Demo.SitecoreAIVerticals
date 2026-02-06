'use client';

import React, { type JSX, useState, useEffect } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TrustedLogosSection Component
 * "Trusted payroll and HR Services for over a million companies worldwide"
 * Displays client logos in a carousel/row
 *
 * Layout:
 * - Desktop: Title + row of logos side by side
 * - Mobile: Title + carousel of logos with dot indicators
 * - Light/white background
 */

interface Fields {
  Title: TextField;
  Logo1: ImageField;
  Logo2: ImageField;
  Logo3: ImageField;
  Logo4: ImageField;
  Logo5: ImageField;
  Logo6: ImageField;
}

const defaultFields: Fields = {
  Title: { value: 'Trusted payroll and HR Services for over a million companies worldwide' },
  Logo1: { value: { src: '/logos/fujifilm.svg', alt: 'Fujifilm' } },
  Logo2: { value: { src: '/logos/paypal.svg', alt: 'PayPal' } },
  Logo3: { value: { src: '/logos/innocent.svg', alt: 'Innocent' } },
  Logo4: { value: { src: '/logos/cocacola.svg', alt: 'Coca-Cola' } },
  Logo5: { value: { src: '/logos/amazon.svg', alt: 'Amazon' } },
  Logo6: { value: { src: '/logos/bs.svg', alt: 'B&S' } },
};

export type TrustedLogosSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TrustedLogosSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const logos = [
    fields.Logo1,
    fields.Logo2,
    fields.Logo3,
    fields.Logo4,
    fields.Logo5,
    fields.Logo6,
  ].filter((logo) => logo?.value?.src);

  const [activeIndex, setActiveIndex] = useState(0);
  const totalLogos = logos.length;

  // Autoplay for mobile carousel
  useEffect(() => {
    if (totalLogos <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalLogos);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalLogos]);

  const phLogos = `trusted-logos-${DynamicPlaceholderId}`;

  return (
    <section
      className={`component trusted-logos-section bg-white py-10 lg:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-lg font-bold text-[#1A1A2E] lg:text-xl">
          <Text field={fields.Title} />
        </h2>

        {/* Desktop: Row of logos */}
        <div className="hidden items-center justify-center gap-10 lg:flex lg:gap-16">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center justify-center">
              <SitecoreImage
                field={logo}
                className="h-8 max-w-35 object-contain grayscale lg:h-10"
              />
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="lg:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {logos.map((logo, i) => (
                <div key={i} className="flex w-full shrink-0 items-center justify-center py-4">
                  <SitecoreImage field={logo} className="h-10 max-w-40 object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          {totalLogos > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {logos.map((_, i) => (
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

        {/* Placeholder for additional logos */}
        <div className="trusted-logos-extra hidden">
          <Placeholder name={phLogos} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
