import { describe, expect, it } from 'vitest';

import { homeCopy, platforms, platformHref } from '../../src/content/home';

describe('homepage content', () => {
  it('publishes the required English hero and a distinct Japanese hero', () => {
    expect(homeCopy.en.hero.heading).toBe('Your library. Reimagined.');
    expect(homeCopy.ja.hero.heading).toBe('本棚の未来を、ここから。');
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
  });

  it('keeps unavailable Store destinations as non-link data', () => {
    expect(platforms.map(platformHref)).toEqual([undefined, undefined]);
    expect(platforms.map((platform) => platform.id)).toEqual(['macos', 'ios']);
  });

  it('states that macOS and iOS are separate purchases in both locales', () => {
    expect(homeCopy.en.platforms.purchaseNote).toMatch(/separate purchase/i);
    expect(homeCopy.ja.platforms.purchaseNote).toContain('別々の購入');
  });
});
