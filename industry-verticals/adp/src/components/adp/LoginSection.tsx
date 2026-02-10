'use client';

import { useState, type FormEvent, type JSX } from 'react';
import { Text, TextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs'; //useSitecore,
import { Link as SitecoreLink, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props'; // Import the login function
//import { sendIdentity } from 'src/lib/sitecore/send-identity';

/**
 * LoginSection Component
 * ADP login page with two-step flow: username first, then password.
 * Mimics the ADP "Welkom bij ADP" login screen.
 *
 * Layout:
 * - Desktop/Tablet: Gray background with geometric shapes in bottom-right corner.
 *   Centered white rounded card with ADP logo, heading, form fields, and footer links.
 * - Mobile: Full-width layout, no card container, content fills viewport.
 *
 * On successful login, sets auth-user and user-segment cookies via lib/auth.ts,
 * then redirects to homepage (or a configurable redirect URL).
 */

interface Fields {
  Title: TextField;
  UserIdLabel: TextField;
  PasswordLabel: TextField;
  RememberLabel: TextField;
  HelpLinkText: TextField;
  HelpLink: LinkField;
  SubmitButtonText: TextField;
  NextButtonText: TextField;
  LegalLink1Text: TextField;
  LegalLink1: LinkField;
  LegalLink2Text: TextField;
  LegalLink2: LinkField;
  RequirementsLinkText: TextField;
  RequirementsLink: LinkField;
  CopyrightText: TextField;
  Logo: ImageField;
  LanguageLabel: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Welkom bij ADP \u00AE' },
  UserIdLabel: { value: 'Gebruikers-ID' },
  PasswordLabel: { value: 'Wachtwoord' },
  RememberLabel: { value: 'Onthoud gebruikersnaam' },
  HelpLinkText: { value: 'Hebt u hulp nodig bij het inloggen?' },
  HelpLink: { value: { href: '/login-help' } },
  SubmitButtonText: { value: 'Inloggen' },
  NextButtonText: { value: 'Volgende' },
  LegalLink1Text: { value: 'Juridische informatie' },
  LegalLink1: { value: { href: '/legal' } },
  LegalLink2Text: { value: 'Juridische informatie' },
  LegalLink2: { value: { href: '/privacy' } },
  RequirementsLinkText: { value: 'Vereisten' },
  RequirementsLink: { value: { href: '/requirements' } },
  CopyrightText: {
    value: 'Copyright \u00A9 2000-2026 ADP, Inc. Alle rechten voorbehouden.',
  },
  LanguageLabel: { value: 'Talen' },
  Logo: {
    value: {
      src: '/images/adp-logo.png',
      alt: 'ADP Logo',
    },
  },
};

type LoginSectionProps = ComponentProps & {
  fields?: Fields;
};

const Default = (props: LoginSectionProps): JSX.Element => {
  const fields = props.fields ?? defaultFields;
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles?.trimEnd();

  const [step, setStep] = useState<'username' | 'password'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Voer uw gebruikers-ID in.');
      return;
    }
    setStep('password');
  };

  const handleLogin = async (e: FormEvent) => {
    //const { page } = useSitecore();
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Voer uw wachtwoord in.');
      return;
    }
    setIsLoading(true);
    try {
      console.log('[v0] Attempting login with username:', username);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      console.log('[v0] Login result:', result);

      if (result.success) {
        //await sendIdentity(username, page?.locale ?? 'en');
        window.location.href = '/';
      } else {
        setError(result.error || 'Ongeldige inloggegevens.');
        setStep('username');
        setPassword('');
      }
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id={id}
      className={`relative flex min-h-screen flex-col ${styles ?? ''}`}
      style={{ backgroundColor: '#e8e8e8' }}
    >
      {/* Geometric background shapes (desktop/tablet only) */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        {/* Dark navy polygon */}
        <svg
          className="absolute -right-20 bottom-0"
          width="600"
          height="400"
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="200,400 600,100 600,400" fill="#003057" />
          <polygon
            points="150,400 550,130 550,400"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
        {/* Red outlined polygon */}
        <svg
          className="absolute -right-10 -bottom-10"
          width="500"
          height="350"
          viewBox="0 0 500 350"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="100,350 500,50 500,350" fill="none" stroke="#D0271D" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8">
        {/* Card -- visible on md+ */}
        <div className="w-full max-w-130 md:rounded-xl md:bg-white md:px-12 md:py-10 md:shadow-lg">
          {/* Top bar: lock + language */}
          <div className="mb-6 flex items-center justify-between">
            {/* Lock icon */}
            <svg
              className="text-background-muted-dark hidden h-5 w-5 md:block"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 118 0v4" />
            </svg>
            {/* Language selector */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm font-medium text-[#0072CE] hover:underline"
              >
                <Text field={fields.LanguageLabel} />
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 z-20 mt-1 w-40 rounded border border-gray-200 bg-white py-1 text-sm shadow-lg">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-[#333] hover:bg-gray-50"
                    onClick={() => setLangOpen(false)}
                  >
                    Nederlands
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-[#333] hover:bg-gray-50"
                    onClick={() => setLangOpen(false)}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-[#333] hover:bg-gray-50"
                    onClick={() => setLangOpen(false)}
                  >
                    Fran&ccedil;ais
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ADP Logo */}
          <div className="mb-6 flex justify-center">
            <SitecoreImage field={fields.Logo} alt="ADP Logo" className="h-20 w-auto" />
          </div>

          {/* Heading */}
          <h1 className="mb-8 text-center text-xl font-bold text-[#333] md:text-2xl">
            <Text field={fields.Title} />
          </h1>

          {/* Form */}
          <form onSubmit={step === 'username' ? handleNextStep : handleLogin}>
            {step === 'username' ? (
              <div className="mb-6">
                <label
                  htmlFor="login-userid"
                  className="mb-1.5 block text-sm font-medium text-[#333]"
                >
                  <Text field={fields.UserIdLabel} />
                </label>
                <input
                  id="login-userid"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  className="w-full rounded border border-gray-400 bg-white px-3 py-2.5 text-sm text-[#333] transition-colors outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE]"
                />
              </div>
            ) : (
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-background-muted-dark text-sm">{username}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('username');
                      setPassword('');
                      setError('');
                    }}
                    className="text-sm text-[#0072CE] hover:underline"
                  >
                    Wijzigen
                  </button>
                </div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-medium text-[#333]"
                >
                  <Text field={fields.PasswordLabel} />
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  className="w-full rounded border border-gray-400 bg-white px-3 py-2.5 text-sm text-[#333] transition-colors outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE]"
                />
              </div>
            )}

            {/* Remember username checkbox */}
            {step === 'username' && (
              <div className="mb-8 flex items-center gap-2">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberUser}
                  onChange={(e) => setRememberUser(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-400 text-[#0072CE] focus:ring-[#0072CE]"
                />
                <label htmlFor="login-remember" className="text-sm text-[#333]">
                  <Text field={fields.RememberLabel} />
                </label>
                {/* Tooltip icon */}
                <span
                  className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0072CE] text-[10px] font-bold text-white"
                  title="Uw gebruikersnaam wordt bewaard in een cookie."
                  aria-label="Info over onthoud gebruikersnaam"
                >
                  ?
                </span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-[#D0271D]" role="alert">
                {error}
              </div>
            )}

            {/* Spacer to push button + help to bottom (like the screenshots) */}
            <div className="min-h-20 md:min-h-30" />

            {/* Bottom actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Help link -- mobile: below button, desktop: left */}
              <SitecoreLink
                field={fields.HelpLink}
                className="order-2 text-center text-sm text-[#0072CE] underline hover:text-[#005ba1] md:order-1 md:text-left"
              >
                <Text field={fields.HelpLinkText} />
              </SitecoreLink>
              {/* Submit / Next button */}
              <button
                type="submit"
                disabled={isLoading}
                className="order-1 w-full rounded-md px-8 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 md:order-2 md:w-auto"
                style={{ backgroundColor: isLoading ? '#999' : '#b5a58a' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Laden...
                  </span>
                ) : step === 'username' ? (
                  <Text field={fields.NextButtonText} />
                ) : (
                  <Text field={fields.SubmitButtonText} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 border-t border-gray-300 bg-white px-4 py-4 md:bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 md:flex-row md:gap-6">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <SitecoreLink
              field={fields.LegalLink1}
              className="flex items-center gap-1 text-xs text-[#0072CE] underline"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <Text field={fields.LegalLink1Text} />
            </SitecoreLink>
            <SitecoreLink
              field={fields.LegalLink2}
              className="flex items-center gap-1 text-xs text-[#0072CE] underline"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <Text field={fields.LegalLink2Text} />
            </SitecoreLink>
            <SitecoreLink
              field={fields.RequirementsLink}
              className="flex items-center gap-1 text-xs text-[#0072CE] underline"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <Text field={fields.RequirementsLinkText} />
            </SitecoreLink>
          </div>
          <p className="text-background-muted-dark text-xs md:ml-auto">
            <Text field={fields.CopyrightText} />
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Default;
