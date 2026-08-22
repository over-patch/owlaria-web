import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/features/',
    heading: 'Everything your comic library needs.',
    desktopLines: ['Everything your', 'comic library needs.'],
    mobileLines: ['Everything', 'your comic', 'library needs.'],
    storageHeading: 'Keep the collection where it belongs.',
    language: '日本語',
    languageHref: '/ja/features/',
    back: 'Back to overview',
    homeHref: '/',
  },
  {
    path: '/ja/features/',
    heading: 'コミックライブラリに必要なものを、ひとつに。',
    desktopLines: ['コミックライブラリに', '必要なものを、ひとつに。'],
    mobileLines: ['コミック', 'ライブラリに', '必要なものを、', 'ひとつに。'],
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

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveAccessibleName(locale.heading);
    await expect(
      heading.locator('[data-headline-variant="desktop"] > span'),
    ).toHaveText(locale.desktopLines);
    await expect(
      heading.locator('[data-headline-variant="mobile"] > span'),
    ).toHaveText(locale.mobileLines);
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

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileLines = heading.locator(
      '[data-headline-variant="mobile"] > span',
    );
    await expect(mobileLines.first()).toBeVisible();
    expect(
      await mobileLines.evaluateAll((lines) =>
        lines.every(
          (line) =>
            line.scrollWidth <= line.clientWidth &&
            line.getBoundingClientRect().height <=
              Number.parseFloat(getComputedStyle(line).lineHeight) + 1,
        ),
      ),
    ).toBe(true);
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

test('Japanese feature headings use intentional phrase breaks', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1332, height: 900 });
  await page.goto('/ja/features/');

  for (const { name, lines } of [
    {
      name: 'コレクションは、いまある場所のまま。',
      lines: ['コレクションは、', 'いまある場所のまま。'],
    },
    {
      name: '何千冊の中から、一冊を見つける。',
      lines: ['何千冊の中から、', '一冊を見つける。'],
    },
    {
      name: '自由に整理する。原本は書き換えない。',
      lines: ['自由に整理する。', '原本は書き換えない。'],
    },
    {
      name: '操作ではなく、ページを主役に。',
      lines: ['操作ではなく、', 'ページを主役に。'],
    },
    {
      name: 'ライブラリを中心に考えた保護。',
      lines: ['ライブラリを中心に', '考えた保護。'],
    },
    {
      name: '物語へ戻る。読書の全体も見渡す。',
      lines: ['物語へ戻る。', '読書の全体も見渡す。'],
    },
  ]) {
    await expect(
      page
        .getByRole('heading', { name })
        .locator('[data-headline-variant="desktop"] > span'),
    ).toHaveText(lines);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileLines = page.locator(
    '.feature-category-heading [data-headline-variant="mobile"] > span',
  );
  expect(
    await mobileLines.evaluateAll((lines) =>
      lines.every((line) => line.scrollWidth <= line.clientWidth),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
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
