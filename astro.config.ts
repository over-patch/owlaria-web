import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, locales, SITE_ORIGIN } from './src/i18n/config';

const useReleaseFixtures = process.env.OWLARIA_RELEASE_NOTES_FIXTURES === '1';
const localeFontStylesheetPattern =
  /@fontsource-variable\/(?:inter|noto-sans-jp)\/wght\.css(?:\?|$)/;
const fontDisplaySwapPattern = /font-display\s*:\s*swap\b/g;
const fontDisplayOptionalPattern = /font-display\s*:\s*optional\b/;
const fontDisplayDescriptorPattern = /font-display\s*:\s*([a-z-]+)\b/g;
const fontDisplayOptional = 'font-display: optional';

export function stabilizeLocaleFontDisplay(
  code: string,
  id: string,
): string | undefined {
  if (!localeFontStylesheetPattern.test(id)) return;
  if (!code.includes('@font-face')) return;

  const stabilizedCode = code.replace(
    fontDisplaySwapPattern,
    fontDisplayOptional,
  );
  const descriptors = Array.from(
    stabilizedCode.matchAll(fontDisplayDescriptorPattern),
    ([, descriptor]) => descriptor,
  );
  if (stabilizedCode === code) {
    if (!fontDisplayOptionalPattern.test(code)) {
      throw new Error(`Expected font-display: swap in ${id}`);
    }
    if (descriptors.some((descriptor) => descriptor !== 'optional')) {
      throw new Error(`Unexpected font-display descriptor in ${id}`);
    }

    return code;
  }

  if (descriptors.some((descriptor) => descriptor !== 'optional')) {
    throw new Error(`Unexpected font-display descriptor in ${id}`);
  }

  return stabilizedCode;
}

export default defineConfig({
  output: 'static',
  site: SITE_ORIGIN,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
      },
    }),
  ],
  cacheDir: useReleaseFixtures
    ? './test-results/release-fixtures-cache'
    : './node_modules/.astro',
  outDir: useReleaseFixtures
    ? './test-results/release-fixtures-site'
    : './dist',
  vite: {
    plugins: [
      {
        name: 'owlaria-stable-font-display',
        enforce: 'pre',
        transform(code, id) {
          return stabilizeLocaleFontDisplay(code, id);
        },
      },
    ],
  },
});
