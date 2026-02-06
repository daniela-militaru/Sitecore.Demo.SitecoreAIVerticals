'use client';

import React, { type JSX } from 'react';
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
 * TabCard Component
 * A droppable card representing one tab inside IntroWithTabsSection.
 *
 * Each TabCard provides:
 * - A TabLabel (used by the parent section to render the pill button)
 * - Two benefit items (icon + title + description) shown when this tab is active
 *
 * The parent IntroWithTabsSection uses a MutationObserver to detect .tab-card
 * children, reads their data-tab-label for the pill buttons, and toggles
 * a data-tab-active attribute to control visibility.
 *
 * Layout:
 * - When active: 2-column grid of benefit items on desktop, single column on mobile
 * - When inactive: hidden via CSS
 */

interface Fields {
  TabLabel: TextField;
  Benefit1Icon: ImageField;
  Benefit1Title: TextField;
  Benefit1Description: RichTextField;
  Benefit2Icon: ImageField;
  Benefit2Title: TextField;
  Benefit2Description: RichTextField;
}

const defaultFields: Fields = {
  TabLabel: { value: 'Save money' },
  Benefit1Icon: { value: { src: '/icons/lower-costs.svg', alt: 'Lower costs' } },
  Benefit1Title: { value: 'Lower costs' },
  Benefit1Description: {
    value:
      '<p>Streamline your HCM software into a centralised payroll data source. This makes it easier to optimise budgets and manage costs.</p>',
  },
  Benefit2Icon: {
    value: { src: '/icons/service-level.svg', alt: 'Access the right service level' },
  },
  Benefit2Title: { value: 'Access the right service level' },
  Benefit2Description: {
    value:
      '<p>Our solutions provide the product or service at the right service level that is suitably priced to give you the best value.</p>',
  },
};

export type TabCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TabCardProps): JSX.Element => {
  const fields = props.fields || defaultFields;

  return (
    <div
      className="tab-card hidden"
      data-tab-label={fields.TabLabel?.value || ''}
      data-tab-active="false"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {/* Benefit 1 */}
        {fields.Benefit1Title?.value && (
          <div className="flex flex-col items-start gap-3">
            {fields.Benefit1Icon?.value?.src && (
              <div className="flex h-10 w-10 items-center justify-center">
                <SitecoreImage field={fields.Benefit1Icon} className="h-8 w-8 object-contain" />
              </div>
            )}
            <h3 className="text-lg font-bold text-[#1A1A2E]">
              <Text field={fields.Benefit1Title} />
            </h3>
            <div className="text-sm leading-relaxed text-[#555]">
              <RichText field={fields.Benefit1Description} />
            </div>
          </div>
        )}

        {/* Benefit 2 */}
        {fields.Benefit2Title?.value && (
          <div className="flex flex-col items-start gap-3">
            {fields.Benefit2Icon?.value?.src && (
              <div className="flex h-10 w-10 items-center justify-center">
                <SitecoreImage field={fields.Benefit2Icon} className="h-8 w-8 object-contain" />
              </div>
            )}
            <h3 className="text-lg font-bold text-[#1A1A2E]">
              <Text field={fields.Benefit2Title} />
            </h3>
            <div className="text-sm leading-relaxed text-[#555]">
              <RichText field={fields.Benefit2Description} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
