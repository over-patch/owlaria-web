import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/',
    heading: 'Your library. Reimagined.',
    platformHeading: 'Owlaria, where your library lives.',
    comingSoon: 'Coming soon',
    previewLabel: 'Product preview in progress',
  },
  {
    path: '/ja/',
    heading: '本棚の未来を、ここから。',
    platformHeading: 'Owlariaを、あなたの本棚がある場所へ。',
    comingSoon: '近日公開',
    previewLabel: '製品プレビューを準備中',
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
    const preview = page.locator('.product-preview');
    await expect(preview).toContainText(locale.previewLabel);
    await expect(preview.locator('.preview-artwork')).toBeVisible();
    await expect(preview.locator('.preview-artwork')).toHaveAttribute(
      'src',
      '/screenshots/owlaria-library-placeholder.svg',
    );
    await expect(preview.locator('.preview-icon')).toBeVisible();
    await expect(preview.locator('.preview-icon')).toHaveAttribute(
      'src',
      '/owlaria-app-icon.png',
    );

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
    page.getByRole('heading', { name: 'Your library. Reimagined.' }),
  ).toBeVisible();
  await expect(page.getByText('One calm library')).toBeVisible();
  await context.close();
});

test('homepage uses responsive feature and platform grids', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844, featureColumns: 1, platformColumns: 1 },
    { width: 1440, height: 1000, featureColumns: 3, platformColumns: 2 },
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

    await expect(page.locator('.product-preview')).toBeVisible();
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
