import { describe, expect, it } from 'vitest';

import { featurePageCopy } from '../../src/content/features';

describe('feature page content', () => {
  it('organizes both locales around the same four product stories', () => {
    expect(featurePageCopy.en.sections.map(({ id }) => id)).toEqual([
      'sources',
      'library',
      'viewer',
      'everyday',
    ]);
    expect(featurePageCopy.ja.sections.map(({ id }) => id)).toEqual(
      featurePageCopy.en.sections.map(({ id }) => id),
    );
  });

  it('leads with the product value established on the landing page', () => {
    expect(featurePageCopy.ja.hero.heading).toBe(
      'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    );
    expect(featurePageCopy.ja.hero.mobileLines).toEqual([
      'フォルダはそのまま。',
      '整理も、読み方も、',
      '思いどおりに。',
    ]);
    expect('highlights' in featurePageCopy.ja.hero).toBe(false);
  });

  it('publishes archive formats as individual extensions', () => {
    expect(featurePageCopy.en.formats.archive).toEqual([
      'ZIP',
      'CBZ',
      'RAR',
      'CBR',
      '7Z',
      'CB7',
      'LZH',
      'PDF',
    ]);
    expect(featurePageCopy.ja.formats.archive).toEqual(
      featurePageCopy.en.formats.archive,
    );
    expect(JSON.stringify(featurePageCopy)).not.toMatch(/EPUB/i);
  });

  it('lists exactly the password-protected archive formats that can be opened', () => {
    expect(featurePageCopy.en.formats.passwordArchive).toEqual([
      'ZIP',
      'CBZ',
      'RAR',
      'CBR',
      '7Z',
      'CB7',
    ]);
    expect(featurePageCopy.ja.formats.passwordArchive).toEqual(
      featurePageCopy.en.formats.passwordArchive,
    );
  });

  it('marks future platforms as planned and explains the free tier', () => {
    expect(featurePageCopy.en.availability.currentPlatforms).toEqual([
      'Mac',
      'iPhone',
    ]);
    expect(featurePageCopy.en.availability.futurePlatforms).toEqual([
      'Windows',
      'Android',
    ]);
    expect(featurePageCopy.ja.availability.freeNote).toBe(
      'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
    );
    expect(featurePageCopy.ja.availability.purchaseNote).toContain('買い切り');
    expect(featurePageCopy.ja.availability.futureLabel).toBe('登場予定');
  });

  it('provides clear next steps after the feature catalog', () => {
    expect(featurePageCopy.ja.availability.actions).toEqual({
      purchases: '無料範囲とPlusを見る',
      releases: 'リリース情報を見る',
      overview: '概要へ戻る',
    });
    expect(featurePageCopy.en.availability.actions).toEqual({
      purchases: 'See Free and Plus details',
      releases: 'View release information',
      overview: 'Back to overview',
    });
  });

  it('uses マンガ consistently in Japanese product copy', () => {
    expect(JSON.stringify(featurePageCopy.ja)).not.toMatch(/漫画|コミック/);
  });

  it('describes Read-Only as a design property instead of an absolute guarantee', () => {
    expect(JSON.stringify(featurePageCopy)).not.toMatch(
      /never rewrites|never modifies|一切変更|絶対に変更/i,
    );
  });

  it('limits partial remote retrieval claims to ZIP, CBZ, and PDF', () => {
    const englishSources = featurePageCopy.en.sections.find(
      ({ id }) => id === 'sources',
    );
    const japaneseSources = featurePageCopy.ja.sections.find(
      ({ id }) => id === 'sources',
    );

    expect(englishSources?.items[2]?.body).toMatch(/ZIP, CBZ, and PDF/);
    expect(japaneseSources?.items[2]?.body).toMatch(/ZIP・CBZ・PDF/);
  });
});
