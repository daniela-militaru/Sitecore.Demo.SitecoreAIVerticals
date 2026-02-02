import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * FeatureSection Component
 * "With you every step of the way" section with image and text overlay
 * 
 * Features:
 * - Full-width background image
 * - Dark blue overlay with text content on left side
 * - Title, description, and CTA button
 * - Responsive layout
 */

interface Fields {
  BackgroundImage: ImageField;
  Title: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

export type FeatureSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FeatureSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <section
      className={`component feature-section relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px] ${styles || ''}`}
      id={id}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {fields.BackgroundImage?.value?.src ? (
          <SitecoreImage
            field={fields.BackgroundImage}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#003057] to-[#004070]" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row">
            {/* Content Box */}
            <div className="bg-[#003057] text-white p-8 lg:p-10 rounded-lg max-w-md lg:max-w-lg">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 leading-tight">
                {fields.Title ? (
                  <Text field={fields.Title} />
                ) : (
                  <>With you every<br />step of the way</>
                )}
              </h2>

              <div className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                {fields.Description ? (
                  <RichText field={fields.Description} />
                ) : (
                  <p>
                    We continue caring long after your dream home has been built, you&apos;ve 
                    got the keys and have settled in. We&apos;re there when you need us 
                    because it&apos;s important to us that you&apos;re not just satisfied 
                    but are delighted living in your new Miller home. We have 90 years 
                    worth of customers that we have learned from and we are still listening.
                  </p>
                )}
              </div>

              {(fields.CTALink || !fields.Description) && (
                <SitecoreLink
                  field={fields.CTALink || { value: { href: '#' } }}
                  className="inline-block bg-transparent border border-white text-white font-medium py-2.5 px-6 rounded hover:bg-white hover:text-[#003057] transition-colors text-sm"
                >
                  {fields.CTAText ? (
                    <Text field={fields.CTAText} />
                  ) : (
                    'Find out more'
                  )}
                </SitecoreLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
