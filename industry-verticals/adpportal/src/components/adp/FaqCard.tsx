/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { type JSX } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
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
  userHasSomeRequiredKey,
  type EntitlementItem,
  type EntitlementsMap,
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

function extractUserEntitlementsMap(user: any): EntitlementsMap {
  // ✅ Use the same claim you use elsewhere in your project
  const raw = user?.entitlements ?? user?.['https://example.com/entitlements'] ?? [];

  if (!Array.isArray(raw)) return {};
  return raw.reduce((acc: EntitlementsMap, k: any) => {
    if (typeof k === 'string' && k.trim()) acc[k.trim()] = true;
    return acc;
  }, {});
}

export const Default = (props: FaqCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  // Always show in edit/preview
  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;

  const requiredKeys = getRequiredAuth0KeysFromEntitlements(fields?.Entitlements);
  const isSecured = requiredKeys.length > 0;

  const { user, isLoading } = useUser();

  if (!isEditingOrPreview && isSecured) {
    // Fail-closed while loading user to avoid showing secured content briefly
    if (isLoading) return null;

    // Logged out => hide secured FAQ card
    if (!user) return null;

    const entitlements = extractUserEntitlementsMap(user);
    const allowed = userHasSomeRequiredKey(requiredKeys, entitlements);
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
