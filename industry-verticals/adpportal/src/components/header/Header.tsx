import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <div className={`component header bg-background ${styles}`} id={id}>
      <div className="container flex items-center justify-between">
        {/* Left */}
        <div>
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        {/* Right */}
        <div>
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>

      <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
    </div>
  );
};
