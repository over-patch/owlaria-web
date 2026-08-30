import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/',
    heading: 'Keep your folders. Build the comic library you want.',
    desktopLines: [
      'Keep your folders.',
      'Build the comic library',
      'you want.',
    ],
    mobileLines: [
      'Keep your',
      'folders.',
      'Build the',
      'comic library',
      'you want.',
    ],
    principle: 'Organize without touching files',
    featureHeading: 'Keep your folders. Organize and read your way.',
    capabilityHeading: 'More than a folder browser.',
    screenshotHeading: 'Keep your storage. Transform how you browse.',
    compatibilityHeading: 'Open the files you already have.',
    heroActions: [
      { name: 'Explore features', href: '/features/' },
      { name: 'See Free and Plus', href: '/support/purchases/' },
    ],
    featureAction: 'Explore every feature',
    featureHref: '/features/',
    platformHeading: 'Owlaria for Mac. Owlaria for iPhone.',
    heroFreeNote: 'Free: 1 library · 100 books',
    heroPreviewStatus: 'Product previews coming soon',
    heroPreviewLabels: ['Mac library screenshot', 'iPhone reader screenshot'],
    freeNote: 'Use every feature free with one library and up to 100 books.',
    purchaseNote:
      'Owlaria Plus removes the library and book limits with a one-time purchase for each operating system. Check the App Store price shown in the app.',
    platformNames: ['Owlaria for Mac', 'Owlaria for iPhone'],
    futureLabel: 'Also planned',
    comingSoon: 'Coming soon',
  },
  {
    path: '/ja/',
    heading: 'フォルダはそのまま。理想のコミックライブラリへ。',
    desktopLines: ['フォルダはそのまま。', '理想のコミック', 'ライブラリへ。'],
    mobileLines: [
      'フォルダは',
      'そのまま。',
      '理想のコミック',
      'ライブラリへ。',
    ],
    principle: '原本に触れずに整理',
    featureHeading: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
    capabilityHeading: 'フォルダを超えて、見つかる本棚へ。',
    screenshotHeading: '保存先はそのまま。見え方は、ここまで変わる。',
    compatibilityHeading: 'いつものファイルを、そのまま開ける。',
    heroActions: [
      { name: '機能を見る', href: '/ja/features/' },
      { name: '無料範囲とPlusを見る', href: '/ja/support/purchases/' },
    ],
    featureAction: 'すべての機能を見る',
    featureHref: '/ja/features/',
    platformHeading: 'Macにも、iPhoneにも。Owlariaを。',
    heroFreeNote: '無料：1ライブラリ・100冊まで',
    heroPreviewStatus: 'アプリ画面は近日公開',
    heroPreviewLabels: ['Mac版ライブラリ画面', 'iPhone版ビューア画面'],
    freeNote: 'すべての機能を1ライブラリ・100冊まで無料で利用できます。',
    purchaseNote:
      'Owlaria Plusは、ライブラリ数と冊数の上限を解除するOSごとの買い切りです。価格はアプリ内のApp Store表示をご確認ください。',
    platformNames: ['Owlaria for Mac', 'Owlaria for iPhone'],
    futureLabel: '今後登場予定',
    comingSoon: '近日公開',
  },
] as const) {
  test(`${locale.path} presents the localized product value`, async ({
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
    await expect(page.locator('.hero-benefits > li')).toHaveCount(2);
    const heroPreview = page.getByTestId('hero-product-preview');
    await expect(heroPreview).toBeVisible();
    await expect(heroPreview.getByTestId('hero-preview-label')).toHaveText(
      locale.heroPreviewLabels,
    );
    await expect(heroPreview.locator('figcaption')).toHaveText(
      locale.heroPreviewStatus,
    );
    for (const action of locale.heroActions) {
      await expect(
        page.locator('.hero-actions').getByRole('link', { name: action.name }),
      ).toHaveAttribute('href', action.href);
    }
    await expect(page.locator('.product-story-section')).toHaveCount(0);
    const desktopPreviewBox = await heroPreview
      .locator('.hero-preview-desktop')
      .boundingBox();
    const mobilePreviewBox = await heroPreview
      .locator('.hero-preview-mobile')
      .boundingBox();
    expect(desktopPreviewBox).not.toBeNull();
    expect(mobilePreviewBox).not.toBeNull();
    expect(desktopPreviewBox!.width).toBeGreaterThan(
      mobilePreviewBox!.width * 2,
    );
    expect(mobilePreviewBox!.x).toBeLessThan(
      desktopPreviewBox!.x + desktopPreviewBox!.width,
    );
    const firstBenefit = page.locator('.hero-benefits > li').nth(0);
    const secondBenefit = page.locator('.hero-benefits > li').nth(1);
    await expect(firstBenefit).toHaveCSS('border-radius', '20px');
    const firstBenefitBox = await firstBenefit.boundingBox();
    const secondBenefitBox = await secondBenefit.boundingBox();
    expect(firstBenefitBox).not.toBeNull();
    expect(secondBenefitBox).not.toBeNull();
    expect(secondBenefitBox!.x).toBeGreaterThan(
      firstBenefitBox!.x + firstBenefitBox!.width,
    );
    for (const card of await page.locator('.feature-grid > li').all()) {
      const numberBox = await card.locator('.feature-number').boundingBox();
      const titleBox = await card.locator('h3').boundingBox();
      expect(numberBox).not.toBeNull();
      expect(titleBox).not.toBeNull();
      expect(titleBox!.y - (numberBox!.y + numberBox!.height)).toBeLessThan(40);
    }
    await expect(page.locator('.reader-feature-card')).toBeVisible();
    await expect(page.locator('.reader-mode-group')).toHaveCount(3);
    await expect(page.locator('.reader-mode-icon')).toHaveCount(0);
    const readerHeaderBox = await page
      .locator('.reader-feature-header')
      .boundingBox();
    const readerModesBox = await page
      .locator('.reader-mode-grid')
      .boundingBox();
    expect(readerHeaderBox).not.toBeNull();
    expect(readerModesBox).not.toBeNull();
    expect(readerModesBox!.y).toBeGreaterThan(
      readerHeaderBox!.y + readerHeaderBox!.height,
    );
    const readerNumberBox = await page
      .locator('.reader-feature-card .feature-number')
      .boundingBox();
    const readerTitleBox = await page
      .locator('.reader-feature-card h3')
      .boundingBox();
    expect(readerNumberBox).not.toBeNull();
    expect(readerTitleBox).not.toBeNull();
    expect(readerTitleBox!.y).toBeGreaterThan(
      readerNumberBox!.y + readerNumberBox!.height,
    );
    const summaryCardBox = await page
      .locator('.feature-grid > li')
      .first()
      .boundingBox();
    const readerCardBox = await page
      .locator('.reader-feature-card')
      .boundingBox();
    expect(summaryCardBox).not.toBeNull();
    expect(readerCardBox).not.toBeNull();
    expect(readerCardBox!.width).toBeGreaterThan(summaryCardBox!.width * 1.8);
    await expect(
      page.getByRole('heading', { name: locale.platformHeading }),
    ).toBeVisible();
    await expect(
      page.locator(
        '[data-testid="platform-macos"] [data-platform-icon="macos"]',
      ),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="platform-ios"] [data-platform-icon="ios"]'),
    ).toBeVisible();
    await expect(page.locator('.platform-symbol')).toHaveText(['', '']);
    await expect(page.locator('.platform-card h3')).toHaveText(
      locale.platformNames,
    );
    await expect(page.locator('.hero-availability')).toHaveCount(0);
    await expect(page.locator('.hero-platforms')).toContainText('Mac');
    await expect(page.locator('.hero-platforms')).toContainText('iPhone');
    await expect(page.locator('.hero-platform-icon')).toHaveCount(2);
    await expect(page.locator('.hero-platform-icon svg')).toHaveCount(2);
    await expect(page.locator('.hero-free-note')).toHaveCount(0);
    await expect(page.locator('.hero-coming-soon')).toHaveCount(0);
    await expect(page.locator('.platform-roadmap')).toContainText(
      locale.futureLabel,
    );
    await expect(page.locator('.platform-roadmap li')).toHaveText([
      'Windows',
      'Android',
    ]);
    await expect(page.locator('.purchase-note strong')).toHaveText(
      locale.freeNote,
    );
    await expect(page.locator('.purchase-note span')).toHaveText(
      locale.purchaseNote,
    );
    const freeNoteBox = await page
      .locator('.purchase-note strong')
      .boundingBox();
    const purchaseNoteBox = await page
      .locator('.purchase-note span')
      .boundingBox();
    expect(freeNoteBox).not.toBeNull();
    expect(purchaseNoteBox).not.toBeNull();
    expect(purchaseNoteBox!.y).toBeGreaterThan(
      freeNoteBox!.y + freeNoteBox!.height / 2,
    );
    await expect(page.locator('main > .closing-section')).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: locale.principle }),
    ).toBeVisible();
    const featureSection = page
      .getByRole('heading', { name: locale.featureHeading })
      .locator('..');
    const capabilitySection = page
      .getByRole('heading', { name: locale.capabilityHeading })
      .locator('..');
    const screenshotSection = page
      .getByRole('heading', { name: locale.screenshotHeading })
      .locator('..');
    const compatibilitySection = page
      .getByRole('heading', { name: locale.compatibilityHeading })
      .locator('..');
    const featureBox = await featureSection.boundingBox();
    const screenshotBox = await screenshotSection.boundingBox();
    const compatibilityBox = await compatibilitySection.boundingBox();
    const capabilityBox = await capabilitySection.boundingBox();
    expect(featureBox?.y).toBeLessThan(screenshotBox?.y ?? 0);
    expect(screenshotBox?.y).toBeLessThan(compatibilityBox?.y ?? 0);
    expect(compatibilityBox?.y).toBeLessThan(capabilityBox?.y ?? 0);
    await expect(page.getByTestId('app-screenshot-slot')).toBeVisible();
    await expect(
      page.getByTestId('format-list').getByRole('listitem'),
    ).toHaveText(['ZIP', 'CBZ', 'RAR', 'CBR', '7Z', 'CB7', 'LZH', 'PDF']);
    for (const badge of await page
      .getByTestId('format-list')
      .getByRole('listitem')
      .all()) {
      expect((await badge.boundingBox())?.height).toBeLessThanOrEqual(36);
    }
    await expect(compatibilitySection.locator('p:not(.eyebrow)')).toHaveCount(
      1,
    );
    await expect(page.locator('.password-symbol svg')).toBeVisible();
    await expect(page.locator('.password-symbol')).toHaveText('');
    expect(
      (await page.locator('.password-support').boundingBox())?.height,
    ).toBeLessThanOrEqual(64);
    expect(
      (await page.locator('.password-symbol').boundingBox())?.width,
    ).toBeLessThanOrEqual(36);
    await expect(
      page.getByRole('link', { name: locale.featureAction }),
    ).toHaveAttribute('href', locale.featureHref);
    await expect(page.locator('.capability-body > p')).toHaveCount(2);
    await expect(page.locator('.capability-icon')).toHaveCount(4);
    await expect(page.locator('.capability-icon svg')).toHaveCount(4);
    for (const card of await page.locator('.capability-grid > li').all()) {
      const cardStyle = await card.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          borderRadius: Number.parseFloat(style.borderTopLeftRadius),
          rightBorder: style.borderRightStyle,
        };
      });
      expect(cardStyle.borderRadius).toBeGreaterThan(0);
      expect(cardStyle.rightBorder).toBe('solid');
    }

    await expect(page.locator('.preview-artwork')).toHaveCount(0);

    for (const id of ['macos', 'ios']) {
      const card = page.getByTestId(`platform-${id}`);
      await expect(card).toContainText(locale.comingSoon);
      await expect(card.getByRole('link')).toHaveCount(0);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileLines = page.locator('[data-headline-variant="mobile"] > span');
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

test('English hero typography leaves room for descenders', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.locator('.hero-copy h1').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      lineHeightRatio:
        Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize),
      paddingBottom: Number.parseFloat(style.paddingBottom),
      overflow: style.overflow,
    };
  });

  expect(metrics.lineHeightRatio).toBeGreaterThanOrEqual(0.96);
  expect(metrics.paddingBottom).toBeGreaterThan(0);
  expect(metrics.overflow).toBe('visible');
});

