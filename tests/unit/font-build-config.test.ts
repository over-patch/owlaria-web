import { describe, expect, test } from 'vitest';

import { stabilizeLocaleFontDisplay } from '../../astro.config';

describe('stabilizeLocaleFontDisplay', () => {
  test('normalizes locale font descriptors despite whitespace differences', () => {
    expect(
      stabilizeLocaleFontDisplay(
        '@font-face { font-display:\n  swap; }',
        '/node_modules/@fontsource-variable/noto-sans-jp/wght.css?url',
      ),
    ).toBe('@font-face { font-display: optional; }');
  });

  test('fails the build when a locale font stylesheet cannot be normalized', () => {
    expect(() =>
      stabilizeLocaleFontDisplay(
        '@font-face { font-display: fallback; }',
        '/node_modules/@fontsource-variable/inter/wght.css?url',
      ),
    ).toThrow('Expected font-display: swap');
  });

  test('rejects mixed font-display descriptors after normalization', () => {
    expect(() =>
      stabilizeLocaleFontDisplay(
        '@font-face { font-display: swap; } @font-face { font-display: fallback; }',
        '/node_modules/@fontsource-variable/inter/wght.css?url',
      ),
    ).toThrow('Unexpected font-display descriptor');
  });

  test('rejects unexpected descriptors beside an already optional face', () => {
    expect(() =>
      stabilizeLocaleFontDisplay(
        '@font-face { font-display: optional; } @font-face { font-display: fallback; }',
        '/node_modules/@fontsource-variable/inter/wght.css?url',
      ),
    ).toThrow('Unexpected font-display descriptor');
  });

  test('keeps an already stabilized locale stylesheet unchanged', () => {
    const css = '@font-face { font-display: optional; }';

    expect(
      stabilizeLocaleFontDisplay(
        css,
        '/node_modules/@fontsource-variable/inter/wght.css?url',
      ),
    ).toBe(css);
  });

  test('ignores a processed URL module for the same stylesheet id', () => {
    expect(
      stabilizeLocaleFontDisplay(
        'export default "/_astro/wght.hash.css";',
        '/node_modules/@fontsource-variable/inter/wght.css?url',
      ),
    ).toBeUndefined();
  });

  test('ignores unrelated stylesheets', () => {
    expect(
      stabilizeLocaleFontDisplay(
        '@font-face { font-display: swap; }',
        '/src/styles/global.css',
      ),
    ).toBeUndefined();
  });
});
