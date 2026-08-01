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

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

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
