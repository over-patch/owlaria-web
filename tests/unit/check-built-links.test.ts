import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { checkBuiltLinks } from '../../scripts/check-built-links.mjs';

const temporaryDirectories: string[] = [];

async function createDist(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), 'owlaria-built-links-'));
  temporaryDirectories.push(directory);

  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      const target = join(directory, path);
      await mkdir(join(target, '..'), { recursive: true });
      await writeFile(target, contents);
    }),
  );

  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true })),
  );
});

describe('checkBuiltLinks', () => {
  it('accepts root-relative pages, assets, and same-page fragments that exist', async () => {
    const distDirectory = await createDist({
      'index.html':
        '<a href="/">Home</a><a href="/support/">Support</a><img src="/images/logo.png" />',
      'support/index.html':
        '<a href="#contact">Contact</a><h2 id="contact">Contact</h2>',
      'images/logo.png': 'PNG',
    });

    await expect(checkBuiltLinks(distDirectory)).resolves.toEqual([]);
  });

  it('reports every missing target, escaping path, and missing same-page fragment', async () => {
    const distDirectory = await createDist({
      'index.html': [
        '<a href="/missing/">Missing page</a>',
        '<img src="/images/missing.png" />',
        '<a href="/../../outside/">Outside</a>',
        '<a href="#missing">Missing fragment</a>',
      ].join(''),
    });

    await expect(checkBuiltLinks(distDirectory)).resolves.toEqual([
      expect.stringContaining('/missing/'),
      expect.stringContaining('/images/missing.png'),
      expect.stringContaining('/../../outside/'),
      expect.stringContaining('#missing'),
    ]);
  });

  it('rejects a page path without a trailing slash when it resolves to a directory', async () => {
    const distDirectory = await createDist({
      'index.html': '<a href="/support">Support</a>',
      'support/index.html': '<h1>Support</h1>',
    });

    await expect(checkBuiltLinks(distDirectory)).resolves.toEqual([
      expect.stringContaining('missing target: /support'),
    ]);
  });
});
