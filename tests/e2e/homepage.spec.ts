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
    await expect(preview.locator('img')).toBeVisible();
    await expect(preview.locator('img')).toHaveAttribute(
      'src',
      '/screenshots/owlaria-library-placeholder.svg',
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
