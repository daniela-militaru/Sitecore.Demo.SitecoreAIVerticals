'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

type IntroWithTabsSectionProps = ComponentProps;

/**
 * DesktopTabLabel
 * Reads the data-tab-label from the nth .tab-card inside the container.
 */
function DesktopTabLabel({
  containerRef,
  index,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const read = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll<HTMLElement>(':scope .tab-card');
      const card = cards[index];
      if (card) setLabel(card.getAttribute('data-tab-label') || `Tab ${index + 1}`);
    };
    read();
    if (!containerRef.current) return;
    const obs = new MutationObserver(read);
    obs.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tab-label'],
    });
    return () => obs.disconnect();
  }, [containerRef, index]);

  return <>{label}</>;
}

export const Default = (props: IntroWithTabsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;

  const phHeading = `titleAndDescriptions-${DynamicPlaceholderId}`;
  const phTabs = `tabs-${DynamicPlaceholderId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardCount, setCardCount] = useState(0);

  const syncCards = useCallback(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>(':scope .tab-card');
    setCardCount(cards.length);
    cards.forEach((card, i) => {
      const isActive = i === activeIndex;
      card.setAttribute('data-tab-active', String(isActive));
      const trigger = card.querySelector<HTMLElement>('.tab-card-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', String(isActive));
      const chevron = card.querySelector<HTMLElement>('.tab-card-chevron');
      if (chevron) chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
      const content = card.querySelector<HTMLElement>('.tab-card-content');
      if (content) {
        if (isActive) {
          content.style.maxHeight = `${content.scrollHeight + 200}px`;
          content.style.opacity = '1';
        } else {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
        }
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    syncCards();
    const observer = new MutationObserver(syncCards);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [syncCards]);

  useEffect(() => {
    syncCards();
  }, [activeIndex, syncCards]);

  const handleTriggerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const trigger = (e.target as HTMLElement).closest('.tab-card-trigger');
    if (!trigger) return;
    const card = trigger.closest('.tab-card');
    if (!card || !containerRef.current) return;
    const cards = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(':scope .tab-card')
    );
    const clickedIndex = cards.indexOf(card as HTMLElement);
    if (clickedIndex === -1) return;
    setActiveIndex((prev) => (prev === clickedIndex ? -1 : clickedIndex));
  }, []);

  return (
    <section className={`component intro-with-tabs-section py-12 lg:py-16 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4">
        {/* Heading placeholder (TitleAndDescriptionCard) */}
        <Placeholder name={phHeading} rendering={props.rendering} />

        {/* ===== DESKTOP: Tab bar overlapping the content panel top border ===== */}
        <div className="intro-tabs-desktop-bar hidden justify-center md:flex">
          <nav
            className="relative z-10 mb-[-28px] inline-flex items-center rounded-lg bg-[#D0271D] p-2.5"
            role="tablist"
            aria-label="Tabs"
          >
            {Array.from({ length: cardCount }).map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(i)}
                  className="inline-flex items-center justify-center whitespace-nowrap"
                >
                  <span
                    className={`inline-block rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-white text-[#D0271D]'
                        : 'text-white hover:rounded-md hover:bg-[#b8221a]'
                    }`}
                  >
                    <DesktopTabLabel containerRef={containerRef} index={i} />
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===== SINGLE shared content container for both desktop and mobile ===== */}
        <div
          ref={containerRef}
          className="intro-tabs-cards"
          onClick={handleTriggerClick}
          onKeyDown={undefined}
        >
          <Placeholder name={phTabs} rendering={props.rendering} />
        </div>
      </div>

      {/* ===== Scoped styles ===== */}
      <style jsx>{`
        /* ---- DESKTOP ---- */
        @media (min-width: 768px) {
          .intro-tabs-cards {
            border: 1px solid #d0d0d0;
            border-radius: 0.375rem;
            padding: 2rem 2.5rem;
            padding-top: 3.5rem;
          }
          /* Hide mobile accordion triggers on desktop */
          .intro-tabs-cards :global(.tab-card .tab-card-trigger) {
            display: none;
          }
          .intro-tabs-cards :global(.tab-card .tab-card-content) {
            overflow: hidden;
            transition:
              max-height 0.35s ease,
              opacity 0.25s ease;
          }
        }

        /* ---- MOBILE ---- */
        @media (max-width: 767px) {
          /* Each tab card is an accordion item */
          :global(.tab-card) {
            border-radius: 0.375rem;
            margin-bottom: 0.75rem;
            overflow: hidden;
            background: #d0271d;
            border: 2px solid #d0271d;
          }
          :global(.tab-card .tab-card-trigger) {
            display: flex;
            padding: 1rem 1.25rem;
            font-size: 1.0625rem;
            font-weight: 600;
            color: white;
            background: #d0271d;
            cursor: pointer;
            border: none;
            text-align: left;
            border-radius: 0.375rem;
          }
          :global(.tab-card .tab-card-chevron) {
            color: white;
          }

          /* Active/expanded: no border on the card itself; only the trigger gets the red-bordered pill */
          :global(.tab-card[data-tab-active='true']) {
            background: transparent;
            border: none;
            padding: 0;
          }
          :global(.tab-card[data-tab-active='true'] .tab-card-trigger) {
            color: #d0271d;
            background: white;
            border: 3px solid #d0271d;
            border-radius: 0.375rem;
            padding: calc(1rem - 3px) calc(1.25rem - 3px);
            margin-bottom: 1rem;
          }
          :global(.tab-card[data-tab-active='true'] .tab-card-chevron) {
            color: #d0271d;
          }
          :global(.tab-card[data-tab-active='true'] .tab-card-content) {
            background: transparent;
          }

          :global(.tab-card .tab-card-content) {
            overflow: hidden;
            transition:
              max-height 0.35s ease,
              opacity 0.25s ease;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          :global(.tab-card[data-tab-active='true'] .tab-card-content) {
            padding-bottom: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};
