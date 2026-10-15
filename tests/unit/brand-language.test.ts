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
  it('describes the product in the homepage browser title', () => {
    expect(homeCopy.en.metadata.title).toBe(
      'Owlaria — Comic Library for NAS & Local Folders',
    );
    expect(homeCopy.ja.metadata.title).toBe(
      'Owlaria — NAS・ローカル対応コミックライブラリ',
    );
  });

  it('describes NAS and local comic features in localized browser titles', () => {
    expect(featurePageCopy.en.metadata.title).toBe(
      'Features for Organizing & Reading NAS and Local Comics | Owlaria',
    );
    expect(featurePageCopy.ja.metadata.title).toBe(
      'NAS・ローカルのコミックを整理して読む機能 | Owlaria',
    );
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
