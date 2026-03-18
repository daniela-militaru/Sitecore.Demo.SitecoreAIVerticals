import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Placeholder,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { CommonStyles, HeroBannerStyles, LayoutStyles } from '@/types/styleFlags';
import clsx from 'clsx';
import { ArrowDown } from 'lucide-react';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const HeroBannerCommon = ({
  params,
  fields,
  children,
}: HeroBannerProps & {
  children: React.ReactNode;
}) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const hideGradientOverlay = styles?.includes(HeroBannerStyles.HideGradientOverlay);

  const scrollToContent = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section
      className={`component hero-banner ${styles} relative h-[70vh] min-h-[500px] w-full overflow-hidden lg:h-[85vh]`}
      id={id}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {!isPageEditing && fields?.Video?.value?.src ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
          >
            <source src={fields.Video?.value?.src} type="video/webm" />
          </video>
        ) : (
          <>
            <ContentSdkImage
              field={fields.Image}
              className="h-full w-full object-cover md:object-bottom"
              priority
            />
          </>
        )}
        {/* Gradient overlay to fade image/video at bottom */}
        {!hideGradientOverlay && (
          <div className="from-foreground/70 via-foreground/40 absolute inset-0 bg-gradient-to-r to-transparent"></div>
        )}
      </div>

      <div className="relative z-10 h-full">{children}</div>

      <div className="absolute bottom-12 left-6 z-20 flex flex-col items-center gap-4 lg:bottom-20 lg:left-12">
        <div className="flex items-center gap-3">
          <span
            className="text-background origin-center -rotate-90 text-xs font-semibold tracking-[0.2em] whitespace-nowrap uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            What we do
          </span>
          <div className="bg-background/50 h-px w-8" />
        </div>
        <button
          type="button"
          onClick={scrollToContent}
          className="group border-background/50 text-background hover:border-background hover:bg-background hover:text-foreground flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all"
          aria-label="Scroll to content"
        >
          <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </section>
  );
};

export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="container mx-auto flex h-full items-center px-6">
        <div
          className={clsx(
            'w-full max-w-2xl',
            reverseLayout ? 'lg:mr-auto lg:text-right' : 'lg:ml-0 lg:text-left'
          )}
        >
          <div className="max-w-2xl">
            <div className={clsx({ shim: screenLayer })}>
              <h1 className="text-background text-3xl font-light text-balance md:text-4xl lg:text-5xl xl:text-6xl">
                <ContentSdkText field={fields.Title} />
                {!hideAccentLine && <AccentLine className="mx-auto mt-4 !h-5 w-[9ch] lg:mx-0" />}
              </h1>

              <div className="text-background/90 mt-6 max-w-xl text-sm text-pretty md:text-base lg:text-lg">
                <ContentSdkRichText
                  field={fields.Description}
                  className="text-left [&_p]:text-inherit"
                />
              </div>

              <div className="mt-8 flex w-full justify-start">
                {withPlaceholder ? (
                  <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                ) : (
                  <Link
                    field={fields.CtaLink}
                    className="border-background/50 text-background hover:border-background hover:bg-background hover:text-foreground inline-flex items-center justify-center rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};

export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <div
          className={clsx(
            'w-full max-w-2xl',
            reverseLayout ? 'lg:mr-auto lg:text-right' : 'lg:ml-0 lg:text-left'
          )}
        >
          <div className="max-w-2xl">
            <div className={clsx({ shim: screenLayer })}>
              <h1 className="text-background text-3xl font-light text-balance md:text-4xl lg:text-5xl xl:text-6xl">
                <ContentSdkText field={fields.Title} />
                {!hideAccentLine && <AccentLine className="mx-auto mt-4 !h-5 w-[9ch] lg:mx-0" />}
              </h1>

              <div className="text-background/90 mt-6 max-w-xl text-sm text-pretty md:text-base lg:text-lg">
                <ContentSdkRichText
                  field={fields.Description}
                  className="text-left [&_p]:text-inherit"
                />
              </div>

              <div className="mt-8 flex w-full justify-start">
                {withPlaceholder ? (
                  <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                ) : (
                  <Link
                    field={fields.CtaLink}
                    className="border-background/50 text-background hover:border-background hover:bg-background hover:text-foreground inline-flex items-center justify-center rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
