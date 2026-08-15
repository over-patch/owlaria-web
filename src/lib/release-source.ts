import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const useReleaseFixtures =
  process.env.OWLARIA_RELEASE_NOTES_FIXTURES === '1';

export const releaseBase = pathToFileURL(
  resolve(
    process.cwd(),
    useReleaseFixtures ? 'tests/fixtures/releases/' : 'src/content/releases/',
  ),
);

export const hasReleaseMarkdown = readdirSync(releaseBase, {
  recursive: true,
}).some((entry) => String(entry).endsWith('.md'));
