'use client';

import type { JSX } from 'react';
import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageCarouselSection Component
 * Carousel section for "Explore [Development Name]" image galleries
 * Uses Embla Carousel for smooth navigation
 * 
 * Features:
 * - Title and description
 * - Image carousel with navigation arrows
 * - Dot indicators
 * - Dynamic placeholder for ImageCard components
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
}

export type ImageCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ImageCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const phImages = `carouselImages-${DynamicPlaceholderId}`;

  return (
    <div
      className={`component image-carousel-section bg-white py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-center mb-4">
          <span className="text-[#003057]">Explore </span>
          <span className="text-[#0072CE]">
            {fields.Title ? <Text field={fields.Title} /> : 'Bramcote Hills Rise'}
          </span>
        </h2>

        {/* Description */}
        {fields.Description && (
          <div className="text-center text-[#4a4a4a] max-w-2xl mx-auto mb-8">
            <RichText field={fields.Description} />
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-[#003057]" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-[#003057]" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              <Placeholder name={phImages} rendering={props.rendering} />
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === 0 ? 'bg-[#0072CE]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
