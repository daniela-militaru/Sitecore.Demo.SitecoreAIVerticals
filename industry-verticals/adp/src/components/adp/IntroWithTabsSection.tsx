'use client';

import React, { type JSX, useState } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * IntroWithTabsSection Component
 * Intro heading + description paragraph, followed by a row of red pill/tab buttons
 * and benefit items below the selected tab.
 *
 * Layout:
 * - Desktop: Centered heading + paragraph, horizontal pill row, 2-column benefit items below
 * - Mobile: Stacked, pills wrap, benefit items single column
 * - Used on the HCM page for "Vereenvoudig de complexiteit van HR..."
 */

interface TabItem {
  TabLabel: TextField;
  Benefit1Icon: ImageField;
  Benefit1Title: TextField;
  Benefit1Description: RichTextField;
  Benefit2Icon: ImageField;
  Benefit2Title: TextField;
  Benefit2Description: RichTextField;
}

interface Fields {
  Title: TextField;
  Description: RichTextField;
  Tab1Label: TextField;
  Tab1Benefit1Icon: ImageField;
  Tab1Benefit1Title: TextField;
  Tab1Benefit1Description: RichTextField;
  Tab1Benefit2Icon: ImageField;
  Tab1Benefit2Title: TextField;
  Tab1Benefit2Description: RichTextField;
  Tab2Label: TextField;
  Tab2Benefit1Icon: ImageField;
  Tab2Benefit1Title: TextField;
  Tab2Benefit1Description: RichTextField;
  Tab2Benefit2Icon: ImageField;
  Tab2Benefit2Title: TextField;
  Tab2Benefit2Description: RichTextField;
  Tab3Label: TextField;
  Tab3Benefit1Icon: ImageField;
  Tab3Benefit1Title: TextField;
  Tab3Benefit1Description: RichTextField;
  Tab3Benefit2Icon: ImageField;
  Tab3Benefit2Title: TextField;
  Tab3Benefit2Description: RichTextField;
  Tab4Label: TextField;
  Tab4Benefit1Icon: ImageField;
  Tab4Benefit1Title: TextField;
  Tab4Benefit1Description: RichTextField;
  Tab4Benefit2Icon: ImageField;
  Tab4Benefit2Title: TextField;
  Tab4Benefit2Description: RichTextField;
}

const defaultFields: Fields = {
  Title: {
    value: 'Simplify the complexity of HR to unlock the potential of your business and people.',
  },
  Description: {
    value:
      '<p>Manage payroll, HR administration, time, talent and people data via a single, intuitive employee system of record. We help put your employees in a position to realise their full potential with our human capital management software.</p>',
  },
  Tab1Label: { value: 'Save money' },
  Tab1Benefit1Icon: { value: { src: '/icons/lower-costs.svg', alt: 'Lower costs' } },
  Tab1Benefit1Title: { value: 'Lower costs' },
  Tab1Benefit1Description: {
    value:
      '<p>Streamline your HCM software into a centralised payroll data source. This makes it easier to optimise budgets and manage costs.</p>',
  },
  Tab1Benefit2Icon: {
    value: { src: '/icons/service-level.svg', alt: 'Access the right service level' },
  },
  Tab1Benefit2Title: { value: 'Access the right service level' },
  Tab1Benefit2Description: {
    value:
      '<p>Our solutions provide the product or service at the right service level that is suitably priced to give you the best value.</p>',
  },
  Tab2Label: { value: 'Save time' },
  Tab2Benefit1Icon: { value: { src: '/icons/save-time.svg', alt: 'Save time' } },
  Tab2Benefit1Title: { value: 'Streamlined processes' },
  Tab2Benefit1Description: {
    value:
      '<p>Automate routine HR tasks to free up time for strategic initiatives that drive business growth.</p>',
  },
  Tab2Benefit2Icon: { value: { src: '/icons/efficiency.svg', alt: 'Efficiency' } },
  Tab2Benefit2Title: { value: 'Increased efficiency' },
  Tab2Benefit2Description: {
    value:
      '<p>Reduce manual data entry and paperwork with integrated systems that work together seamlessly.</p>',
  },
  Tab3Label: { value: 'Boost employee confidence' },
  Tab3Benefit1Icon: { value: { src: '/icons/confidence.svg', alt: 'Confidence' } },
  Tab3Benefit1Title: { value: 'Employee self-service' },
  Tab3Benefit1Description: {
    value:
      '<p>Empower employees with self-service tools to manage their own HR information and requests.</p>',
  },
  Tab3Benefit2Icon: { value: { src: '/icons/transparency.svg', alt: 'Transparency' } },
  Tab3Benefit2Title: { value: 'Greater transparency' },
  Tab3Benefit2Description: {
    value:
      '<p>Provide employees with easy access to their payroll information, benefits and time-off balances.</p>',
  },
  Tab4Label: { value: 'Increase your productivity' },
  Tab4Benefit1Icon: { value: { src: '/icons/productivity.svg', alt: 'Productivity' } },
  Tab4Benefit1Title: { value: 'Data-driven insights' },
  Tab4Benefit1Description: {
    value:
      '<p>Access real-time reports and analytics to make informed decisions about your workforce.</p>',
  },
  Tab4Benefit2Icon: { value: { src: '/icons/growth.svg', alt: 'Growth' } },
  Tab4Benefit2Title: { value: 'Scalable solutions' },
  Tab4Benefit2Description: {
    value:
      '<p>Solutions that grow with your business, from small businesses to large enterprises.</p>',
  },
};