test('mobile product preview stays below the hero heading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 429, height: 862 });
  await page.goto('/ja/');

  const headingBox = await page.locator('.hero-copy h1').boundingBox();
  const mobilePreviewBox = await page
    .locator('.hero-preview-mobile')
    .boundingBox();

  expect(headingBox).not.toBeNull();
  expect(mobilePreviewBox).not.toBeNull();
  expect(mobilePreviewBox!.y).toBeGreaterThanOrEqual(
    headingBox!.y + headingBox!.height + 24,
  );
});

test('Japanese marketing headings wrap on phrase boundaries', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1332, height: 900 });
  await page.goto('/ja/');

  for (const { name, lines } of [
    {
      name: 'フォルダはそのまま。整理も、読み方も、思いどおりに。',
      lines: ['フォルダはそのまま。', '整理も、読み方も、', '思いどおりに。'],
    },
    {
      name: 'フォルダを超えて、見つかる本棚へ。',
      lines: ['フォルダを超えて、', '見つかる本棚へ。'],
    },
    {
      name: 'Macにも、iPhoneにも。Owlariaを。',
      lines: ['Macにも、iPhoneにも。', 'Owlariaを。'],
    },
  ]) {
    const heading = page.getByRole('heading', { name });
    await expect(
      heading.locator('[data-headline-variant="desktop"] > span'),
    ).toHaveText(lines);
  }
});

