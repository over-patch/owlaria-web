import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  assertSafeReleaseMarkdown,
  releaseFrontmatterSchema,
  releaseVersionFromId,
  selectLocalizedReleases,
  validateReleaseEntries,
  type PublicReleaseEntry,
} from '../../src/lib/releases';

const validFrontmatter = {
  schemaVersion: 1,
  version: '1.2.0',
  locale: 'en',
  publishedAt: '2026-08-15',
  platforms: ['macos', 'ios'],
} as const;

function releaseEntry(
  version: string,
  locale: 'en' | 'ja',
): PublicReleaseEntry {
  return {
    id: `${locale}/${version}`,
    data: {
      ...validFrontmatter,
      version,
      locale,
      platforms: ['macos'],
    },
  };
}

describe('release frontmatter contract', () => {
  it('accepts exactly the sanitized exporter fields', () => {
    expect(releaseFrontmatterSchema.parse(validFrontmatter)).toEqual(
      validFrontmatter,
    );
  });

  it('accepts exact date strings only', () => {
    for (const publishedAt of [
      new Date('2026-08-15T00:00:00.000Z'),
      '2026-08-15T00:00:00.000Z',
    ]) {
      expect(
        releaseFrontmatterSchema.safeParse({
          ...validFrontmatter,
          publishedAt,
        }).success,
      ).toBe(false);
    }
  });

  it('keeps fixtures byte-shape compatible with quoted exporter dates and normalized headings', async () => {
    for (const fixturePath of [
      'tests/fixtures/releases/en/1.0.0.md',
      'tests/fixtures/releases/ja/1.0.0.md',
    ]) {
      const markdown = await readFile(resolve(fixturePath), 'utf8');

      expect(markdown).toMatch(/publishedAt: "\d{4}-\d{2}-\d{2}"/);
      expect(markdown).toMatch(/\n## [^#\n]/);
      expect(markdown).not.toMatch(/\n### [^#\n]/);
    }
  });

  it.each(['1.2', 'v1.2.0', '1.2.0-beta.1', '01.2.0'])(
    'rejects non-core SemVer version %s',
    (version) => {
      expect(
        releaseFrontmatterSchema.safeParse({ ...validFrontmatter, version })
          .success,
      ).toBe(false);
    },
  );

  it.each(['2026-8-15', '2026-02-30', '15-08-2026'])(
    'rejects invalid ISO publication date %s',
    (publishedAt) => {
      expect(
        releaseFrontmatterSchema.safeParse({
          ...validFrontmatter,
          publishedAt,
        }).success,
      ).toBe(false);
    },
  );

  it('rejects empty or unsupported platform values', () => {
    expect(
      releaseFrontmatterSchema.safeParse({
        ...validFrontmatter,
        platforms: [],
      }).success,
    ).toBe(false);
    expect(
      releaseFrontmatterSchema.safeParse({
        ...validFrontmatter,
        platforms: ['windows'],
      }).success,
    ).toBe(false);
  });

  it.each(['builds', 'gitTag', 'source', 'appStore'])(
    'rejects private field %s',
    (privateField) => {
      expect(
        releaseFrontmatterSchema.safeParse({
          ...validFrontmatter,
          [privateField]: 'INTERNAL_FIXTURE_DO_NOT_PUBLISH',
        }).success,
      ).toBe(false);
    },
  );
});

describe('release collection integrity', () => {
  it('requires the frontmatter locale and version to agree with the content path', () => {
    expect(() =>
      validateReleaseEntries([
        { ...releaseEntry('1.2.0', 'en'), id: 'ja/1.2.0' },
      ]),
    ).toThrow(/locale.*path/i);

    expect(() =>
      validateReleaseEntries([
        { ...releaseEntry('1.2.0', 'en'), id: 'en/1.2.1' },
      ]),
    ).toThrow(/version.*path/i);
  });

  it('requires paired English and Japanese entries by default', () => {
    expect(() => validateReleaseEntries([releaseEntry('1.2.0', 'en')])).toThrow(
      /paired.*1\.2\.0/i,
    );

    expect(() =>
      validateReleaseEntries([
        releaseEntry('1.2.0', 'en'),
        releaseEntry('1.2.0', 'ja'),
      ]),
    ).not.toThrow();
  });

  it('sorts localized releases by descending SemVer', () => {
    const entries = ['1.2.9', '2.0.0', '1.10.0'].flatMap((version) => [
      releaseEntry(version, 'en'),
      releaseEntry(version, 'ja'),
    ]);

    expect(
      selectLocalizedReleases(entries, 'en').map(({ data }) => data.version),
    ).toEqual(['2.0.0', '1.10.0', '1.2.9']);
  });

  it('extracts a version only from the expected locale/version id shape', () => {
    expect(releaseVersionFromId('en/1.2.0')).toBe('1.2.0');
    expect(() => releaseVersionFromId('1.2.0')).toThrow(/release entry id/i);
  });
});

describe('release Markdown safety', () => {
  it.each([
    '<script>alert("unsafe")</script>',
    '<div class="unsafe">Raw HTML</div>',
    '<!-- hidden raw HTML -->',
    '<!doctype html>',
  ])('rejects raw HTML before rendering: %s', (markdown) => {
    expect(() => assertSafeReleaseMarkdown(markdown)).toThrow(
      /unsafe release Markdown/i,
    );
  });

  it.each([
    '[unsafe](javascript:alert(1))',
    '![unsafe](data:text/html;base64,PHNjcmlwdD4=)',
    '[unsafe][reference]\n\n[reference]: vbscript:msgbox(1)',
    '<javascript:alert(1)>',
    '[unsafe](jav&#x61;script:alert(1))',
    '[unsafe](java&#115;cript:alert(1))',
    '[unsafe](javascript&#58;alert(1))',
    '[unsafe](mailto:private@example.com)',
    '[unsafe](//example.com/path)',
    '[unsafe](https:\\example.com/path)',
    '[outer [inner]](javascript:alert(1))',
    '[multi\nline](data:text/html;base64,PHNjcmlwdD4=)',
    '[![nested image](https://owlaria.overpatch.dev/icon.png)](vbscript:msgbox(1))',
  ])('rejects unsafe inline and reference destinations: %s', (markdown) => {
    expect(() => assertSafeReleaseMarkdown(markdown)).toThrow(
      /unsafe release Markdown/i,
    );
  });

  it.each(['http://example.com', 'www.example.com', 'private@example.com'])(
    'rejects unsafe GFM autolinks: %s',
    (markdown) => {
      expect(() => assertSafeReleaseMarkdown(markdown)).toThrow(
        /unsafe release Markdown/i,
      );
    },
  );

  it('allows a public-safe GFM HTTPS autolink', () => {
    expect(() =>
      assertSafeReleaseMarkdown('https://example.com'),
    ).not.toThrow();
  });

  it('allows character references in link labels', () => {
    expect(() =>
      assertSafeReleaseMarkdown('[R&amp;D](https://example.com)'),
    ).not.toThrow();
  });

  it('allows ordinary Markdown and treats fenced or inline code as inert', () => {
    expect(() =>
      assertSafeReleaseMarkdown(`## Highlights

[Owlaria](https://owlaria.overpatch.dev/)

<https://owlaria.overpatch.dev/>

[Root relative](/releases/1.0.0/)
[Sibling relative](./details/)
[Parent relative](../)
[Bare relative](notes/)
[Query relative](?view=compact)
[Fragment](#highlights)
[Reference][public]
[Outer [inner]](https://owlaria.overpatch.dev/nested/)
[Multi
line](/releases/)
[![Nested image](/owlaria-app-icon.png)](#highlights)

[public]: https://owlaria.overpatch.dev/releases/

\`<span>example</span>\`

\`\`\`html
<script>alert('code sample')</script>
[example](javascript:code-sample)
\`\`\``),
    ).not.toThrow();
  });

  it('applies the Markdown guard while validating collection entries', () => {
    const entries = [releaseEntry('1.2.0', 'en'), releaseEntry('1.2.0', 'ja')];
    Object.assign(entries[0], { body: '<img src=x onerror=alert(1)>' });

    expect(() => validateReleaseEntries(entries)).toThrow(
      /unsafe release Markdown/i,
    );
  });
});
