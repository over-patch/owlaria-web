import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { hasReleaseMarkdown, releaseBase } from './lib/release-source';
import { releaseFrontmatterSchema } from './lib/releases';

const releaseLoader = hasReleaseMarkdown
  ? glob({
      pattern: '**/*.md',
      base: releaseBase,
      generateId: ({ entry }) => entry.replace(/\.md$/, ''),
      deferRender: true,
    })
  : () => [];

const releases = defineCollection({
  loader: releaseLoader,
  schema: releaseFrontmatterSchema,
});

export const collections = { releases };
