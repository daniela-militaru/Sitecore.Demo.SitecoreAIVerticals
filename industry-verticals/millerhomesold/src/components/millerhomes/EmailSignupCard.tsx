'use client';

import React, { type JSX } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Text,
  Image as JssImage,
  Link as JssLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface BulletPoint {
  fields: {
    Text: TextField;
  };
}

interface Fields {
  Heading: TextField;
  BulletPoints: BulletPoint[];
  ButtonText: TextField;
  ButtonLink: LinkField;
  BottomLinkText: TextField;
  BottomLink: LinkField;
  PhoneImage: ImageField;
  InputPlaceholder: TextField;
}

export type EmailSignupCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: EmailSignupCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div className={`component email-signup-card ${styles}`} id={id}>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Phone Mockups - Left Side */}
        <div className="shrink-0 w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <JssImage
              field={fields.PhoneImage}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 text-white">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            <Text field={fields.Heading} />
          </h2>

          {/* Bullet Points */}
          <ul className="space-y-3 mb-8">
            {fields.BulletPoints?.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-white mt-1.5">•</span>
                <span className="text-white/90 text-sm md:text-base">
                  <Text field={bullet.fields.Text} />
                </span>
              </li>
            ))}
          </ul>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder={fields.InputPlaceholder?.value as string || 'Email address'}
              className="w-full max-w-md px-4 py-3 rounded bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* CTA Button */}
          <JssLink
            field={fields.ButtonLink}
            className="inline-block bg-[#0072CE] hover:bg-[#005ba3] text-white font-semibold py-3 px-8 rounded transition-colors text-center min-w-[200px]"
          >
            <Text field={fields.ButtonText} />
          </JssLink>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="text-center mt-8 pt-4 border-t border-white/20">
        <JssLink
          field={fields.BottomLink}
          className="text-white underline hover:text-white/80 transition-colors text-sm font-medium"
        >
          <Text field={fields.BottomLinkText} />
        </JssLink>
      </div>
    </div>
  );
};
