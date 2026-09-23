import { describe, expect, it } from 'vitest';

import {
  browserLocaleRedirectUrl,
  LOCALE_PREFERENCE_COOKIE,
  preferredSupportedLocale,
  readLocalePreference,
  serializeLocalePreference,
} from '../../src/i18n/locale-preference';

describe('browser locale preference', () => {
  it.each([
    [['ja-JP', 'en-US'], 'ja'],
    [['en-US', 'ja-JP'], 'en'],
    [['fr-FR', 'ja'], 'ja'],
    [['fr-FR'], null],
  ] as const)(
    'selects the first supported locale from %j',
    (languages, expected) => {
      expect(preferredSupportedLocale(languages)).toBe(expected);
    },
  );

  it('redirects a first Japanese-browser homepage visit and preserves the URL suffix', () => {
    expect(
      browserLocaleRedirectUrl(
        'https://owlaria.overpatch.dev/?source=bookmark#hero',
        null,
        ['ja-JP', 'en-US'],
      ),
    ).toBe('https://owlaria.overpatch.dev/ja/?source=bookmark#hero');
  });

  it.each([
    ['an explicit English preference', '/', 'owlaria_locale=en', ['ja-JP']],
    ['an explicit Japanese preference', '/', 'owlaria_locale=ja', ['ja-JP']],
    ['an English browser', '/', null, ['en-US', 'ja-JP']],
    ['an unsupported browser', '/', null, ['fr-FR']],
    ['a non-home route', '/support/', null, ['ja-JP']],
  ] as const)('does not redirect %s', (_label, path, cookie, languages) => {
    expect(
      browserLocaleRedirectUrl(
        `https://owlaria.overpatch.dev${path}`,
        cookie,
        languages,
      ),
    ).toBeNull();
  });
});

describe('locale preference cookie', () => {
  it.each([
    ['owlaria_locale=en', 'en'],
    ['session=value; owlaria_locale=ja; theme=dark', 'ja'],
  ] as const)('reads a supported locale from %s', (cookie, expected) => {
    expect(readLocalePreference(cookie)).toBe(expected);
  });

  it('continues past an invalid duplicate to a valid preference', () => {
    expect(
      readLocalePreference('owlaria_locale=invalid; owlaria_locale=en'),
    ).toBe('en');
  });

  it.each([
    null,
    '',
    'owlaria_locale=',
    'owlaria_locale=EN',
    'owlaria_locale=japanese',
    'other_locale=ja',
  ])('rejects an absent or unsupported preference from %s', (cookie) => {
    expect(readLocalePreference(cookie)).toBeNull();
  });

  it('serializes a one-year secure first-party preference', () => {
    expect(serializeLocalePreference('ja', true)).toBe(
      'owlaria_locale=ja; Max-Age=31536000; Path=/; SameSite=Lax; Secure',
    );
  });

  it('can serialize the preference for a local HTTP preview', () => {
    expect(serializeLocalePreference('en', false)).toBe(
      'owlaria_locale=en; Max-Age=31536000; Path=/; SameSite=Lax',
    );
  });

  it('exports the stable cookie name used by the website', () => {
    expect(LOCALE_PREFERENCE_COOKIE).toBe('owlaria_locale');
  });
});
