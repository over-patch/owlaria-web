import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/',
    heading: 'Your comics on NAS. Ready when you are.',
    principle: 'Read-Only by design',
    featureAction: 'Explore every feature',
    featureHref: '/features/',
    platformHeading: 'Owlaria, where your library lives.',
    comingSoon: 'Coming soon',
  },
  {
    path: '/ja/',
    heading: 'NASに置いた漫画を、そのまま、すぐ読む。',
    principle: '原本を守るRead-Only設計',
    featureAction: 'すべての機能を見る',
    featureHref: '/ja/features/',
    platformHeading: 'Owlariaを、あなたの本棚がある場所へ。',
    comingSoon: '近日公開',
  },
] as const) {
  test(`${locale.path} presents the localized product story`, async ({
    page,
  }) => {
    await page.goto(locale.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale.heading,
    );
    await expect(
      page.getByRole('heading', { name: locale.platformHeading }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: locale.principle }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: locale.featureAction }),
    ).toHaveAttribute('href', locale.featureHref);

    const productStory = page.locator('.product-story');
    await expect(productStory).toBeVisible();
    await expect(productStory.locator('.story-icon')).toHaveAttribute(
      'src',
      '/owlaria-app-icon.png',
    );
    await expect(page.locator('.preview-artwork')).toHaveCount(0);

    for (const id of ['macos', 'ios']) {
      const card = page.getByTestId(`platform-${id}`);
      await expect(card).toContainText(locale.comingSoon);
      await expect(card.getByRole('link')).toHaveCount(0);
    }
  });
}

test('homepage remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Your comics on NAS. Ready when you are.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Read-Only by design', exact: true }),
  ).toBeVisible();
  await context.close();
});

test('homepage uses responsive feature and platform grids', async ({
  page,
}) => {
  for (const viewport of [
    {
      width: 390,
      height: 844,
      featureColumns: 1,
      capabilityColumns: 1,
      platformColumns: 1,
    },
    {
      width: 1440,
      height: 1000,
      featureColumns: 3,
      capabilityColumns: 4,
      platformColumns: 2,
    },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    for (const [selector, expectedColumns] of [
      ['.feature-grid', viewport.featureColumns],
      ['.capability-grid', viewport.capabilityColumns],
      ['.platform-grid', viewport.platformColumns],
    ] as const) {
      const columns = await page
        .locator(selector)
        .evaluate((element) =>
          getComputedStyle(element)
            .gridTemplateColumns.split(' ')
            .filter(Boolean),
        );
      expect(columns).toHaveLength(expectedColumns);
    }

    await expect(page.locator('.product-story')).toBeVisible();
    await expect(page.getByTestId('platform-macos')).toBeVisible();
  }
});

test('reduced motion preserves every homepage section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  for (const element of await page.locator('[data-reveal]').all()) {
    await expect(element).toHaveCSS('opacity', '1');
    await expect(element).toHaveCSS('transform', 'none');
  }
});
