'use client';

import { useState, type JSX } from 'react';
import { TextField, RichTextField, Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Question: TextField;
  Answer: RichTextField;
}

type FAQCardProps = ComponentProps & {
  fields: Fields;
};

const defaultFields: Fields = {
  Question: { value: "How does TeamViewer's pricing model work?" },
  Answer: {
    value:
      '<p>TeamViewer offers flexible pricing plans based on the number of users and features you need. Our plans are billed annually and provide unlimited remote connections.</p>',
  },
};

export const Default = (props: FAQCardProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const fields = props.fields || defaultFields;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`component faq-card ${styles || ''}`}
      id={id}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        marginBottom: '12px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: '20px 24px',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#0d1b3e',
            paddingRight: '20px',
          }}
        >
          <Text field={fields.Question} />
        </span>

        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#0d1b3e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '0 24px 20px 24px',
            fontSize: '15px',
            color: '#555555',
            lineHeight: '1.6',
          }}
        >
          <RichText field={fields.Answer} />
        </div>
      )}
    </div>
  );
};
