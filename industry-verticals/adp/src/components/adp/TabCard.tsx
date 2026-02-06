'use client';

import type { JSX } from 'react';
import {
  TextField,
  ImageField,
  Text,
  Image as SitecoreImage,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TabCard Component
 * Droppable card for the TabsSection placeholder.
 *
 * Renders two distinct parts controlled by the parent section:
 *   1. `.tab-card-trigger` -- the tab label (contains an editable <Text> field)
 *   2. `.tab-card-content` -- the image + a placeholder for TabBenefitCard items
 *
 * Desktop: The section arranges all triggers in a horizontal red bar and
 *          shows the active card's content in a bordered panel.
 * Mobile:  Each card acts as an accordion item (trigger + collapsible content).
 *
 * The tab label is rendered with <Text> inside the card itself so that
 * Sitecore editors can click and edit it in Experience Editor.
 *
 * Benefit items are NOT hard-coded -- they are dropped as TabBenefitCard
 * components into the `tabBenefits-{DynamicPlaceholderId}` placeholder.
 */

interface Fields {
  /** Tab button label -- editable via <Text> */
  Label: TextField;
  /** Optional image shown beside the benefits */
  Image: ImageField;
}

const defaultFields: Fields = {
  Label: { value: 'Bespaar geld' },
  Image: { value: { src: '/tab-image.jpg', alt: 'Tab visual' } },
};

export type TabCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TabCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;
  const fields = props.fields || defaultFields;

  const phBenefits = `tabBenefitCards-${DynamicPlaceholderId}`;

  return (
    <div
      className={`tab-card ${styles || ''}`}
      id={id}
      data-tab-label={fields.Label?.value as string}
    >
      {/* ===== TRIGGER (tab label) ===== */}
      <button
        type="button"
        className="tab-card-trigger flex w-full items-center justify-between"
        aria-expanded="false"
      >
        <span className="tab-card-label">
          <Text field={fields.Label} />
        </span>
        {/* Chevron -- only visible on mobile via the section's styles */}
        <svg
          className="tab-card-chevron h-5 w-5 shrink-0 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ===== CONTENT (image + benefits placeholder) ===== */}
      <div className="tab-card-content">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {/* Benefits column -- populated via placeholder */}
          <div className="order-2 flex flex-1 flex-col gap-6 md:order-1">
            <Placeholder name={phBenefits} rendering={props.rendering} />
          </div>

          {/* Image column */}
          <div className="order-1 w-full shrink-0 md:order-2 md:w-[45%]">
            <SitecoreImage field={fields.Image} className="h-auto w-full rounded object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
