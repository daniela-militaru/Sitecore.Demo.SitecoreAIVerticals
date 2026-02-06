'use client';

import React, { type JSX, useState, useEffect, useRef, useCallback } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * IntroWithTabsSection Component
 * Intro heading + description paragraph, followed by a row of red pill/tab buttons
 * and benefit content below the selected tab.
 *
 * TabCard children are dropped into the `introTabs-{DynamicPlaceholderId}` placeholder.
 * The section uses a MutationObserver to detect `.tab-card` elements, reads their
 * `data-tab-label` attribute to build the pill buttons, and toggles `data-tab-active`
 * + visibility on each card when a pill is clicked.
 *
 * Layout:
 * - Desktop: Centered heading + paragraph, horizontal pill row, 2-column benefit items below
 * - Mobile: Stacked, pills wrap, benefit items single column
 */

interface Fields {
  Title: TextField;
  Description: RichTextField;
}

const defaultFields: Fields = {
  Title: {
    value: 'Simplify the complexity of HR to unlock the potential of your business and people.',
  },
  Description: {
    value:
      '<p>Manage payroll, HR administration, time, talent and people data via a single, intuitive employee system of record. We help put your employees in a position to realise their full potential with our human capital management software.</p>',
  },
};

export type IntroWithTabsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IntroWithTabsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [tabLabels, setTabLabels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  /** Scan .tab-card children for their labels and update state */
  const syncTabs = useCallback(() => {
    if (!tabContainerRef.current) return;
    const cards = tabContainerRef.current.querySelectorAll('.tab-card');
    const labels: string[] = [];
    cards.forEach((card) => {
      labels.push((card as HTMLElement).dataset.tabLabel || '');
    });
    setTabLabels(labels);
  }, []);

  /** Toggle visibility of the active tab card */
  useEffect(() => {
    if (!tabContainerRef.current) return;
    const cards = tabContainerRef.current.querySelectorAll('.tab-card');
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      if (i === activeTab) {
        el.dataset.tabActive = 'true';
        el.classList.remove('hidden');
      } else {
        el.dataset.tabActive = 'false';
        el.classList.add('hidden');
      }
    });
  }, [activeTab, tabLabels]);

  /** MutationObserver to detect when tab cards are added/removed from the placeholder */
  useEffect(() => {
    syncTabs();
    if (!tabContainerRef.current) return;
    const observer = new MutationObserver(() => syncTabs());
    observer.observe(tabContainerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [syncTabs]);

  return (
    <section
      className={`component intro-with-tabs-section bg-white py-12 lg:py-16 ${styles || ''}`}
      id={id}
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <h2 className="mb-4 text-center text-2xl leading-snug font-bold text-[#1A1A2E] lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        {/* Description */}
        <div className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-[#555] lg:text-base">
          <RichText field={fields.Description} />
        </div>

        {/* Tab Pill Buttons */}
        {tabLabels.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {tabLabels.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  i === activeTab
                    ? 'bg-[#D0271D] text-white'
                    : 'border border-[#D0271D] bg-transparent text-[#D0271D] hover:bg-[#D0271D] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Card Placeholder */}
        <div ref={tabContainerRef}>
          <Placeholder name={`introTabs-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
