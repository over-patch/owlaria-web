import { locales, type Locale } from './config';

export const LOCALE_PREFERENCE_COOKIE = 'owlaria_locale';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function preferredSupportedLocale(
  languages: readonly string[],
): Locale | null {
  for (const language of languages) {
    const baseLanguage = language.toLowerCase().split('-')[0];
    const supportedLocale = locales.find((locale) => locale === baseLanguage);
    if (supportedLocale) return supportedLocale;
  }

  return null;
}

export function browserLocaleRedirectUrl(
  currentUrl: string,
  cookieHeader: string | null,
  languages: readonly string[],
): string | null {
  const url = new URL(currentUrl);
  if (url.pathname !== '/') return null;
  if (readLocalePreference(cookieHeader)) return null;
  if (preferredSupportedLocale(languages) !== 'ja') return null;

  url.pathname = '/ja/';
  return url.href;
}

export function readLocalePreference(
  cookieHeader: string | null,
): Locale | null {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(';')) {
    const [name, ...valueParts] = cookie.trim().split('=');
    if (name !== LOCALE_PREFERENCE_COOKIE) continue;

    const value = valueParts.join('=');
    if (value === 'en' || value === 'ja') return value;
  }

  return null;
}

export function serializeLocalePreference(
  locale: Locale,
  secure = true,
): string {
  const attributes = [
    `${LOCALE_PREFERENCE_COOKIE}=${locale}`,
    `Max-Age=${ONE_YEAR_IN_SECONDS}`,
    'Path=/',
    'SameSite=Lax',
  ];

  if (secure) attributes.push('Secure');

  return attributes.join('; ');
}
