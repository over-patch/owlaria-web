import { describe, expect, it } from 'vitest';

import { featurePageCopy } from '../../src/content/features';

describe('feature page content', () => {
  it('keeps the English and Japanese category structure aligned', () => {
    expect(featurePageCopy.en.categories.map(({ id }) => id)).toEqual([
      'storage',
      'organization',
      'metadata',
      'viewer',
      'privacy',
      'insights',
    ]);
    expect(featurePageCopy.ja.categories.map(({ id }) => id)).toEqual(
      featurePageCopy.en.categories.map(({ id }) => id),
    );
  });

  it('publishes only the supported archive and document formats', () => {
    expect(featurePageCopy.en.formats.archive).toEqual([
      'ZIP / CBZ',
      'RAR / CBR',
      '7Z / CB7',
      'LZH',
      'PDF',
    ]);
    expect(JSON.stringify(featurePageCopy)).not.toMatch(/EPUB/i);
  });

  it('does not present future work as a current feature', () => {
    expect(JSON.stringify(featurePageCopy)).not.toMatch(
      /cloud sync|OCR|margin removal|Windows|Android/i,
    );
  });

  it('describes Read-Only as a design property instead of an absolute guarantee', () => {
    expect(JSON.stringify(featurePageCopy)).not.toMatch(
      /never rewrites|never modifies|一切変更|絶対に変更/i,
    );
  });

  it('limits partial remote retrieval claims to ZIP, CBZ, and PDF', () => {
    expect(featurePageCopy.en.categories[0]?.items[0]?.body).toMatch(
      /ZIP, CBZ, and PDF/,
    );
    expect(featurePageCopy.ja.categories[0]?.items[0]?.body).toMatch(
      /ZIP・CBZ・PDF/,
    );
  });
});
