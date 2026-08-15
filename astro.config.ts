import { defineConfig } from 'astro/config';

const useReleaseFixtures = process.env.OWLARIA_RELEASE_NOTES_FIXTURES === '1';

export default defineConfig({
  output: 'static',
  site: 'https://owlaria.overpatch.dev',
  trailingSlash: 'always',
  cacheDir: useReleaseFixtures
    ? './test-results/release-fixtures-cache'
    : './node_modules/.astro',
  outDir: useReleaseFixtures
    ? './test-results/release-fixtures-site'
    : './dist',
});
