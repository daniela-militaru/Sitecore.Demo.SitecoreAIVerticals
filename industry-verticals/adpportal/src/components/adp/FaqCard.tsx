/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, type JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import {
  getRequiredAuth0KeysFromEntitlements,
  useComponentEntitlementDecision,
  type EntitlementItem,
} from '@/lib/entitlements/componentEntitlements';

/**
 * FaqCard Component
 * A single FAQ question/answer pair, droppable inside the FaqSection placeholder.
 *
 * Renders with a `.faq-card` CSS class and `data-faq-question` attribute so the
 * parent FaqSection can discover it via MutationObserver and manage the
 * accordion expand/collapse behaviour.
 *
 * The parent section controls visibility by toggling the `data-faq-open` attribute.
 * The card reads this attribute to show/hide its answer and rotate the chevron.
 */

interface Fields {
  Question: TextField;
  Answer: RichTextField;

  // ✅ Entitlements is on the datasource
  Entitlements: EntitlementItem[];
}

const defaultFields: Fields = {
  Question: { value: 'What is Human Capital Management (HCM)?' },
  Answer: {
    value:
      "<p>Human Capital Management (HCM) is a comprehensive approach to managing an organisation's most valuable asset: its people. It covers everything from recruiting and onboarding to payroll, benefits, performance management and talent development.</p>",
  },
  Entitlements: [],
};

export type FaqCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FaqCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;

  const requiredKeys = useMemo(
    () => getRequiredAuth0KeysFromEntitlements(fields?.Entitlements),
    [fields?.Entitlements]
  );
  const { allowed, isLoading, isSecured } = useComponentEntitlementDecision(requiredKeys);

  if (!isEditingOrPreview && isSecured) {
    if (isLoading) return null;
    if (!allowed) return null;
  }

  const questionValue = (fields.Question?.value as string) || '';

  return (
    <div
      className={`faq-card ${styles || ''}`}
      id={id}
      data-faq-question={questionValue}
      data-faq-open="false"
    >
      {/* The button triggers expand/collapse, handled by the parent FaqSection */}
      <button
        className="faq-card-toggle flex w-full items-center justify-between py-4 text-left"
        aria-expanded={false}
      >
        <span className="pr-4 text-sm font-medium text-[#1A1A2E] lg:text-base">
          <Text field={fields.Question} />
        </span>
        <svg
          className="faq-card-chevron h-5 w-5 shrink-0 text-[#555] transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Answer (hidden by default, parent toggles max-h via data-faq-open) */}
      <div className="faq-card-answer max-h-0 overflow-hidden transition-all duration-300">
        <div className="pb-4 text-sm leading-relaxed text-[#555]">
          <RichText field={fields.Answer} />
        </div>
      </div>
    </div>
  );
};
