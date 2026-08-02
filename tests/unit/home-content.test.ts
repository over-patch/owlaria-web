import { describe, expect, it } from 'vitest';

import { homeCopy, platformAction, platforms } from '../../src/content/home';

describe('homepage content', () => {
  it('publishes the required English hero and a distinct Japanese hero', () => {
    expect(homeCopy.en.hero.heading).toBe('Your library. Reimagined.');
    expect(homeCopy.ja.hero.heading).toBe('本棚の未来を、ここから。');
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
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
