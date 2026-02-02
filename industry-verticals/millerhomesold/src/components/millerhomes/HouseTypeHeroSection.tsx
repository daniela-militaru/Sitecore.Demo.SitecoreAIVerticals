'use client';

import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  TextField,
  ImageField,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

/**
 * HouseTypeHeroSection Component
 * Hero image gallery for house type detail pages (Hampton style)
 * Uses Embla Carousel for smooth image navigation
 * 
 * Features:
 * - Large main image with navigation arrows
 * - View Tour / View Plan overlay buttons
 * - Thumbnail strip below
 */

interface Fields {
  /** Main hero image (fallback if no placeholder images) */
  MainImage: ImageField;
  /** Virtual tour URL */
  VirtualTourUrl: TextField;
}

export type HouseTypeHeroSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: HouseTypeHeroSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const { fields } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [thumbsRef] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);

  const phGalleryImages = `galleryImages-${DynamicPlaceholderId}`;

  // Placeholder thumbnails for demo
  const thumbnails = [1, 2, 3, 4, 5, 6];

  return (
    <div
      className={`component house-type-hero-section bg-[#f5f5f5] ${styles || ''}`}
      id={id}
    >
      {/* Main Image Area */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {fields.MainImage ? (
              <div className="flex-[0_0_100%] min-w-0 relative aspect-4/3 md:aspect-[16/9] lg:aspect-[2/1]">
                <SitecoreImage
                  field={fields.MainImage}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-[0_0_100%] min-w-0 relative aspect-4/3 md:aspect-[16/9] lg:aspect-[2/1] bg-gray-300">
                <Placeholder name={phGalleryImages} rendering={props.rendering} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#003057] hover:bg-[#002040] rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#003057] hover:bg-[#002040] rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* View Tour / View Plan Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <button className="flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors shadow-lg">
            <Play className="w-4 h-4" />
            View Tour
          </button>
          <button className="flex items-center gap-2 bg-[#0072CE] hover:bg-[#005ba3] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors shadow-lg">
            <Play className="w-4 h-4" />
            View Plan
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden" ref={thumbsRef}>
            <div className="flex gap-2 justify-center">
              {thumbnails.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    emblaApi?.scrollTo(index);
                    setSelectedIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded overflow-hidden border-2 transition-colors ${
                    selectedIndex === index 
                      ? 'border-[#0072CE]' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-gray-200" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
