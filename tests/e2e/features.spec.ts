import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/features/',
    heading: 'Everything your comic library needs.',
    storageHeading: 'Keep the collection where it belongs.',
    language: '日本語',
    languageHref: '/ja/features/',
    back: 'Back to overview',
    homeHref: '/',
  },
  {
    path: '/ja/features/',
    heading: 'コミックライブラリに必要なものを、ひとつに。',
    storageHeading: 'コレクションは、いまある場所のまま。',
    language: 'English',
    languageHref: '/features/',
    back: '概要へ戻る',
    homeHref: '/ja/',
  },
] as const) {
  test(`${locale.path} presents the complete localized feature catalog`, async ({
    page,
  }) => {
    await page.goto(locale.path);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale.heading,
    );
    await expect(
      page.getByRole('heading', { name: locale.storageHeading }),
    ).toBeVisible();
    await expect(page.locator('.feature-category')).toHaveCount(6);
    await expect(page.getByText('ZIP / CBZ', { exact: true })).toBeVisible();
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      locale.languageHref,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveText(
      locale.language,
    );
    await expect(page.getByRole('link', { name: locale.back })).toHaveAttribute(
      'href',
      locale.homeHref,
    );
  });
}

test('feature catalog remains usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/features/');

  await expect(
    page.getByRole('heading', { name: 'Everything your comic library needs.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Comic viewer' }),
  ).toHaveAttribute('href', '#viewer');
  await context.close();
});

test('feature catalog is responsive without horizontal overflow', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844, columns: 1 },
    { width: 1440, height: 1000, columns: 2 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/features/');

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    const columns = await page
      .locator('.feature-category-grid')
      .first()
      .evaluate((element) =>
        getComputedStyle(element)
          .gridTemplateColumns.split(' ')
          .filter(Boolean),
      );
    expect(columns).toHaveLength(viewport.columns);
  }
});
