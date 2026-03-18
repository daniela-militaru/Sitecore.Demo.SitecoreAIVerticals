import React, { JSX, useMemo, useState } from 'react';
import { User, Heart, ShoppingCart, X, Search } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { isParamEnabled } from '@/helpers/isParamEnabled';
import { useI18n } from 'next-localization';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { MiniCart } from '../non-sitecore/MiniCart';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import PreviewSearch from '../non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  getUserEntitlementsFromUser,
  getUserRolesFromUser,
} from '@/lib/entitlements/componentEntitlements';

interface User {
  username: string;
  name: string;
  company: string;
}

export type NavigationIconsProps = ComponentProps & {
  fields: {
    CheckoutPage: LinkField;
    AccountPage: LinkField;
    WishlistPage: LinkField;
  };
  params: { [key: string]: string };
};

function UserInfoWithHover({ user }: { user: Record<string, unknown> }) {
  const [isHovered, setIsHovered] = useState(false);
  console.log('JBE UserInfoWithHover USER:', user);
  const entitlements = useMemo(() => getUserEntitlementsFromUser(user), [user]);
  const roles = useMemo(() => getUserRolesFromUser(user), [user]);

  const entitlementKeys = useMemo(
    () => Object.keys(entitlements).filter((k) => entitlements[k] === true),
    [entitlements]
  );

  const displayName =
    typeof user.name === 'string'
      ? user.name
      : typeof user.email === 'string'
        ? user.email
        : 'User';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="cursor-default text-sm font-semibold text-[#1A1A2E]">Welcome, {displayName}</p>
      {isHovered && (
        <div
          className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg"
          role="tooltip"
        >
          <div className="mb-2">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Entitlements
            </p>
            {entitlementKeys.length > 0 ? (
              <ul className="mt-0.5 space-y-0.5 text-xs text-[#1A1A2E]">
                {entitlementKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-xs text-gray-500 italic">None configured</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Roles</p>
            {roles.length > 0 ? (
              <ul className="mt-0.5 space-y-0.5 text-xs text-[#1A1A2E]">
                {roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-xs text-gray-500 italic">None configured</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const IconDropdown = ({
  icon,
  label,
  children,
}: {
  icon: JSX.Element;
  label: string;
} & React.PropsWithChildren) => (
  <Popover>
    <PopoverTrigger
      className="text-foreground hover:text-accent data-[state=open]:text-accent transition-colors"
      aria-label={label}
    >
      {icon}
    </PopoverTrigger>
    <PopoverContent className="flex w-xl flex-col">
      <PopoverClose className="surface-btn text-foreground! shrink-0 self-end">
        <X className="size-4" />
      </PopoverClose>
      <div className="">{children}</div>
    </PopoverContent>
  </Popover>
);

export default function AuthButtons() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return (
      // Intentional <a>: full navigation so request hits API route; Link causes client-side 404
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href="/api/auth/login" className="text-[#E2231A] hover:underline">
        Login
      </a>
    );
  }

  return (
    <div>
      <UserInfoWithHover user={user} />
      <br />
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/logout" className="text-[#E2231A] hover:underline">
        Logout
      </a>
    </div>
  );
}

export const Default = (props: NavigationIconsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const showWishlistIcon = !isParamEnabled(props.params.HideWishlistIcon);
  const showAccountIcon = !isParamEnabled(props.params.HideAccountIcon);
  const showCartIcon = !isParamEnabled(props.params.HideCartIcon);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isLoading } = useUser();

  const { t } = useI18n();

  return (
    <>
      <div className={`component navigation-icons ${props?.params?.styles?.trimEnd()}`} id={id}>
        <div className="flex items-center gap-3 p-4 lg:gap-5 [.component.header_&]:justify-end [.component.header_&]:px-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-accent text-foreground p-2 transition-colors"
          >
            <Search className="size-5" />
          </button>

          {showAccountIcon && (
            <IconDropdown icon={<User className="size-5" />} label="Account">
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : user ? (
                <div className="space-y-3">
                  <div className="overflow-visible border-b border-gray-200 pb-3">
                    <UserInfoWithHover user={user} />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/api/auth/logout" className="ml-1 text-[#E2231A] hover:underline">
                    {t('logout') || 'Log out'}
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {t('account-empty') || 'You are not logged in.'}
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/api/auth/login" className="ml-1 text-[#E2231A] hover:underline">
                    {t('login') || 'Log in'}
                  </a>
                </p>
              )}
            </IconDropdown>
          )}

          {showWishlistIcon && (
            <IconDropdown icon={<Heart className="size-5" />} label="Wishlist">
              <p>{t('wishlist-empty') || 'Your wishlist is empty.'}</p>
            </IconDropdown>
          )}

          {showCartIcon && (
            <IconDropdown icon={<ShoppingCart className="size-5" />} label="Cart">
              <MiniCart showWishlist={showWishlistIcon} checkoutPage={props.fields?.CheckoutPage} />
            </IconDropdown>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />

              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-foreground-muted hover:text-foreground p-3 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
