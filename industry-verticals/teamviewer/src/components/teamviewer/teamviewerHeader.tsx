import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <header className={`component header border-b border-gray-200 bg-white ${styles}`} id={id}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-4 lg:gap-6">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Placeholder name={`header-logo-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>

          {/* Navigation - Center/Mobile Menu */}
          <div className="flex-1">
            <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>

          {/* Actions - Right side (Contact Sales, Phone, Sign In, Button) */}
          <div className="flex items-center gap-4">
            <Placeholder
              name={`header-actions-${DynamicPlaceholderId}`}
              rendering={props.rendering}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
