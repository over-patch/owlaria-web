import { describe, expect, it } from 'vitest';
import { defaultLocale, locales } from '../../src/i18n/config';
import { validateLocalizedCopy } from '../../src/i18n/validate-copy';

// Discover every public *Copy export so newly added content participates without
// maintaining a second list of resources or supported languages.
const modules = import.meta.glob('../../src/content/*.ts', { eager: true });
const copies = Object.entries(modules).flatMap(([path, module]) =>
  Object.entries(module as Record<string, unknown>)
    .filter(([name]) => name.endsWith('Copy'))
    .map(([name, copy]) => ({ name: `${path}:${name}`, copy })),
);

describe('all localized Web copy', () => {
  it('discovers localized resources', () =>
    expect(copies.length).toBeGreaterThan(0));
  it.each(copies)('$name is complete for configured locales', ({ copy }) => {
    expect(
      validateLocalizedCopy(
        copy as Record<string, unknown>,
        locales,
        defaultLocale,
      ),
    ).toEqual([]);
  });
});
