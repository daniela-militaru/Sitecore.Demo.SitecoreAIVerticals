import React, { JSX } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as JssLink,
  ComponentParams,
  ComponentRendering,
} from '@sitecore-content-sdk/nextjs';

type Fields = {
  Title: TextField;
  Content: RichTextField;
  ButtonText: TextField;
  ButtonLink: LinkField;
};

type ComponentProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

const DEFAULT_FIELDS: Fields = {
  Title: { value: 'A world leader in sustainable technology solutions' },
  Content: {
    value: `<p>For over <strong>200</strong> years Johnson Matthey has contributed to solving some of the world's toughest problems, leaning on our expertise in advanced metals chemistry. But now is the time to make our biggest impact yet.</p>
<p>The world's leading energy, chemicals and automotive companies depend on us to help them decarbonise and reduce harmful emissions.</p>
<p>And as the planet faces up to an era of huge global challenges including climate change, energy supply and resource scarcity, we're continuing to innovate, providing solutions that are helping our customers and catalysing the net zero transition for millions of people every day.</p>`,
  },
  ButtonText: { value: 'READ MORE' },
  ButtonLink: { value: { href: '/about-us' } },
};

export const Default = (props: ComponentProps): JSX.Element => {
  const fields = props.fields || DEFAULT_FIELDS;
  const id = props.rendering?.uid;

  return (
    <section
      className="relative container m-0 mx-auto flex h-full bg-white py-12 md:py-16 lg:py-20"
      key={id}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <h2 className="mb-6 text-2xl font-light text-balance text-[#1e22aa] md:mb-8 md:text-3xl lg:text-4xl">
            <Text field={fields.Title} />
          </h2>
          <RichText
            field={fields.Content}
            className="mb-8 space-y-4 leading-relaxed text-gray-700 [&_strong]:font-bold [&>p]:mb-4 [&>p:last-child]:mb-0"
          />
          <JssLink
            field={fields.ButtonLink}
            className="inline-flex items-center gap-2 bg-[#1e22aa] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e22aa]/90"
          >
            <Text field={fields.ButtonText} />
            <ArrowRight className="h-4 w-4" />
          </JssLink>
        </div>
      </div>
    </section>
  );
};

export default Default;
