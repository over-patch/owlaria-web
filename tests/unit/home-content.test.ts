import { describe, expect, it } from 'vitest';

import { homeCopy, platformAction, platforms } from '../../src/content/home';

describe('homepage content', () => {
  it('identifies NAS comic readers in both localized heroes', () => {
    expect(homeCopy.en.hero.heading).toContain('NAS');
    expect(homeCopy.ja.hero.heading).toContain('NAS');
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
  });

  it('leads with the three concrete Owlaria advantages', () => {
    expect(homeCopy.en.features.items.map(({ title }) => title)).toEqual([
      'Read-Only by design',
      'Start reading without the wait',
      'Read comics your way',
    ]);
    expect(homeCopy.ja.features.items.map(({ title }) => title)).toEqual([
      '原本を守るRead-Only設計',
      '待たずに読み始める',
      '読み方を妥協しない',
    ]);
  });

  it('uses the established design claim instead of an absolute guarantee', () => {
    expect(JSON.stringify(homeCopy)).not.toMatch(
      /never rewrites|never modifies|一切変更|絶対に変更/i,
    );
  });

  it('links the broader capability teaser to the localized feature catalog', () => {
    expect(homeCopy.en.capabilities.action).toBe('Explore every feature');
    expect(homeCopy.ja.capabilities.action).toBe('すべての機能を見る');
    expect(homeCopy.en.capabilities.items).toHaveLength(4);
    expect(homeCopy.ja.capabilities.items).toHaveLength(4);
  });

  it('keeps unavailable Store destinations as non-link data', () => {
    expect(platforms.map((platform) => platform.id)).toEqual(['macos', 'ios']);
    expect(
      platforms.map((platform) =>
        platformAction(platform, 'Store', 'Coming soon'),
      ),
    ).toEqual([
      { kind: 'pending', label: 'Coming soon' },
      { kind: 'pending', label: 'Coming soon' },
    ]);
  });

  it('creates a Store link action only when a confirmed URL exists', () => {
    expect(
      platformAction(
        {
          id: 'macos',
          symbol: 'macOS',
          storeUrl: 'https://apps.apple.com/app/owlaria/id123456789',
        },
        'Mac App Store',
        'Coming soon',
      ),
    ).toEqual({
      kind: 'link',
      label: 'Mac App Store',
      href: 'https://apps.apple.com/app/owlaria/id123456789',
    });
  });

  it('states that macOS and iOS are separate purchases in both locales', () => {
    expect(homeCopy.en.platforms.purchaseNote).toMatch(/separate purchase/i);
    expect(homeCopy.ja.platforms.purchaseNote).toContain('別々の購入');
  });
});
