'use client';

import React, { type JSX, useCallback } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * TestimonialsSection Component
 * Trustpilot reviews carousel section
 * 
 * Features:
 * - Trustpilot badge and rating on left
 * - Horizontal carousel of review cards
 * - Arrow navigation
 * - Dynamic placeholder for TestimonialCard components
 */

interface Fields {
  TrustpilotRating: TextField;
  TrustpilotText: TextField;
  TrustpilotLogo: ImageField;
  ReviewsCountText: TextField;
}

export type TestimonialsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const phTestimonialCards = `testimonialCards-${DynamicPlaceholderId}`;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      className={`component testimonials-section py-8 lg:py-10 bg-white border-t border-gray-100 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
          {/* Trustpilot Badge */}
          <div className="flex-shrink-0">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {fields.TrustpilotText ? (
                <Text field={fields.TrustpilotText} />
              ) : (
                'Excellent'
              )}
            </div>
            {/* Star Rating */}
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              Based on <span className="underline">4 & 5 star reviews</span>
            </div>
            {fields.TrustpilotLogo ? (
              <SitecoreImage
                field={fields.TrustpilotLogo}
                className="h-5 w-auto"
              />
            ) : (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
                <span className="text-sm font-semibold">Trustpilot</span>
              </div>
            )}
          </div>

          {/* Reviews Carousel */}
          <div className="flex-1 relative w-full lg:w-auto overflow-hidden">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                <Placeholder name={phTestimonialCards} rendering={props.rendering} />
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white shadow border border-gray-200 text-gray-600 hover:bg-gray-50 hidden lg:flex items-center justify-center"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white shadow border border-gray-200 text-gray-600 hover:bg-gray-50 hidden lg:flex items-center justify-center"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
