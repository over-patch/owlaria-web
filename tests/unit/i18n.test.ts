import { describe, expect, it } from 'vitest';

import {
  SITE_ORIGIN,
  absoluteLocaleUrl,
  alternateLocale,
  localePath,
} from '../../src/i18n/config';

describe('localePath', () => {
  it.each([
    ['en', '/', '/'],
    ['en', 'support', '/support/'],
    ['en', '/support/purchases/', '/support/purchases/'],
    ['en', '/features/', '/features/'],
    ['en', '//support', '/support/'],
    ['en', '///support///', '/support/'],
    ['en', '///', '/'],
    ['ja', '/', '/ja/'],
    ['ja', 'support', '/ja/support/'],
    ['ja', '/support/purchases/', '/ja/support/purchases/'],
    ['ja', '/features/', '/ja/features/'],
  ] as const)('maps %s %s to %s', (locale, pathname, expected) => {
    expect(localePath(locale, pathname)).toBe(expected);
  });

  it('rejects a pathname that already contains a locale prefix', () => {
    expect(() => localePath('ja', '/ja/support/')).toThrow(
      'Expected an unprefixed logical pathname',
    );
  });
});

describe('locale metadata', () => {
  it('switches between the supported locales', () => {
    expect(alternateLocale('en')).toBe('ja');
    expect(alternateLocale('ja')).toBe('en');
  });

  it('creates absolute canonical URLs with trailing slashes', () => {
    expect(SITE_ORIGIN).toBe('https://owlaria.overpatch.dev');
    expect(absoluteLocaleUrl('en', '/terms/')).toBe(
      'https://owlaria.overpatch.dev/terms/',
    );
    expect(absoluteLocaleUrl('ja', '/terms/')).toBe(
      'https://owlaria.overpatch.dev/ja/terms/',
    );
    expect(absoluteLocaleUrl('en', '//support')).toBe(
      'https://owlaria.overpatch.dev/support/',
    );
  });
});
