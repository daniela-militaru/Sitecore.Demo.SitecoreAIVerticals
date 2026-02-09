'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TrustedLogosSection Component
 *
 * Infinite carousel that scrolls one logo at a time.
 * Responsive visible count:
 * - Mobile (<640px): 2
 * - Tablet (640-1023px): 3
 * - Desktop (1024-1279px): 4
 * - XL (>=1280px): 5
 *
 * For seamless infinite scrolling, the first `perView` logo cards are
 * cloned and appended at the end. When the index passes the last real
 * logo, we snap back to 0 instantly (no transition).
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

function getPerView(): number {
  if (typeof window === 'undefined') return 5;
  const w = window.innerWidth;
  if (w < 640) return 2;
  if (w < 1024) return 3;
  if (w < 1280) return 4;
  return 5;
}

export const Default = (props: TrustedLogosSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phLogos = `trustedLogos-${DynamicPlaceholderId}`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [realCount, setRealCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [perView, setPerView] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Responsive perView
  useEffect(() => {
    const update = () => setPerView(getPerView());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Discover real logo cards & create clones for infinite loop
  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const setup = () => {
      // Remove any previously added clones
      container.querySelectorAll('[data-clone="true"]').forEach((el) => el.remove());

      const cards = Array.from(
        container.querySelectorAll('.trusted-logo-card:not([data-clone="true"])')
      );
      setRealCount(cards.length);

      if (cards.length === 0) return;

      // Clone the first `perView` cards and append to end
      const cloneCount = Math.min(perView, cards.length);
      for (let i = 0; i < cloneCount; i++) {
        const clone = cards[i].cloneNode(true) as HTMLElement;
        clone.setAttribute('data-clone', 'true');
        container.appendChild(clone);
      }
    };

    setup();
    const observer = new MutationObserver(() => {
      // Only re-run if non-clone children changed
      const currentReal = container.querySelectorAll(
        '.trusted-logo-card:not([data-clone="true"])'
      ).length;
      if (currentReal !== realCount) setup();
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [perView, realCount]);

  // When we reach the clone zone, snap back to real index 0
  useEffect(() => {
    if (activeIndex >= realCount && realCount > 0) {
      // We're now showing the cloned first logos -- after transition ends, snap to 0
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
        // Re-enable transition on the next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 500); // matches CSS transition duration
      return () => clearTimeout(timeout);
    }
    return () => clearTimeout (0); //avoid React warning about missing cleanup when activeIndex < realCount
  }, [activeIndex, realCount]);

  // Autoplay: advance one logo every 3 seconds
  const advance = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (realCount <= perView) {
      return;
    }
    autoplayRef.current = setInterval(advance, 3000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [realCount, perView, advance]);

  // Calculate transform
  const stepPercent = realCount > 0 ? 100 / perView : 0;
  const translateX = activeIndex * stepPercent;

  // Navigation
  const goNext = () => {
    setActiveIndex((prev) => prev + 1);
    // Reset autoplay timer
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(advance, 3000);
  };

  const goPrev = () => {
    setActiveIndex((prev) => {
      if (prev === 0) return realCount > 0 ? realCount - 1 : 0;
      return prev - 1;
    });
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(advance, 3000);
  };

  const showArrows = realCount > perView;

  return (
    <section
      className={`component trusted-logos-section bg-white py-10 lg:py-14 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-lg font-bold text-[#1A1A2E] lg:text-xl">
          <Text field={fields.Title} />
        </h2>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Prev arrow */}
          {showArrows && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 -left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1A1A2E] shadow-md transition-colors hover:bg-gray-100"
              aria-label="Previous logo"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Track */}
          <div className="overflow-hidden px-4">
            <div
              ref={trackRef}
              className="trusted-logos-track flex"
              style={{
                transform: `translateX(-${translateX}%)`,
                transition: isTransitioning ? 'transform 500ms ease-out' : 'none',
              }}
            >
              <Placeholder name={phLogos} rendering={props.rendering} />
            </div>
          </div>

          {/* Next arrow */}
          {showArrows && (
            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 -right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1A1A2E] shadow-md transition-colors hover:bg-gray-100"
              aria-label="Next logo"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {realCount > perView && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: realCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  if (autoplayRef.current) clearInterval(autoplayRef.current);
                  autoplayRef.current = setInterval(advance, 3000);
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeIndex % realCount === i ? 'scale-125 bg-[#D0271D]' : 'bg-gray-300'
                }`}
                aria-label={`Go to logo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size each logo card to fill 1/perView of the track */}
      <style jsx>{`
        .trusted-logos-track :global(.trusted-logo-card) {
          width: calc(100% / ${perView});
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};