export type IntroWithTabsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IntroWithTabsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: fields.Tab1Label,
      benefit1: {
        icon: fields.Tab1Benefit1Icon,
        title: fields.Tab1Benefit1Title,
        description: fields.Tab1Benefit1Description,
      },
      benefit2: {
        icon: fields.Tab1Benefit2Icon,
        title: fields.Tab1Benefit2Title,
        description: fields.Tab1Benefit2Description,
      },
    },
    {
      label: fields.Tab2Label,
      benefit1: {
        icon: fields.Tab2Benefit1Icon,
        title: fields.Tab2Benefit1Title,
        description: fields.Tab2Benefit1Description,
      },
      benefit2: {
        icon: fields.Tab2Benefit2Icon,
        title: fields.Tab2Benefit2Title,
        description: fields.Tab2Benefit2Description,
      },
    },
    {
      label: fields.Tab3Label,
      benefit1: {
        icon: fields.Tab3Benefit1Icon,
        title: fields.Tab3Benefit1Title,
        description: fields.Tab3Benefit1Description,
      },
      benefit2: {
        icon: fields.Tab3Benefit2Icon,
        title: fields.Tab3Benefit2Title,
        description: fields.Tab3Benefit2Description,
      },
    },
    {
      label: fields.Tab4Label,
      benefit1: {
        icon: fields.Tab4Benefit1Icon,
        title: fields.Tab4Benefit1Title,
        description: fields.Tab4Benefit1Description,
      },
      benefit2: {
        icon: fields.Tab4Benefit2Icon,
        title: fields.Tab4Benefit2Title,
        description: fields.Tab4Benefit2Description,
      },
    },
  ].filter((tab) => tab.label?.value);

  const currentTab = tabs[activeTab] || tabs[0];

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
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                i === activeTab
                  ? 'bg-[#D0271D] text-white'
                  : 'border border-[#D0271D] bg-white text-[#D0271D] hover:bg-[#D0271D] hover:text-white'
              }`}
            >
              <Text field={tab.label} />
            </button>
          ))}
        </div>

        {/* Benefit Items Below Tabs */}
        {currentTab && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Benefit 1 */}
            {currentTab.benefit1.title?.value && (
              <div className="flex flex-col items-start gap-3">
                {currentTab.benefit1.icon?.value?.src && (
                  <div className="flex h-10 w-10 items-center justify-center">
                    <SitecoreImage
                      field={currentTab.benefit1.icon}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A1A2E]">
                  <Text field={currentTab.benefit1.title} />
                </h3>
                <div className="text-sm leading-relaxed text-[#555]">
                  <RichText field={currentTab.benefit1.description} />
                </div>
              </div>
            )}

            {/* Benefit 2 */}
            {currentTab.benefit2.title?.value && (
              <div className="flex flex-col items-start gap-3">
                {currentTab.benefit2.icon?.value?.src && (
                  <div className="flex h-10 w-10 items-center justify-center">
                    <SitecoreImage
                      field={currentTab.benefit2.icon}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A1A2E]">
                  <Text field={currentTab.benefit2.title} />
                </h3>
                <div className="text-sm leading-relaxed text-[#555]">
                  <RichText field={currentTab.benefit2.description} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
