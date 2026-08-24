import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/features/',
    heading: 'Keep your folders. Organize and read your way.',
    desktopLines: ['Keep your folders.', 'Organize and read your way.'],
    mobileLines: ['Keep your folders.', 'Organize and read', 'your way.'],
    sourcesHeading: 'Connect your folders. Keep your storage clean.',
    viewerLabel: 'Comic viewer',
    temporaryViewerHeading: 'No library required. Just open and read.',
    temporaryViewerBody:
      'Open a single comic from your usual folders without creating a library.',
    temporaryViewerMethods: [
      'Open from Finder',
      'Drag and drop',
      'Resume later',
    ],
    temporaryViewerFinderBody:
      'Associate ZIP or CBZ files with Owlaria, then double-click to open.',
    implementationBackedFeatures: [
      'Read metadata from file names',
      'Build series from folders',
      'Zoom in naturally',
    ],
    language: '日本語',
    languageHref: '/ja/features/',
    freeNote: 'Use every feature free with one library and up to 100 books.',
    actions: [
      { name: 'See Free and Plus details', href: '/support/purchases/' },
      { name: 'View release information', href: '/releases/' },
      { name: 'Back to overview', href: '/' },
    ],
  },
  {
    path: '/ja/features/',
    heading: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    desktopLines: [
      'フォルダはそのまま。',
      '整理も、読み方も、',
      '思いどおりに。',
    ],
    mobileLines: [
      'フォルダはそのまま。',
      '整理も、読み方も、',
      '思いどおりに。',
    ],
    sourcesHeading: 'フォルダをつなぐ。保存先は汚さない。',
    viewerLabel: 'マンガビューア',
    temporaryViewerHeading: 'ライブラリを作らず、そのまま読む。',
    temporaryViewerBody:
      'ライブラリを作らず、いつものフォルダから一冊だけ開く単体ビューアとしても使えます。',
    temporaryViewerMethods: [
      'Finderから直接',
      'ドラッグ＆ドロップ',
      '続きから再開',
    ],
    temporaryViewerFinderBody:
      'ZIP・CBZなどを関連付け、ダブルクリックで開けます。',
    implementationBackedFeatures: [
      'ファイル名から整理情報を読み取る',
      'フォルダからシリーズを作る',
      '細部まで、自然に拡大',
    ],
    language: 'English',
    languageHref: '/features/',
    freeNote: 'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
    actions: [
      { name: '無料範囲とPlusを見る', href: '/ja/support/purchases/' },
      { name: 'リリース情報を見る', href: '/ja/releases/' },
      { name: '概要へ戻る', href: '/ja/' },
    ],
  },
] as const) {
  test(`${locale.path} presents value-led feature stories`, async ({
    page,
  }) => {
    await page.goto(locale.path);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveAccessibleName(locale.heading);
    await expect(page.locator('.feature-hero-highlights')).toHaveCount(0);
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
    await expect(page.locator('.feature-source-icon')).toHaveCount(3);
    await expect(page.locator('.feature-source-icon-server')).toHaveCount(2);
    await expect(page.locator('.feature-source-icon-folder')).toHaveCount(1);
    await expect(page.locator('.feature-source-connector > svg')).toHaveCount(
      1,
    );
    await expect(page.getByTestId('feature-product-preview')).toHaveCount(2);
    await expect(page.locator('.feature-reader-mode-group')).toHaveCount(3);
    await expect(page.locator('.feature-reader-mode-visual')).toHaveCount(0);
    await expect(
      page.locator('.feature-reader-mode-heading').filter({
        has: page.locator('.feature-reader-mode-icon'),
      }),
    ).toHaveCount(3);
    await expect(
      page.locator('.feature-reader-mode-icon .lucide-infinity'),
    ).toHaveCount(1);
    await expect(page.locator('.feature-temporary-method-icon')).toHaveCount(3);
    await expect(page.locator('#library .feature-card-icon')).toHaveCount(8);
    await expect(page.locator('#everyday .feature-card-icon')).toHaveCount(4);
    await expect(page.locator('.feature-format-row')).toHaveCount(2);
    await expect(
      page.locator('.feature-archive-formats .feature-format-badge-lock'),
    ).toHaveCount(0);
    await expect(page.locator('.feature-password-formats')).toHaveCount(0);
    await expect(
      page.locator(
        '.feature-archive-formats .feature-format-values > .feature-format-badges + .feature-format-support-note',
      ),
    ).toHaveCount(1);
    await expect(page.locator('.feature-image-formats')).not.toHaveAttribute(
      'open',
    );
    await expect(
      page.locator('.feature-image-formats .feature-format-badge'),
    ).toHaveCount(7);
    await expect(
      page.locator('.feature-image-formats .feature-format-badges-secondary'),
    ).toHaveCount(0);
    await expect(
      page.locator('.feature-temporary-method-heading').filter({
        has: page.locator('.feature-temporary-method-icon'),
      }),
    ).toHaveCount(3);
    await expect(
      page.locator('.feature-card-heading').filter({
        has: page.locator('.feature-card-icon'),
      }),
    ).toHaveCount(12);
    const temporaryViewer = page.locator('#viewer .feature-temporary-viewer');
    await expect(temporaryViewer).toBeVisible();
    await expect(
      temporaryViewer.getByRole('heading', {
        name: locale.temporaryViewerHeading,
      }),
    ).toBeVisible();
    await expect(
      temporaryViewer.getByText(locale.temporaryViewerBody, { exact: false }),
    ).toBeVisible();
    await expect(
      temporaryViewer.locator('.feature-temporary-viewer-methods h4'),
    ).toHaveText(locale.temporaryViewerMethods);
    await expect(
      temporaryViewer.locator('.feature-temporary-file-stack > span'),
    ).toHaveText(['CBZ', 'RAR', 'ZIP']);
    await expect(
      temporaryViewer.getByText(locale.temporaryViewerFinderBody, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      temporaryViewer.locator('.feature-temporary-viewer-formats'),
    ).toHaveCount(0);
    for (const feature of locale.implementationBackedFeatures) {
      await expect(
        page.getByRole('heading', { name: feature, exact: true }),
      ).toBeVisible();
    }
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
    for (const action of locale.actions) {
      await expect(
        page.getByRole('link', { name: action.name }),
      ).toHaveAttribute('href', action.href);
    }
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      locale.languageHref,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveText(
      locale.language,
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

test('Japanese feature page keeps supporting copy concise', async ({
  page,
}) => {
  await page.goto('/ja/features/');

  await expect(page.locator('main > .closing-section')).toHaveCount(0);

  const cardBodyLengths = await page
    .locator('.feature-story-grid p')
    .evaluateAll((paragraphs) =>
      paragraphs.map((paragraph) => paragraph.textContent?.length ?? 0),
    );
  expect(Math.max(...cardBodyLengths)).toBeLessThanOrEqual(45);

  const sectionBodyLengths = await page
    .locator('.feature-story-heading > p:last-child')
    .evaluateAll((paragraphs) =>
      paragraphs.map((paragraph) => paragraph.textContent?.length ?? 0),
    );
  expect(Math.max(...sectionBodyLengths)).toBeLessThanOrEqual(45);

  const temporaryViewerBody = await page
    .locator('.feature-temporary-viewer-intro header > p:last-child')
    .textContent();
  expect(temporaryViewerBody?.length ?? 0).toBeLessThanOrEqual(45);
});

test('feature page is responsive without overlap or horizontal overflow', async ({
  page,
}) => {
  for (const pathname of ['/features/', '/ja/features/']) {
    for (const viewport of [
      { width: 390, height: 844, columns: 1, jumpColumns: 1 },
      { width: 768, height: 1024, columns: 1, jumpColumns: 1 },
      { width: 820, height: 1024, columns: 1, jumpColumns: 2 },
      { width: 1024, height: 900, columns: 1, jumpColumns: 4 },
      { width: 1075, height: 900, columns: 1, jumpColumns: 4 },
      { width: 1150, height: 900, columns: 1, jumpColumns: 4 },
      { width: 1200, height: 900, columns: 1, jumpColumns: 4 },
      { width: 1280, height: 900, columns: 2, jumpColumns: 4 },
      { width: 1440, height: 1000, columns: 2, jumpColumns: 4 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(pathname);
      await page.evaluate(() => document.fonts.ready);

      const pageWidth = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        pageWidth.scrollWidth,
        `${pathname} overflowed at ${viewport.width}px: ${JSON.stringify(pageWidth)}`,
      ).toBeLessThanOrEqual(pageWidth.clientWidth);

      const heroLineMetrics = await page
        .locator('.features-hero h1')
        .evaluate((heroHeading) => {
          const heroBox = heroHeading.getBoundingClientRect();
          const lines = [
            ...heroHeading.querySelectorAll<HTMLElement>(
              ':scope > span > span',
            ),
          ].filter(
            (line) => getComputedStyle(line.parentElement!).display !== 'none',
          );

          return lines.map((line) => {
            const box = line.getBoundingClientRect();
            return {
              text: line.textContent?.trim() ?? '',
              clientWidth: line.clientWidth,
              scrollWidth: line.scrollWidth,
              right: Math.round(box.right * 100) / 100,
              heroRight: Math.round(heroBox.right * 100) / 100,
              fits:
                line.scrollWidth <= line.clientWidth &&
                box.right <= heroBox.right + 1,
            };
          });
        });
      expect(
        heroLineMetrics.every(({ fits }) => fits),
        `${pathname} hero lines did not fit at ${viewport.width}px: ${JSON.stringify(heroLineMetrics)}`,
      ).toBe(true);

      if (viewport.width === 1075) {
        const heroVisuals = await page
          .locator('.features-hero')
          .evaluate((hero) => ({
            overflow: getComputedStyle(hero).overflow,
            backgroundImage: getComputedStyle(hero, '::before').backgroundImage,
            maskImage: getComputedStyle(hero, '::before').maskImage,
          }));
        expect(heroVisuals.overflow).toBe('visible');
        expect(heroVisuals.backgroundImage).toContain('85, 124, 255');
        expect(heroVisuals.backgroundImage).not.toContain('166, 108, 255');
        expect(heroVisuals.maskImage).toBe('none');
      }

      const jumpColumns = await page
        .locator('.feature-jump-nav ol')
        .evaluate(
          (navigation) =>
            getComputedStyle(navigation)
              .gridTemplateColumns.split(' ')
              .filter(Boolean).length,
        );
      expect(jumpColumns).toBe(viewport.jumpColumns);

      const sourceCardColumns = await page
        .locator('.feature-story-sources .feature-story-grid')
        .evaluate(
          (grid) =>
            getComputedStyle(grid)
              .gridTemplateColumns.split(' ')
              .filter(Boolean).length,
        );
      expect(sourceCardColumns).toBe(viewport.width <= 768 ? 1 : 2);

      if (viewport.width === 390) {
        const heroBox = await page.locator('.features-hero').boundingBox();
        const heroHeadingBox = await page
          .locator('.features-hero h1')
          .boundingBox();
        expect(heroBox).not.toBeNull();
        expect(heroHeadingBox).not.toBeNull();
        expect(heroBox!.x).toBe(0);
        expect(heroBox!.width).toBe(viewport.width);
        expect(heroHeadingBox!.x).toBeGreaterThanOrEqual(20);
        expect(
          viewport.width - (heroHeadingBox!.x + heroHeadingBox!.width),
        ).toBeGreaterThanOrEqual(20);
        const heroGlowMask = await page
          .locator('.features-hero')
          .evaluate((hero) => getComputedStyle(hero, '::before').maskImage);
        expect(heroGlowMask).toContain('linear-gradient');
        await expect(
          page.locator('.feature-archive-formats .feature-format-badges'),
        ).toHaveCSS('display', 'flex');
        const temporaryDiagramColumns = await page
          .locator('.feature-temporary-viewer-diagram')
          .evaluate(
            (diagram) =>
              getComputedStyle(diagram)
                .gridTemplateColumns.split(' ')
                .filter(Boolean).length,
          );
        expect(temporaryDiagramColumns).toBe(1);
      }

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

        const libraryStory = page.locator('.feature-story-preview');
        const libraryHeadingBox = await libraryStory
          .locator('.feature-story-heading')
          .boundingBox();
        const libraryPreviewBox = await libraryStory
          .getByTestId('feature-product-preview')
          .boundingBox();
        expect(libraryHeadingBox).not.toBeNull();
        expect(libraryPreviewBox).not.toBeNull();
        expect(libraryPreviewBox!.x).toBeLessThan(libraryHeadingBox!.x);
      }
    }
  }
});
