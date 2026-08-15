import { z } from 'astro/zod';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { locales, type Locale } from '../i18n/config';

const coreSemverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  return (
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value
  );
}

export const releaseFrontmatterSchema = z.strictObject({
  schemaVersion: z.literal(1),
  version: z.string().regex(coreSemverPattern),
  locale: z.enum(locales),
  publishedAt: z.string().refine(isCalendarDate, {
    message: 'Expected a valid YYYY-MM-DD calendar date',
  }),
  platforms: z.array(z.enum(['macos', 'ios'])).min(1),
});

export type ReleaseFrontmatter = z.infer<typeof releaseFrontmatterSchema>;

export type PublicReleaseEntry = {
  id: string;
  data: ReleaseFrontmatter;
  body?: string;
};

const markdownParser = unified().use(remarkParse).use(remarkGfm);

function assertPublicMarkdownDestination(destination: string): void {
  const hasUnsafeCharacter = [...destination].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return (
      character === '\\' ||
      character === '<' ||
      character === '>' ||
      character === '"' ||
      character === '`' ||
      codePoint <= 0x20 ||
      codePoint === 0x7f
    );
  });
  if (destination.length === 0 || hasUnsafeCharacter) {
    throw new Error('Unsafe release Markdown destination cannot be rendered.');
  }

  if (/^https:\/\//i.test(destination)) {
    try {
      const url = new URL(destination);
      if (
        url.protocol !== 'https:' ||
        url.hostname.length === 0 ||
        url.username.length > 0 ||
        url.password.length > 0
      ) {
        throw new Error('Unsafe HTTPS destination');
      }
      return;
    } catch {
      throw new Error(
        'Unsafe release Markdown destination cannot be rendered.',
      );
    }
  }

  if (destination.startsWith('//')) {
    throw new Error('Unsafe release Markdown destination cannot be rendered.');
  }

  const firstPathDelimiter = destination.search(/[/?#]/);
  const prefix =
    firstPathDelimiter === -1
      ? destination
      : destination.slice(0, firstPathDelimiter);
  if (prefix.includes(':')) {
    throw new Error('Unsafe release Markdown destination cannot be rendered.');
  }
}

export function assertSafeReleaseMarkdown(markdown: string): void {
  const tree = markdownParser.parse(markdown);

  visit(tree, ['html', 'link', 'image', 'definition'], (node) => {
    switch (node.type) {
      case 'html':
        throw new Error('Unsafe release Markdown cannot be rendered.');
      case 'link':
      case 'image':
      case 'definition':
        break;
      default:
        return;
    }

    assertPublicMarkdownDestination(node.url);
  });
}

export function releaseVersionFromId(id: string): string {
  const match = /^(en|ja)\/(.+)$/.exec(id);
  if (!match || !coreSemverPattern.test(match[2] ?? '')) {
    throw new Error(`Invalid release entry id: ${id}`);
  }

  return match[2];
}

function releaseLocaleFromId(id: string): Locale {
  const locale = id.split('/')[0];
  if (locale !== 'en' && locale !== 'ja') {
    throw new Error(`Invalid release entry id: ${id}`);
  }

  return locale;
}

export function validateReleaseEntries(
  entries: PublicReleaseEntry[],
  { requirePairedLocales = true }: { requirePairedLocales?: boolean } = {},
): void {
  const localesByVersion = new Map<string, Set<Locale>>();

  for (const entry of entries) {
    if (entry.body !== undefined) assertSafeReleaseMarkdown(entry.body);

    const pathLocale = releaseLocaleFromId(entry.id);
    const pathVersion = releaseVersionFromId(entry.id);

    if (entry.data.locale !== pathLocale) {
      throw new Error(
        `Release locale must agree with its content path: ${entry.id}`,
      );
    }
    if (entry.data.version !== pathVersion) {
      throw new Error(
        `Release version must agree with its content path: ${entry.id}`,
      );
    }

    const versionLocales =
      localesByVersion.get(entry.data.version) ?? new Set();
    if (versionLocales.has(entry.data.locale)) {
      throw new Error(
        `Duplicate ${entry.data.locale} release entry for ${entry.data.version}`,
      );
    }
    versionLocales.add(entry.data.locale);
    localesByVersion.set(entry.data.version, versionLocales);
  }

  if (!requirePairedLocales) return;

  for (const [version, versionLocales] of localesByVersion) {
    if (locales.some((locale) => !versionLocales.has(locale))) {
      throw new Error(
        `Release locales must be paired for version ${version} by default`,
      );
    }
  }
}

function compareSemverDescending(left: string, right: string): number {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    const difference = (rightParts[index] ?? 0) - (leftParts[index] ?? 0);
    if (difference !== 0) return difference;
  }

  return 0;
}

export function selectLocalizedReleases<TEntry extends PublicReleaseEntry>(
  entries: TEntry[],
  locale: Locale,
): TEntry[] {
  validateReleaseEntries(entries);

  return entries
    .filter((entry) => entry.data.locale === locale)
    .toSorted((left, right) =>
      compareSemverDescending(left.data.version, right.data.version),
    );
}

export function formatReleaseDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ja-JP', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}