test('homepage remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Keep your folders. Build the comic library you want.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Organize without touching files',
      exact: true,
    }),
  ).toBeVisible();
  await context.close();
});

test('homepage uses responsive content grids', async ({ page }) => {
  for (const viewport of [
    {
      width: 390,
      height: 844,
      featureColumns: 1,
      capabilityColumns: 1,
      platformColumns: 1,
      compatibilityColumns: 1,
    },
    {
      width: 829,
      height: 862,
      featureColumns: 2,
      capabilityColumns: 2,
      platformColumns: 2,
      compatibilityColumns: 1,
    },
    {
      width: 1440,
      height: 1000,
      featureColumns: 2,
      capabilityColumns: 4,
      platformColumns: 2,
      compatibilityColumns: 2,
    },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const overflow = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const elements = Array.from(document.querySelectorAll('body *'))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: [
              element.tagName.toLowerCase(),
              ...Array.from(element.classList).map((name) => `.${name}`),
            ].join(''),
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
          };
        })
        .filter(
          ({ left, right }) => left < -0.5 || right > viewportWidth + 0.5,
        );

      return {
        viewportWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        elements,
      };
    });

    expect(
      overflow.pageScrollWidth,
      `Horizontal overflow at ${viewport.width}px: ${JSON.stringify(overflow)}`,
    ).toBeLessThanOrEqual(overflow.viewportWidth);

    for (const [selector, expectedColumns] of [
      ['.feature-grid', viewport.featureColumns],
      ['.capability-grid', viewport.capabilityColumns],
      ['.platform-grid', viewport.platformColumns],
      ['.compatibility-section', viewport.compatibilityColumns],
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

    if (viewport.width === 829) {
      for (const card of await page.locator('.capability-grid > li').all()) {
        expect((await card.boundingBox())?.height ?? 0).toBeLessThan(190);
      }
    }

    const screenshotSlot = page.getByTestId('app-screenshot-slot');
    await expect(screenshotSlot).toBeVisible();
    const screenshotBox = await screenshotSlot.boundingBox();
    expect(
      (screenshotBox?.width ?? 0) / (screenshotBox?.height ?? 1),
    ).toBeCloseTo(1.6, 1);
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
