import React from 'react';
import {
  Link as ContentSdkLink,
  Text,
  RichText,
  Image as SitecoreImage,
  LinkField,
  TextField,
  RichTextField,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ArrowRight } from 'lucide-react';

interface BusinessSizeCardProps extends ComponentProps {
  fields: {
    /**
     * The Integrated graphQL query result. This illustrates the way to access the datasource children.
     */
    data: {
      datasource: {
        children: {
          results: Array<{
            field: {
              link: LinkField;
            };
          }>;
        };
        Image: { jsonValue: ImageField };
        EmployeeCountLabel: { jsonValue: TextField };
        Title: { jsonValue: TextField };
        Description: { jsonValue: RichTextField };
      };
    };
  };
}

const LinkListItem = ({
  index,
  total,
  field,
}: {
  index: number;
  total: number;
  field: LinkField;
}) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <ContentSdkLink
        field={field}
        className="flex items-center justify-between border-b border-gray-100 py-3 text-sm text-[#333] transition-colors hover:text-[#D0271D]"
      >
        <span>{field.value?.text}</span>
        <ArrowRight className="h-4 w-4" />
      </ContentSdkLink>
    </li>
  );
};

export const Default = ({ params, fields }: BusinessSizeCardProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component business-size-card ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const renderContent = () => {
    if (!datasource) {
      return <h3>Business Size Card</h3>;
    }

    const links = datasource.children.results
      .filter((element) => element?.field?.link)
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field?.link}`}
          index={index}
          total={datasource.children.results.length}
          field={element.field.link}
        />
      ));

    return (
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
        {/* Image */}
        <div className="flex items-center justify-center px-6 pt-6">
          <SitecoreImage
            field={datasource.Image.jsonValue}
            className="h-28 w-auto object-contain lg:h-36"
          />
        </div>

        {/* Content */}
        <div className="flex grow flex-col p-6">
          {/* Employee Count Label */}
          <p className="mb-1 text-center text-xs font-semibold tracking-wider text-[#555] uppercase">
            <Text field={datasource.EmployeeCountLabel.jsonValue} />
          </p>

          {/* Title */}
          <h3 className="mb-3 text-center text-xl font-bold text-[#1A1A2E]">
            <Text field={datasource.Title.jsonValue} />
          </h3>

          {/* Description */}
          <div className="mb-5 text-center text-sm leading-relaxed text-[#555]">
            <RichText field={datasource.Description.jsonValue} />
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="mt-auto border-t border-gray-100">
              <ul className="list-none p-0">{links}</ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles} id={id}>
      {renderContent()}
    </div>
  );
};
