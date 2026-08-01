export const SITE_ORIGIN = 'https://owlaria.overpatch.dev';

export const locales = ['en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

function normalizeLogicalPath(pathname: string): string {
  const pathBody = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const withLeadingSlash = pathBody.length === 0 ? '/' : `/${pathBody}`;

  if (/^\/(?:en|ja)(?:\/|$)/.test(withLeadingSlash)) {
    throw new Error('Expected an unprefixed logical pathname');
  }

  if (withLeadingSlash === '/') {
    return '/';
  }

  return `${withLeadingSlash}/`;
}

export function localePath(locale: Locale, pathname: string): string {
  const logicalPath = normalizeLogicalPath(pathname);

  if (locale === defaultLocale) {
    return logicalPath;
  }

  return logicalPath === '/' ? '/ja/' : `/ja${logicalPath}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ja' : 'en';
}

export function absoluteLocaleUrl(locale: Locale, pathname: string): string {
  return new URL(localePath(locale, pathname), SITE_ORIGIN).href;
}
