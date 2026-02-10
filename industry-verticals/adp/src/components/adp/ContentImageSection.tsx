'use client';

import React, { JSX } from 'react';
import {
  TextField,
  Text,
  ImageField,
  Image as SitecoreImage,
  RichTextField,
  RichText,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';

/**
 * ContentImageSection Component
 * Two-column layout with rich text content on the left and image on the right (desktop)
 * Stacked layout on mobile with image below content
 */

interface Fields {
  Heading: TextField;
  Content: RichTextField;
  Image: ImageField;
}

const defaultFields: Fields = {
  Heading: { value: 'How do ADP payroll services work?' },
  Content: {
    value: `<p>ADP payroll services are comprehensive, offering <strong>partially</strong> or <strong>fully</strong> <span style="color: #D0271D;">managed payroll</span> administration with varying levels of service to best meet your needs. From processing payslips, to issuing P60s and helping you keep compliant with HMRC regulations, ADP payroll services simplify the administrative tasks of managing payroll.</p>
    <p>Our platform lets you access a wide range of workforce-related reporting services, delivering reports from headcount to labour cost analysis, across geographies and employee populations. ADP offers our own <strong>unified</strong> <span style="color: #D0271D;">HCM</span> solutions built on top of ADP payroll. These are flexible enough to <strong>integrate</strong> easily with third-party HCM systems.</p>`,
  },
  Image: {
    value: {
      src: '/images/image.png',
      alt: 'Woman using tablet in office',
    },
  },
};

export type ContentImageSectionProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields?: Fields;
};

export const Default = (props: ContentImageSectionProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.Styles || '';

  return (
    <section
      className={`component content-image-section bg-white py-12 lg:py-16 ${styles}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-12 lg:pl-55">
          {/* Content Column */}
          <div className="lg:w-1/2">
            <Text
              tag="h2"
              className="mb-6 text-3xl leading-tight font-bold text-[#1A1A2E] lg:text-4xl"
              field={fields.Heading}
            />
            <RichText
              field={fields.Content}
              className="contentimagesection-content prose prose-lg max-w-none text-[#1A1A2E]"
            />
          </div>

          {/* Image Column */}
          <div className="lg:w-1/2">
            <div className="overflow-hidden rounded-lg">
              <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .contentimagesection-content :global(a),
          .contentimagesection-content :global(strong) {
            color: #d0271d;
          }
          .contentimagesection-content :global(a) {
            text-decoration: none;
          }
          .contentimagesection-content :global(a:hover) {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </section>
  );
};

export const Reversed = (props: ContentImageSectionProps): JSX.Element => {
  const fields = props.fields || defaultFields;
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.Styles || '';

  return (
    <section
      className={`component image-content-section bg-white py-12 lg:py-16 ${styles}`}
      id={id}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-12 lg:pl-55">
          {/* Image Column - First on Desktop */}
          <div className="lg:w-1/2">
            <div className="overflow-hidden rounded-lg">
              <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Content Column - Second on Desktop */}
          <div className="lg:w-1/2">
            <Text
              tag="h2"
              className="mb-6 text-3xl leading-tight font-bold text-[#1A1A2E] lg:text-4xl"
              field={fields.Heading}
            />
            <RichText
              field={fields.Content}
              className="imagecontentsection-content prose prose-lg max-w-none text-[#1A1A2E]"
            />
          </div>
        </div>

        <style jsx>{`
          .imagecontentsection-content :global(a),
          .imagecontentsection-content :global(strong) {
            color: #d0271d;
          }
          .imagecontentsection-content :global(a) {
            text-decoration: none;
          }
          .imagecontentsection-content :global(a:hover) {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </section>
  );
};
