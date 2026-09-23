import { describe, expect, it } from 'vitest';

import {
  LOCALE_PREFERENCE_COOKIE,
  readLocalePreference,
  serializeLocalePreference,
} from '../../src/i18n/locale-preference';

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

  it('exports the stable cookie name used by the edge and website', () => {
    expect(LOCALE_PREFERENCE_COOKIE).toBe('owlaria_locale');
  });
});
