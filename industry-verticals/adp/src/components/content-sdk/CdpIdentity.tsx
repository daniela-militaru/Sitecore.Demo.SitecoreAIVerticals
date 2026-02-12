import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect } from 'react';
import { identity } from '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';
import { JSX } from 'react';

/**
 * This is the CDP page view component.
 * It uses the Sitecore Cloud SDK to enable page view events on the client-side.
 * See Sitecore Cloud SDK documentation for details.
 * https://www.npmjs.com/package/@sitecore-cloudsdk/events
 */
const CdpIdentity = (user: string, firstName: string, lastName: string): JSX.Element => {
  const {
    page: { layout, siteName, mode },
  } = useSitecore();
  const { route, context } = layout.sitecore;

  /**
   * Determines if the page view events should be turned off.
   * IMPORTANT: You should implement based on your cookie consent management solution of choice.
   * By default it is disabled in development mode
   */
  const disabled = () => {
    return process.env.NODE_ENV === 'development';
  };

  useEffect(() => {
    // Do not create events in editing or preview mode or if missing route data
    if (!mode.isNormal || !route?.itemId) {
      return;
    }
    // Do not create events if disabled (e.g. we don't have consent)
    if (disabled()) {
      return;
    }

    const language = route.itemLanguage || config.defaultLanguage;

    // there can be cases where Events are not initialized which are expected to reject
    identity({
      channel: 'WEB',
      currency: 'USD',
      page: route.name,
      language,
      email: user,
      firstName: firstName,
      lastName: lastName,
      identifiers: [
        {
          id: user,
          provider: 'test-provider',
        },
      ],
    }).catch((e) => console.debug(e));
  }, [mode, route, context.variantId, siteName]);

  return <></>;
};

export default CdpIdentity;
