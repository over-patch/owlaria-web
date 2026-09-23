import { expect, test } from '@playwright/test';

const routePairs = [
  ['/', '/ja/'],
  ['/support/', '/ja/support/'],
  ['/support/purchases/', '/ja/support/purchases/'],
  ['/privacy/', '/ja/privacy/'],
  ['/terms/', '/ja/terms/'],
  ['/releases/', '/ja/releases/'],
] as const;

const origin = 'https://owlaria.overpatch.dev';

const japanesePreloadFiles = (...subsets: number[]) => [
  ...subsets.map((subset) => `noto-sans-jp-${subset}-wght-normal`),
  'noto-sans-jp-latin-wght-normal',
];

const bundledFonts = [
  {
    path: '/',
    family: 'Inter Variable',
    absentFamily: 'Noto Sans JP Variable',
    preloadFiles: ['inter-latin-wght-normal'],
  },
  {
    path: '/ja/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      90,
      93,
      106,
      107,
      108,
      109,
      110,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/features/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      88,
      93,
      96,
      100,
      102,
      103,
      104,
      105,
      106,
      109,
      110,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/support/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      94,
      100,
      101,
      102,
      103,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/support/purchases/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      88,
      100,
      103,
      104,
      108,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/privacy/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      93,
      95,
      97,
      98,
      102,
      103,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/terms/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      69,
      74,
      81,
      92,
      93,
      94,
      99,
      103,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
      119,
    ),
  },
  {
    path: '/ja/releases/',
    family: 'Noto Sans JP Variable',
    absentFamily: 'Inter Variable',
    preloadFiles: japanesePreloadFiles(
      100,
      107,
      110,
      113,
      115,
      116,
      117,
      118,
      119,
    ),
  },
] as const;

async function expectSocialMetadata(
  page: import('@playwright/test').Page,
  expectedCanonical: string,
) {
  const title = await page.title();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    title,
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    /\S+/,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    expectedCanonical,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'website',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://owlaria.overpatch.dev/social/owlaria-social.png',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
}

for (const [englishPath, japanesePath] of routePairs) {
  test(`${englishPath} renders the English localized shell`, async ({
    page,
  }) => {
    const response = await page.goto(englishPath);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${englishPath}`,
    );
    await expectSocialMetadata(page, `${origin}${englishPath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', `${origin}${englishPath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="ja"]'),
    ).toHaveAttribute('href', `${origin}${japanesePath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveAttribute('href', `${origin}${englishPath}`);
    await expect(page.getByTestId('footer-locale-switch')).toHaveAttribute(
      'href',
      japanesePath,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      japanesePath,
    );
  });

  test(`${japanesePath} renders the Japanese localized shell`, async ({
    page,
  }) => {
    const response = await page.goto(japanesePath);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${japanesePath}`,
    );
    await expectSocialMetadata(page, `${origin}${japanesePath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', `${origin}${englishPath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="ja"]'),
    ).toHaveAttribute('href', `${origin}${japanesePath}`);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveAttribute('href', `${origin}${englishPath}`);
    await expect(page.getByTestId('footer-locale-switch')).toHaveAttribute(
      'href',
      englishPath,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      englishPath,
    );
  });
}

test('locale switches remember each explicit language choice', async ({
  context,
  page,
}) => {
  await page.goto('/');
  await page.getByTestId('header-locale-switch').click();
  await expect(page).toHaveURL('/ja/');

  let preference = (await context.cookies()).find(
    ({ name }) => name === 'owlaria_locale',
  );
  expect(preference).toMatchObject({ value: 'ja', path: '/', sameSite: 'Lax' });

  await page.getByTestId('header-locale-switch').click();
  await expect(page).toHaveURL('/');

  preference = (await context.cookies()).find(
    ({ name }) => name === 'owlaria_locale',
  );
  expect(preference).toMatchObject({ value: 'en', path: '/', sameSite: 'Lax' });
});

test('a first visit from a Japanese browser opens the Japanese homepage', async ({
  context,
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', {
      configurable: true,
      value: ['ja-JP', 'en-US'],
    });
  });

  await page.goto('/?source=browser-language');

  await expect(page).toHaveURL('/ja/?source=browser-language');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  const preference = (await context.cookies()).find(
    ({ name }) => name === 'owlaria_locale',
  );
  expect(preference).toMatchObject({ value: 'ja', path: '/', sameSite: 'Lax' });
});

