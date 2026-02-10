import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';

let initialized = false;

export function initCloudSdkEvents() {
  if (initialized) return;

  CloudSDK({
    sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID!,
    siteName: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME!,
  })
    .addEvents()
    .initialize();

  initialized = true;
}
