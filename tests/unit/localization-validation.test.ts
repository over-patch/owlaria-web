import { describe, expect, it } from 'vitest';
import { validateLocalizedCopy } from '../../src/i18n/validate-copy';

const valid = {
  en: {
    title: 'Owlaria',
    description: 'Version {version} for {platforms}',
    lines: ['Read', 'anywhere'],
  },
  ja: {
    title: 'Owlaria',
    description: '{platforms}版 {version}',
    lines: ['どこでも読む'],
  },
};

describe('localized copy validation', () => {
  it('accepts matching brands, reordered variables, and locale-specific line wrapping', () => {
    expect(validateLocalizedCopy(valid, ['en', 'ja'], 'en')).toEqual([]);
  });
  it.each([null, 7, true, 'text', []])(
    'rejects an invalid locale root %j',
    (root) => {
      expect(
        validateLocalizedCopy({ en: root, ja: valid.ja }, ['en', 'ja'], 'en'),
      ).toContain('en: invalid locale root');
    },
  );
  it('rejects empty objects including the source', () => {
    expect(
      validateLocalizedCopy(
        { en: {}, ja: { title: '読む' } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('en: empty object');
    expect(
      validateLocalizedCopy(
        { en: { metadata: {} }, ja: { metadata: {} } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('en.metadata: empty object');
  });
  it('requires every translated field to have a source', () => {
    expect(
      validateLocalizedCopy(
        { en: { title: 'Read' }, ja: { title: '読む', extra: '追加' } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('en.extra: missing field');
  });
  it('allows typed non-string metadata alongside copy', () => {
    expect(
      validateLocalizedCopy(
        {
          en: { title: 'Read', enabled: true, order: 1 },
          ja: { title: '読む', enabled: true, order: 1 },
        },
        ['en', 'ja'],
        'en',
      ),
    ).toEqual([]);
  });
  it('rejects missing locales from the configured locale list', () => {
    expect(validateLocalizedCopy(valid, ['en', 'ja', 'fr'], 'en')).toContain(
      'fr: missing locale',
    );
  });
  it('rejects missing translated fields', () => {
    expect(
      validateLocalizedCopy(
        { ...valid, ja: { title: 'Owlaria', lines: ['読む'] } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('ja.description: missing field');
  });
  it('rejects changed interpolation names', () => {
    expect(
      validateLocalizedCopy(
        { ...valid, ja: { ...valid.ja, description: '{version} {platform}' } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('ja.description: interpolation mismatch');
  });
  it('rejects empty text in any locale including the source', () => {
    expect(
      validateLocalizedCopy(
        { ...valid, en: { ...valid.en, title: ' ' } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('en.title: empty text');
  });
  it('checks object fields inside arrays and rejects empty collections', () => {
    expect(
      validateLocalizedCopy(
        {
          en: { cards: [{ title: 'Read', body: 'Books' }] },
          ja: { cards: [{ title: '読む' }] },
        },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('ja.cards[].body: missing field');
    expect(
      validateLocalizedCopy(
        { en: { lines: ['Read'] }, ja: { lines: [] } },
        ['en', 'ja'],
        'en',
      ),
    ).toContain('ja.lines: empty collection');
  });
});