for (const { path, family, absentFamily, preloadFiles } of bundledFonts) {
  test(`${path} loads only its localized bundled font`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    const fontState = await page.evaluate((expectedFamily) => {
      const computedFamily = getComputedStyle(document.body).fontFamily;
      const sampleText = document.querySelector('main h1')?.textContent ?? '';
      const matchingFontFaceRules = Array.from(document.styleSheets).flatMap(
        (stylesheet) =>
          Array.from(stylesheet.cssRules).filter(
            (rule): rule is CSSFontFaceRule =>
              rule instanceof CSSFontFaceRule &&
              rule.style
                .getPropertyValue('font-family')
                .includes(expectedFamily),
          ),
      );

      return {
        computedFamily,
        fontDisplays: matchingFontFaceRules.map((rule) =>
          rule.style.getPropertyValue('font-display'),
        ),
        fontPreloads: Array.from(
          document.querySelectorAll<HTMLLinkElement>(
            'link[rel="preload"][as="font"]',
          ),
          (link) => ({
            href: link.href,
            type: link.type,
            crossOrigin: link.crossOrigin,
          }),
        ),
        registeredFamilies: [
          ...new Set(Array.from(document.fonts, (font) => font.family)),
        ],
        sampleText,
        loaded: document.fonts.check(`16px "${expectedFamily}"`, sampleText),
      };
    }, family);

    expect(
      fontState.computedFamily,
      `${path} resolved to ${fontState.computedFamily}`,
    ).toContain(family);
    expect(fontState.sampleText).not.toBe('');
    expect(fontState.loaded, `${family} did not finish loading`).toBe(true);
    expect(fontState.registeredFamilies).toContain(family);
    expect(fontState.registeredFamilies).not.toContain(absentFamily);
    expect(fontState.fontDisplays.length).toBeGreaterThan(0);
    expect(new Set(fontState.fontDisplays)).toEqual(new Set(['optional']));
    expect(fontState.fontPreloads).toEqual(
      expect.arrayContaining(
        preloadFiles.map((filename) =>
          expect.objectContaining({
            href: expect.stringContaining(filename),
            type: 'font/woff2',
            crossOrigin: 'anonymous',
          }),
        ),
      ),
    );
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('locale links remain ordinary navigation', async ({ page }) => {
    await page.goto('/ja/');

    await page.getByTestId('header-locale-switch').click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('mobile navigation stays in flow and usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const navigation = page.getByRole('navigation', {
      name: 'Primary navigation',
    });
    await expect(navigation).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
    await expect(
      navigation.getByRole('link', { name: 'Support', exact: true }),
    ).toBeVisible();
    await expect(page.locator('main h1')).toBeVisible();

    const layout = await page.evaluate(() => {
      const navigationRect = document
        .querySelector('.site-navigation')
        ?.getBoundingClientRect();
      const mainRect = document.querySelector('main')?.getBoundingClientRect();

      return {
        navigationBottom: navigationRect?.bottom ?? Number.POSITIVE_INFINITY,
        mainTop: mainRect?.top ?? Number.NEGATIVE_INFINITY,
      };
    });

    expect(layout.navigationBottom).toBeLessThanOrEqual(layout.mainTop);
  });
});

test('desktop navigation and skip link are available', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();

  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await skipLink.focus();
  await expect(skipLink).toBeVisible();
  await skipLink.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('mobile navigation opens, closes, and does not overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const button = page.locator('[data-menu-toggle]');
  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation',
  });

  await expect(button).toHaveAccessibleName('Open menu');
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(button).toHaveAccessibleName('Close menu');
  await expect(navigation).toBeVisible();
  await expect(
    navigation.getByRole('link', { name: 'Support', exact: true }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(navigation).toBeHidden();

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test('reduced motion keeps reveal content visible and effectively static', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const reveal = page.locator('[data-reveal]').first();
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveCSS('opacity', '1');
  await expect(reveal).toHaveCSS('transform', 'none');

  const durations = await reveal.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animation: style.animationDuration,
      transition: style.transitionDuration,
    };
  });

  expect(Number.parseFloat(durations.animation)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(durations.transition)).toBeLessThanOrEqual(0.00001);
});
