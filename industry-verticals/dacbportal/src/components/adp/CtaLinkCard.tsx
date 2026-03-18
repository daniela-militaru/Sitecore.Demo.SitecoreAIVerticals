'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Text, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ArrowRight } from 'lucide-react';

interface Fields {
  /** Button label text */
  Label: TextField;
  /** Button link/href */
  Link: LinkField;
}

const defaultFields: Fields = {
  Label: { value: 'Talk to an Expert' },
  Link: { value: { href: '/contact' } },
};

export type CtaLinkCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CtaLinkCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  if (!fields.Link?.value?.href) return null;

  return (
    <SitecoreLink
      field={fields.Link}
      className={`component cta-link-card group inline-flex items-center gap-3 transition-opacity hover:opacity-80 ${styles || ''}`}
      id={id}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D0271D] text-white transition-transform group-hover:scale-105">
        <ArrowRight className="h-5 w-5" />
      </span>
      <span className="text-foreground text-sm font-medium">
        <Text field={fields.Label} />
      </span>
    </SitecoreLink>
  );
};
