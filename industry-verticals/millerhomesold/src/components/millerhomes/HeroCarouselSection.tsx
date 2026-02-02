'use client';

import React, { type JSX, useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HeroCarouselSection Component
 * Full-width hero carousel with background image, overlay text, and navigation arrows
 * 
 * Features:
 * - Auto-play carousel with Embla
 * - Left/Right arrow navigation
 * - Text overlay with title, description, and CTA
 * - Responsive text sizing
 */

interface HeroSlide {
  fields: {
    BackgroundImage: ImageField;
    Title: TextField;
    Description: TextField;
    CTAText: TextField;
    CTALink: LinkField;
  };
}

interface Fields {
  Slides: HeroSlide[];
  AutoplayInterval: { value: number };
}

export type HeroCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HeroCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Update selected index
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const interval = fields.AutoplayInterval?.value || 5000;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, interval);

    return () => clearInterval(timer);
  }, [emblaApi, fields.AutoplayInterval?.value]);

  // Fallback slides for demo
  const slides = fields.Slides?.length > 0 ? fields.Slides : [
    {
      fields: {
        BackgroundImage: { value: { src: '', alt: 'Hero' } },
        Title: { value: 'Be the first to know when we release new homes for sale' },
        Description: { value: 'We have a dedicated email alert and promotion service just for you. Sign up today to receive exclusive offers and more.' },
        CTAText: { value: 'Learn more' },
        CTALink: { value: { href: '#' } },
      },
    },
  ];

  return (
    <section
      className={`component hero-carousel-section relative ${styles || ''}`}
      id={id}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0"
            >
              {/* Background Image */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[550px] bg-[#003057]">
                {slide.fields.BackgroundImage?.value?.src ? (
                  <SitecoreImage
                    field={slide.fields.BackgroundImage}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-r from-[#003057] to-[#004070]" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-xl text-white">
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4">
                        <Text field={slide.fields.Title} />
                      </h1>
                      {slide.fields.Description?.value && (
                        <p className="text-sm md:text-base text-white/90 mb-6 max-w-md">
                          <Text field={slide.fields.Description} />
                        </p>
                      )}
                      {slide.fields.CTALink && (
                        <SitecoreLink
                          field={slide.fields.CTALink}
                          className="inline-block bg-[#003057] hover:bg-[#002040] text-white font-medium py-3 px-6 rounded transition-colors text-sm"
                        >
                          <Text field={slide.fields.CTAText} />
                        </SitecoreLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#003057] flex items-center justify-center transition-colors shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#003057] flex items-center justify-center transition-colors shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </section>
  );
};
