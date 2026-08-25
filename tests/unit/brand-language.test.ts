import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { featurePageCopy } from '../../src/content/features';
import { homeCopy } from '../../src/content/home';

const sourceExtensions = new Set(['.astro', '.ts']);

const collectSourceText = (directory: string): string =>
  readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSourceText(path);
      }

      return sourceExtensions.has(extname(entry.name))
        ? readFileSync(path, 'utf8')
        : '';
    })
    .join('\n');

describe('brand language', () => {
  it('uses a concise product name for the homepage browser title', () => {
    expect(homeCopy.en.metadata.title).toBe('Owlaria');
    expect(homeCopy.ja.metadata.title).toBe('Owlaria');
  });

  it('uses concise localized browser titles for the feature page', () => {
    expect(featurePageCopy.en.metadata.title).toBe('Features · Owlaria');
    expect(featurePageCopy.ja.metadata.title).toBe('機能 · Owlaria');
  });

  it('uses コミック consistently in Japanese source copy', () => {
    const discouragedTerm = ['マン', 'ガ'].join('');

    expect(collectSourceText(join(process.cwd(), 'src'))).not.toContain(
      discouragedTerm,
    );
  });

  it('spells the organization name as overpatch', () => {
    const incorrectName = ['Over', 'Patch'].join(' ');

    expect(collectSourceText(join(process.cwd(), 'src'))).not.toContain(
      incorrectName,
    );
  });
});
