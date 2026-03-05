'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ChevronDown } from 'lucide-react';
import HamburgerIcon from '@/components/non-sitecore/HamburgerIcon';
import { useClickAway } from '@/hooks/useClickAway';
import { useStopResponsiveTransition } from '@/hooks/useStopResponsiveTransition';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import {
  getLinkContent,
  getLinkField,
  isNavLevel,
  isNavRootItem,
  prepareFields,
} from '@/helpers/navHelpers';
import clsx from 'clsx';
import { isParamEnabled } from '@/helpers/isParamEnabled';

import { useUser } from '@auth0/nextjs-auth0/client';
import { ENTITLEMENTS_CLAIM } from 'lib/entitlements';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
  __requiredAuth0Keys?: string[]; // injected by SSR
}

interface NavigationListItemProps {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  logoSrc?: string;
  isSimpleLayout?: boolean;
}

export interface NavigationProps extends ComponentProps {
  fields: Record<string, NavItemFields>;
}

function userHasSomeRequiredKey(requiredKeys: string[], userEntitlements: Record<string, boolean>) {
  if (!requiredKeys?.length) return true;
  return requiredKeys.some((k) => userEntitlements[k] === true);
}

function filterNavTreeClient(items: NavItemFields[], userEntitlements: Record<string, boolean>) {
  const filterRec = (arr: NavItemFields[]): NavItemFields[] => {
    const out: NavItemFields[] = [];
    for (const it of arr) {
      const required = it.__requiredAuth0Keys || [];
      if (!userHasSomeRequiredKey(required, userEntitlements)) continue;

      const next: NavItemFields = { ...it };
      if (next.Children?.length) next.Children = filterRec(next.Children);
      out.push(next);
    }
    return out;
  };
  return filterRec(items);
}

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  logoSrc,
  isSimpleLayout,
}) => {
  const { page } = useSitecore();
  const [isActive, setIsActive] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  useClickAway(dropdownRef, () => setIsActive(false));

  const isRootItem = isNavRootItem(fields);
  const isTopLevelPage = isNavLevel(fields, 1);

  const hasChildren = !!fields.Children?.length;
  const isLogoRootItem = isRootItem && logoSrc;
  const hasDropdownMenu = hasChildren && isTopLevelPage;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    handleClick(event);
    setIsActive(false);
  };

  const children = hasChildren
    ? fields.Children!.map((child) => (
        <NavigationListItem
          key={child.Id}
          fields={child}
          handleClick={clickHandler}
          isSimpleLayout={isSimpleLayout}
          logoSrc={logoSrc}
        />
      ))
    : null;

  const debug =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('navdebug') === '1';
  if (debug)
    console.log('[NAV ITEM]', {
      id: fields.Id,
      href: fields.Href,
      req: fields.__requiredAuth0Keys,
    });

  return (
    <li
      ref={dropdownRef}
      tabIndex={0}
      role="menuitem"
      className={clsx(
        fields?.Styles?.join(' '),
        'relative flex flex-col gap-x-8 gap-y-4 xl:gap-x-14',
        isRootItem && 'lg:flex-row',
        isLogoRootItem && 'shrink-0 max-lg:hidden',
        isLogoRootItem && isSimpleLayout && 'lg:mr-auto'
      )}
    >
      <div className="flex items-center justify-center">
        <Link
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={clickHandler}
          className="hover:text-foreground-light text-[12px] whitespace-nowrap transition-colors"
        >
          {getLinkContent(fields, logoSrc)}
        </Link>

        {hasDropdownMenu && (
          <button
            type="button"
            aria-label="Toggle submenu"
            aria-haspopup="true"
            aria-expanded={isActive}
            className="flex h-6 cursor-pointer items-center justify-center"
            onClick={() => setIsActive((a) => !a)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsActive((a) => !a);
              }
            }}
          >
            <ChevronDown
              className={clsx(
                'size-4 transition-transform duration-300',
                isActive && 'rotate-180',
                'navigation-dropdown-trigger'
              )}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <ul
          role="menu"
          className={clsx(
            'flex flex-col items-center gap-x-8 gap-y-4 xl:gap-x-14',
            isRootItem && 'lg:flex-row',
            hasDropdownMenu &&
              clsx(
                'z-110 text-base max-lg:border-b max-lg:pb-4 max-lg:text-sm',
                'lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:p-6 lg:transition-all lg:duration-300',
                'lg:bg-background lg:rounded-xl lg:shadow-md',
                isActive
                  ? 'max-lg:flex'
                  : 'max-lg:hidden lg:pointer-events-none lg:translate-y-2 lg:scale-95 lg:opacity-0'
              )
          )}
        >
          {children}
        </ul>
      )}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const isEditingOrPreview = page.mode.isEditing || page.mode.isPreview;
  const { user } = useUser();

  const { styles, RenderingIdentifier: id, Logo: logoImage, SimpleLayout: simpleLayout } = params;

  useStopResponsiveTransition();

  const [baseFields, setBaseFields] = useState<Record<string, NavItemFields>>(fields);

  useEffect(() => {
    setBaseFields(fields);
  }, [fields]);

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && isEditingOrPreview) event.preventDefault();
    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const isSimpleLayout = isParamEnabled(simpleLayout);
  const logoSrc = extractMediaUrl(logoImage);

  const userEntitlements = useMemo<Record<string, boolean>>(() => {
    const claim = user?.[ENTITLEMENTS_CLAIM] as unknown;
    if (claim && typeof claim === 'object' && !Array.isArray(claim)) {
      return claim as Record<string, boolean>;
    }
    return {};
  }, [user]);

  const filteredFields = useMemo(() => {
    const prepared = prepareFields(baseFields, !isSimpleLayout);
    const list = Object.values(prepared).filter(Boolean) as NavItemFields[];

    if (isEditingOrPreview) {
      const record: Record<string, NavItemFields> = {};
      list.forEach((it, idx) => (record[String(idx)] = it));
      return record;
    }

    const filteredList = filterNavTreeClient(list, userEntitlements);
    const record: Record<string, NavItemFields> = {};
    filteredList.forEach((it, idx) => (record[String(idx)] = it));
    return record;
  }, [userEntitlements, baseFields, isSimpleLayout, isEditingOrPreview]);

  /**
   * Refresh nav during long sessions so newly published items appear.
   * IMPORTANT: Do NOT refresh in editing/preview mode, so editors never get filtered data.
   */
  useEffect(() => {
    if (isEditingOrPreview) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        const locale = (page as unknown as { locale?: string })?.locale || 'en';
        const res = await fetch(`/api/nav?locale=${encodeURIComponent(locale)}&editing=0`, {
          method: 'GET',
        });
        if (!res.ok) return;
        const json = (await res.json()) as { fields?: Record<string, NavItemFields> };
        if (!cancelled && json?.fields) {
          console.log('[NAV] refreshed from /api/nav');
          setBaseFields(json.fields);
        }
      } catch {
        // ignore
      }
    };

    refresh();

    const interval = setInterval(refresh, 2 * 60 * 1000);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isEditingOrPreview, page]);

  if (!Object.values(filteredFields).some((v) => !!v)) {
    return (
      <div className={`component navigation ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const preparedFields = prepareFields(filteredFields, !isSimpleLayout);
  const rootItem = Object.values(preparedFields).find((item) => isNavRootItem(item));
  const hasLogoRootItem = rootItem && logoSrc;

  const navigationItems = Object.values(preparedFields)
    .filter((item): item is NavItemFields => !!item)
    .map((item) => (
      <NavigationListItem
        key={item.Id}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        logoSrc={logoSrc}
        isSimpleLayout={!!isSimpleLayout}
      />
    ));

  return (
    <div className={`component navigation bg-background ${styles}`} id={id}>
      <div
        className={clsx(
          'relative z-150 container flex items-center py-4 lg:hidden',
          !isSimpleLayout &&
            '[.component.header_&]:grid-cols-2 [.component.header_&]:px-0 [.component.header_&]:max-lg:grid',
          !isSimpleLayout ? 'flex-row-reverse' : '',
          isSimpleLayout && !hasLogoRootItem ? 'justify-end' : ''
        )}
      >
        {hasLogoRootItem && (
          <Link
            field={getLinkField(rootItem!)}
            editable={page.mode.isEditing}
            className={clsx(
              'navigation-mobile-trigger',
              !isSimpleLayout && '[.component.header_&]:mx-auto'
            )}
          >
            {getLinkContent(rootItem!, logoSrc)}
          </Link>
        )}
        <HamburgerIcon
          isOpen={isMenuOpen}
          onClick={handleToggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleMenu();
            }
          }}
          className={clsx(
            'navigation-mobile-trigger',
            !isSimpleLayout && '[.component.header_&]:-order-1'
          )}
        />
      </div>

      <nav
        className={clsx(
          'bg-background z-100 flex duration-300',
          'max-lg:fixed max-lg:inset-0',
          !isMenuOpen && 'max-lg:-translate-y-full max-lg:opacity-0'
        )}
      >
        <ul
          role="menubar"
          className={clsx(
            // Mobile: center items; Desktop: align items from the left.
            'container flex flex-col gap-x-4 gap-y-4 py-6 text-lg lg:flex-row xl:gap-x-8',
            'max-lg:items-center max-lg:justify-center lg:items-center lg:justify-start',
            isSimpleLayout && !hasLogoRootItem && 'lg:justify-end'
          )}
        >
          {navigationItems}
        </ul>
      </nav>
    </div>
  );
};
