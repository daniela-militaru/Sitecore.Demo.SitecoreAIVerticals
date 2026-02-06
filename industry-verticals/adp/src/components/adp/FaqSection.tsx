'use client';

import React, { type JSX, useEffect, useRef, useCallback } from 'react';
import {
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * FaqSection Component
 * "Antwoorden op veelgestelde vragen" / FAQ accordion section
 *
 * FAQ items are dropped via <Placeholder> as FaqCard components.
 * The section discovers `.faq-card` children via MutationObserver
 * and manages the accordion expand/collapse logic by toggling
 * `data-faq-open` on each card and controlling max-height via JS.
 *
 * Layout:
 * - Desktop: Title on the left, accordion items on the right (2-column)
 * - Mobile: Title on top, accordion items stacked below
 */

interface Fields {
  Title: TextField;
}

const defaultFields: Fields = {
  Title: {
    value: 'Answers to frequently asked questions about ADP HCM and HR services',
  },
};

export type FaqSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FaqSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phFaqs = `faqCards-${DynamicPlaceholderId}`;
  const containerRef = useRef<HTMLDivElement>(null);

  // Wire up accordion toggle logic on discovered .faq-card children
  const wireAccordion = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.faq-card');

    cards.forEach((card) => {
      const toggle = card.querySelector<HTMLButtonElement>('.faq-card-toggle');
      const chevron = card.querySelector<SVGElement>('.faq-card-chevron');
      const answer = card.querySelector<HTMLElement>('.faq-card-answer');

      if (!toggle || !answer) return;

      // Avoid double-binding by checking a data attribute
      if (toggle.dataset.bound === 'true') return;
      toggle.dataset.bound = 'true';

      toggle.addEventListener('click', () => {
        const isOpen = card.dataset.faqOpen === 'true';

        // Close all other cards first (single-open accordion)
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.dataset.faqOpen = 'false';
            const otherToggle = otherCard.querySelector<HTMLButtonElement>('.faq-card-toggle');
            const otherChevron = otherCard.querySelector<SVGElement>('.faq-card-chevron');
            const otherAnswer = otherCard.querySelector<HTMLElement>('.faq-card-answer');
            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            if (otherChevron) otherChevron.classList.remove('rotate-180');
            if (otherAnswer) otherAnswer.style.maxHeight = '0px';
          }
        });

        // Toggle current card
        if (isOpen) {
          card.dataset.faqOpen = 'false';
          toggle.setAttribute('aria-expanded', 'false');
          if (chevron) chevron.classList.remove('rotate-180');
          answer.style.maxHeight = '0px';
        } else {
          card.dataset.faqOpen = 'true';
          toggle.setAttribute('aria-expanded', 'true');
          if (chevron) chevron.classList.add('rotate-180');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    wireAccordion();
    const observer = new MutationObserver(wireAccordion);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [wireAccordion]);

  return (
    <section
      className={`component faq-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Title (left column on desktop) */}
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold leading-snug text-[#1A1A2E] lg:text-3xl">
              <Text field={fields.Title} />
            </h2>
          </div>

          {/* FAQ Accordion (right column on desktop) */}
          <div className="flex-1">
            <div
              ref={containerRef}
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              <Placeholder name={phFaqs} rendering={props.rendering} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
