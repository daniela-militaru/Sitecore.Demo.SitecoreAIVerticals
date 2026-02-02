import type { JSX } from 'react';
import {
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
  ImageField,
  LinkField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ChoiceCard Component
 * A card component for choice/path selection popups
 * Features: image, heading, description, and CTA button
 * 
 * Use inside PopupSection placeholder for choice-style popups
 */

interface Fields {
  /** Card image displayed at the top */
  Image: ImageField;
  /** Card heading/title - displays in light blue */
  Heading: TextField;
  /** Card description text - displays in gray */
  Description: TextField;
  /** Call-to-action link with button styling */
  CTALink: LinkField;
}

export type ChoiceCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ChoiceCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  // Validate required fields
  if (!fields) {
    return (
      <div className={`component choice-card ${styles || ''}`} id={id}>
        <p className="text-red-500">ChoiceCard: Missing fields data</p>
      </div>
    );
  }

  return (
    <div
      className={`component choice-card bg-white rounded-md overflow-hidden shadow-xl flex flex-col w-full md:w-1/2 md:max-w-[360px] ${styles || ''}`}
      id={id}
    >
      {/* Image */}
      {fields.Image && (
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <SitecoreImage
            field={fields.Image}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center text-center px-6 py-8 flex-1">
        {/* Heading - using font-light for elegant look, br tags for line break in Sitecore */}
        {fields.Heading && (
          <h3 className="text-2xl md:text-[28px] font-light text-[#0072CE] mb-4 leading-tight">
            <Text field={fields.Heading} />
          </h3>
        )}

        {/* Description */}
        {fields.Description && (
          <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed flex-1 max-w-[280px]">
            <Text field={fields.Description} />
          </p>
        )}

        {/* CTA Button */}
        {fields.CTALink && (
          <SitecoreLink
            field={fields.CTALink}
            className="bg-[#003057] hover:bg-[#002040] text-white font-medium py-3 px-6 rounded transition-colors text-sm w-full max-w-[220px] text-center"
          >
            Click Here
          </SitecoreLink>
        )}
      </div>
    </div>
  );
};

export default Default;
