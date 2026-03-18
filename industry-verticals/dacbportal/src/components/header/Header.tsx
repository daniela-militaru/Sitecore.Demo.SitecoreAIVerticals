import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <header
      className={`component header border-border bg-background/95 sticky top-0 z-50 border-b shadow-sm backdrop-blur ${styles}`}
      id={id}
    >
      <div className="container">
        <div className="flex min-h-18 items-center gap-6 lg:min-h-20">
          {/* Left: Logo */}
          <div className="flex shrink-0 items-center">
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>

          {/* Center: Navigation */}
          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1 text-[15px] font-medium tracking-[0.01em] text-[#2f2f2f] [&_a]:px-3 [&_a]:py-2 [&_a]:transition-colors hover:[&_a]:text-[#a37a3a]">
              <Placeholder
                name={`header-nav-${DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
          </nav>

          {/* Right: Login / actions */}
          <div className="ml-auto flex shrink-0 items-center">
            <Placeholder
              name={`header-right-${DynamicPlaceholderId}`}
              rendering={props.rendering}
            />
          </div>
        </div>

        {/* Mobile/Tablet navigation row */}
        <div className="border-border border-t lg:hidden">
          <div className="flex items-center gap-1 py-2 text-sm font-medium text-[#2f2f2f] [&_a]:px-2 [&_a]:py-1.5 [&_a]:transition-colors hover:[&_a]:text-[#a37a3a]">
            <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </header>
  );
};
