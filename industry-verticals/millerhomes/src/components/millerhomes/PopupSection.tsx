'use client';

import React, { type JSX, useEffect, useState } from 'react';
import { TextField, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { X } from 'lucide-react';

/**
 * PopupSection Component
 * A flexible modal/popup container with dynamic placeholder for content
 *
 * Variants (via params.Variant):
 * - "branded" (default): Dark blue background with Miller Home logo and close button
 * - "choice": Transparent container for choice cards, click outside to close
 *
 * The placeholder renders ChoiceCard, EmailSignupCard, or any other card components
 */

interface Fields {
  /** Optional title for the popup (used in branded variant) */
  Title: TextField;
  /** Logo text parts */
  LogoPrefix: TextField;
  LogoText: TextField;
  LogoHighlight: TextField;
  /** Dictionary key: Popup_CloseButton */
  CloseButtonText: TextField;
}

const defaultFields: Fields = {
  Title: { value: '' },
  LogoPrefix: { value: 'my' },
  LogoText: { value: 'miller' },
  LogoHighlight: { value: 'home' },
  CloseButtonText: { value: 'Close' },
};

export type PopupSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PopupSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId, Variant } = props.params;
  const fields = props.fields || defaultFields;
  const [isOpen, setIsOpen] = useState(true);

  // Determine variant - "branded" (default) or "choice"
  const variant = Variant || 'branded';
  const isBranded = variant === 'branded';

  const phPopupContent = `popupContent-${DynamicPlaceholderId}`;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <div
      className={`component popup-section fixed inset-0 z-50 flex items-center justify-center ${styles || ''}`}
      id={id}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#003057]/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative mx-4 max-h-[90vh] w-full overflow-y-auto rounded-lg shadow-2xl ${
          isBranded ? 'max-w-4xl bg-[#003057]' : 'max-w-5xl bg-transparent'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {/* Header - Only for branded variant */}
        {isBranded && (
          <div className="flex items-center justify-between p-6 pb-0">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-light text-white">{fields.LogoPrefix?.value}</span>
              <span className="text-2xl font-bold text-white">{fields.LogoText?.value}</span>
              <span className="text-2xl font-light text-[#0072CE]">
                {fields.LogoHighlight?.value}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-white transition-colors hover:text-white/80"
              aria-label={fields.CloseButtonText?.value as string}
            >
              <span className="text-sm font-medium">{fields.CloseButtonText?.value}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0072CE]">
                <X className="h-5 w-5 text-[#0072CE]" />
              </div>
            </button>
          </div>
        )}

        {/* Dynamic Placeholder Content */}
        <div className={`${isBranded ? 'p-6' : 'p-4'}`}>
          {/* Wrapper for choice cards - displays them in a row */}
          <div
            className={
              variant === 'choice'
                ? 'flex flex-col items-stretch justify-center gap-6 md:flex-row'
                : ''
            }
          >
            <Placeholder name={phPopupContent} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </div>
  );
};

