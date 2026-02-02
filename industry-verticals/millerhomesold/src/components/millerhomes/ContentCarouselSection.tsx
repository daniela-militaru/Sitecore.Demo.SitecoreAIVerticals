'use client';

import React, { type JSX, useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ContentCarouselSection Component
 * "Your place to be" carousel section with content cards
 * 
 * Features:
 * - Section title with styled "place" word in light blue
 * - Horizontal carousel with Embla
 * - Left/Right arrow navigation
 * - Dot indicators
 * - Dynamic placeholder for ContentCard components
 */

interface Fields {
  /** Title with special styling - first part normal, "place" in blue */
  TitlePart1: TextField;
  TitleHighlight: TextField;
  TitlePart2: TextField;
}

export type ContentCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContentCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const phCarouselCards = `carouselCards-${DynamicPlaceholderId}`;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', () => setScrollSnaps(emblaApi.scrollSnapList()));
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      className={`component content-carousel-section py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-light text-[#003057] mb-8 lg:mb-12">
          {fields.TitlePart1 ? (
            <>
              <Text field={fields.TitlePart1} />{' '}
              <span className="text-[#0072CE]">
                <Text field={fields.TitleHighlight} />
              </span>{' '}
              <Text field={fields.TitlePart2} />
            </>
          ) : (
            <>
              Your <span className="text-[#0072CE]">place</span> to be
            </>
          )}
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 text-[#003057] items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 text-[#003057] items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 lg:gap-6">
              {/* Dynamic Placeholder for ContentCard components */}
              <Placeholder name={phCarouselCards} rendering={props.rendering} />
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        {scrollSnaps.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-[#003057]' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
