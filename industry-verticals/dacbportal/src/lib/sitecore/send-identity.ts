import { identity } from '@sitecore-cloudsdk/events/browser';

export async function sendIdentity(email: string, language = 'en') {
  const e = email.toLowerCase().trim();

  await identity({
    channel: 'WEB',
    currency: 'GBP',
    language,
    email: e,
    identifiers: [{ provider: 'email', id: e }],
  });
}
