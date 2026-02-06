'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ArticlesCarouselSection Component
 * "Latest articles and insights" section with ArticleCard carousel
 *
 * Features:
 * - Section title
 * - Horizontal carousel of ArticleCard components (via placeholder)
 * - Desktop: Shows 3 cards side by side
 * - Mobile: Shows 1 card with swipe
 * - Dot indicators for navigation
 * - Follows the same carousel pattern as NearbyDevelopmentsSection
 */

interface Fields {
  Title: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Latest articles and insights' },
};

export type ArticlesCarouselSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ArticlesCarouselSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const sitecore = useSitecore();
  const isEditing = sitecore?.page?.mode?.isEditing ?? false;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const phArticleCards = `article-cards-${DynamicPlaceholderId}`;

  // Count slides from DOM
  useEffect(() => {
    if (!carouselRef.current) return;

    const countSlides = () => {
      const slides = carouselRef.current?.querySelectorAll(':scope > .article-card');
      const count = slides?.length || 0;
      setTotalSlides(count);
    };

    countSlides();
    const observer = new MutationObserver(countSlides);
    observer.observe(carouselRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    if (isEditing || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isEditing, totalSlides]);

  const handleGoTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      className={`component articles-carousel-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1A1A2E] lg:mb-12 lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className="articles-carousel-track flex transition-transform duration-500 ease-out"
            style={
              {
                '--slide-index': activeIndex,
              } as React.CSSProperties
            }
          >
            <Placeholder name={phArticleCards} rendering={props.rendering} />
          </div>
        </div>
        <style jsx>{`
          .articles-carousel-track {
            transform: translateX(calc(-1 * var(--slide-index) * 100%));
          }
          @media (min-width: 1024px) {
            .articles-carousel-track {
              transform: translateX(calc(-1 * var(--slide-index) * 33.333%));
            }
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
                  i === activeIndex ? 'bg-[#1A1A2E]' : 'bg-gray-300'
                }`}
                aria-label={`Go to article ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
