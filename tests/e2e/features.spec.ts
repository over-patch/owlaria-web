import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/features/',
    heading: 'Keep your folders. Organize and read your way.',
    desktopLines: ['Keep your folders.', 'Organize and read your way.'],
    mobileLines: ['Keep your folders.', 'Organize and read', 'your way.'],
    sourcesHeading: 'Connect your folders. Keep your storage clean.',
    viewerLabel: 'Comic viewer',
    language: '日本語',
    languageHref: '/ja/features/',
    back: 'Back to overview',
    homeHref: '/',
    freeNote: 'Core features are free to use.',
  },
  {
    path: '/ja/features/',
    heading: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    desktopLines: ['フォルダはそのまま。', '整理も、読み方も、思いどおりに。'],
    mobileLines: [
      'フォルダはそのまま。',
      '整理も、読み方も、',
      '思いどおりに。',
    ],
    sourcesHeading: 'フォルダをつなぐ。保存先は汚さない。',
    viewerLabel: 'マンガビューア',
    language: 'English',
    languageHref: '/features/',
    back: '概要へ戻る',
    homeHref: '/ja/',
    freeNote: 'Owlariaの基本機能は無料で利用できます。',
  },
] as const) {
  test(`${locale.path} presents value-led feature stories`, async ({
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
      page.getByRole('heading', { name: locale.sourcesHeading }),
    ).toBeVisible();
    await expect(page.locator('.feature-story')).toHaveCount(4);
    await expect(page.locator('.feature-source-node')).toHaveCount(3);
    await expect(page.getByTestId('feature-product-preview')).toHaveCount(2);
    await expect(page.locator('.feature-reader-mode-group')).toHaveCount(3);
    const archiveFormats = page
      .locator('.feature-format-panel > section')
      .first();
    await expect(
      archiveFormats.getByText('ZIP', { exact: true }),
    ).toBeVisible();
    await expect(
      archiveFormats.getByText('CBZ', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Windows', { exact: true })).toBeVisible();
    await expect(page.getByText('Android', { exact: true })).toBeVisible();
    await expect(
      page.getByText(locale.freeNote, { exact: true }),
    ).toBeVisible();
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

test('feature stories remain usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/features/');

  await expect(
    page.getByRole('heading', {
      name: 'Keep your folders. Organize and read your way.',
    }),
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
      name: 'フォルダをつなぐ。保存先は汚さない。',
      lines: ['フォルダをつなぐ。', '保存先は汚さない。'],
    },
    {
      name: '何千冊の中から、読みたい一冊へ。',
      lines: ['何千冊の中から、', '読みたい一冊へ。'],
    },
    {
      name: 'マンガに合わせて読み方を選択',
      lines: ['マンガに合わせて', '読み方を選択'],
    },
    {
      name: '続きから読む。読書の傾向もわかる。',
      lines: ['続きから読む。', '読書の傾向もわかる。'],
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
    '.feature-story-heading [data-headline-variant="mobile"] > span',
  );
  expect(
    await mobileLines.evaluateAll((lines) =>
      lines.every((line) => line.scrollWidth <= line.clientWidth),
    ),
  ).toBe(true);
});

test('feature page is responsive without overlap or horizontal overflow', async ({
  page,
}) => {
  for (const pathname of ['/features/', '/ja/features/']) {
    for (const viewport of [
      { width: 390, height: 844, columns: 1 },
      { width: 768, height: 1024, columns: 1 },
      { width: 1024, height: 900, columns: 2 },
      { width: 1440, height: 1000, columns: 2 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(pathname);

      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);

      const storyColumns = await page
        .locator('.feature-story-layout')
        .evaluateAll((layouts) =>
          layouts.map(
            (layout) =>
              getComputedStyle(layout)
                .gridTemplateColumns.split(' ')
                .filter(Boolean).length,
          ),
        );
      expect(storyColumns.every((count) => count === viewport.columns)).toBe(
        true,
      );

      if (viewport.columns === 1) {
        for (const story of await page
          .locator(
            '.feature-story:has([data-testid="feature-product-preview"])',
          )
          .all()) {
          const headingBox = await story
            .locator('.feature-story-heading')
            .boundingBox();
          const previewBox = await story
            .getByTestId('feature-product-preview')
            .boundingBox();

          expect(headingBox).not.toBeNull();
          expect(previewBox).not.toBeNull();
          expect(previewBox!.y).toBeGreaterThanOrEqual(
            headingBox!.y + headingBox!.height,
          );
        }
      } else {
        const previewRatios = await page
          .getByTestId('feature-product-preview')
          .evaluateAll((previews) =>
            previews.map((preview) => getComputedStyle(preview).aspectRatio),
          );
        expect(previewRatios.every((ratio) => ratio === '16 / 10')).toBe(true);
      }
    }
  }
});
