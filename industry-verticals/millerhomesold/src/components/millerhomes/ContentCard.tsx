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
 * ContentCard Component
 * Card for "Your place to be" carousel with image, title, description, and CTA
 * 
 * Layout options (via params.Layout):
 * - "image-right" (default): Image on right, text on left
 * - "image-left": Image on left, text on right  
 * - "image-top": Image on top, text below
 * 
 * Used inside ContentCarouselSection placeholder
 */

interface Fields {
  Image: ImageField;
  Title: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

export type ContentCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContentCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, Layout } = props.params;
  const { fields } = props;
  
  const layout = Layout || 'image-right';

  // Base card styles
  const cardClasses = `
    component content-card 
    flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]
    min-w-0 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100
    ${styles || ''}
  `.trim();

  if (layout === 'image-top') {
    return (
      <div className={cardClasses} id={id}>
        {/* Image */}
        {fields.Image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <SitecoreImage
              field={fields.Image}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl lg:text-2xl font-bold text-[#003057] mb-3">
            <Text field={fields.Title} />
          </h3>
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            <RichText field={fields.Description} />
          </div>
          {fields.CTALink && (
            <SitecoreLink
              field={fields.CTALink}
              className="inline-block bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-2.5 px-5 rounded transition-colors text-sm"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout (image-left or image-right)
  const isImageLeft = layout === 'image-left';

  return (
    <div 
      className={`${cardClasses} flex flex-col md:flex-row ${isImageLeft ? '' : 'md:flex-row-reverse'}`} 
      id={id}
    >
      {/* Image */}
      {fields.Image && (
        <div className="relative md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
          <SitecoreImage
            field={fields.Image}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <h3 className="text-xl lg:text-2xl font-bold text-[#003057] mb-3">
          <Text field={fields.Title} />
        </h3>
        <div className="text-sm text-gray-600 mb-4 leading-relaxed">
          <RichText field={fields.Description} />
        </div>
        {fields.CTALink && (
          <div>
            <SitecoreLink
              field={fields.CTALink}
              className="inline-block bg-[#0072CE] hover:bg-[#005ba3] text-white font-medium py-2.5 px-5 rounded transition-colors text-sm"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          </div>
        )}
      </div>
    </div>
  );
};
