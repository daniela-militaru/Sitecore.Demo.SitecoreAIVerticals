'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  Text,
  RichText,
  ImageField,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * AwardsSection Component
 * "Awards en erkenning" / "Awards and recognition" section
 *
 * Layout:
 * - Centered heading
 * - Row of 3 award badges (image + title + optional description)
 * - Desktop: 3 columns side by side
 * - Mobile: stacked vertically
 */

interface Fields {
  Title: TextField;
  Award1Image: ImageField;
  Award1Title: TextField;
  Award1Description: RichTextField;
  Award2Image: ImageField;
  Award2Title: TextField;
  Award2Description: RichTextField;
  Award3Image: ImageField;
  Award3Title: TextField;
  Award3Description: RichTextField;
}

const defaultFields: Fields = {
  Title: { value: 'Awards and recognition' },
  Award1Image: {
    value: { src: '/awards/neat-leader.png', alt: 'NelsonHall NEAT Leader' },
  },
  Award1Title: { value: 'NelsonHall NEAT Leader' },
  Award1Description: {
    value: '<p>Next Generation HCM Technology 2023</p>',
  },
  Award2Image: {
    value: { src: '/awards/peak-leader.png', alt: 'PEAK Matrix Leader' },
  },
  Award2Title: { value: 'PEAK von Everest Group' },
  Award2Description: {
    value: '<p>Leader Multi Process Human Resources Outsourcing 15 opeenvolgende jaren</p>',
  },
  Award3Image: {
    value: { src: '/awards/ventana-leader.png', alt: 'Ventana Research Overall Leader' },
  },
  Award3Title: { value: 'Ventana Research' },
  Award3Description: {
    value: '<p>Overall Leader Workforce Management 2022</p>',
  },
};

export type AwardsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AwardsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const awards = [
    {
      image: fields.Award1Image,
      title: fields.Award1Title,
      description: fields.Award1Description,
    },
    {
      image: fields.Award2Image,
      title: fields.Award2Title,
      description: fields.Award2Description,
    },
    {
      image: fields.Award3Image,
      title: fields.Award3Title,
      description: fields.Award3Description,
    },
  ].filter((award) => award.title?.value);

  return (
    <section className={`component awards-section bg-white py-12 lg:py-16 ${styles || ''}`} id={id}>
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1A1A2E] lg:mb-12 lg:text-3xl">
          <Text field={fields.Title} />
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {awards.map((award, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {award.image?.value?.src && (
                <div className="mb-4 flex h-24 items-center justify-center">
                  <SitecoreImage field={award.image} className="h-20 w-auto object-contain" />
                </div>
              )}
              <h3 className="mb-2 text-sm font-bold text-[#1A1A2E]">
                <Text field={award.title} />
              </h3>
              {award.description?.value && (
                <div className="text-xs leading-relaxed text-[#555]">
                  <RichText field={award.description} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
