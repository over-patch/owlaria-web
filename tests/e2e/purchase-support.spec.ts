import { expect, test } from '@playwright/test';

const locales = [
  {
    homePath: '/',
    supportPath: '/support/',
    supportHeading: 'How can we help?',
    supportIntroduction: 'Start with the topic closest to what you need.',
    path: '/support/purchases/',
    alternatePath: '/ja/support/purchases/',
    lang: 'en',
    heading: 'Owlaria Plus purchases, restores, and refunds',
    headingPhrases: ['Owlaria Plus purchases,', 'restores, and refunds'],
    title: 'Owlaria Plus purchases, restores, and refunds · Owlaria Support',
    description:
      'Learn about Owlaria Plus pricing, separate iOS and macOS purchases, Restore Purchases, Apple refunds, and purchase support.',
    contents: 'On this page',
    supportLink: 'Support',
    purchaseLink: 'Purchases, restores, and refunds',
    problemReportLink: 'Report an app problem',
    problemReportQuestion:
      'What should I do if a purchase, restore, or completed refund is not reflected in Owlaria?',
    reportRoute: 'Settings > Information > Report a problem',
    oneWay: 'a one-way problem report and feedback channel',
    supportId: 'current RevenueCat App User ID',
    platformWarning:
      'An iOS purchase cannot be transferred or restored on macOS',
    refundOwner:
      'Apple handles refund requests, eligibility reviews, approvals, processing, and status updates',
    restoreUrl: 'https://support.apple.com/en-us/108096',
    refundsUrl: 'https://support.apple.com/en-us/118223',
  },
  {
    homePath: '/ja/',
    supportPath: '/ja/support/',
    supportHeading: 'お困りのことは？',
    supportIntroduction: '知りたい内容に近い項目からご確認ください。',
    path: '/ja/support/purchases/',
    alternatePath: '/support/purchases/',
    lang: 'ja',
    heading: 'Owlaria Plusの購入・復元・返金について',
    headingPhrases: ['Owlaria Plusの', '購入・復元・返金について'],
    title: 'Owlaria Plusの購入・復元・返金について · Owlariaサポート',
    description:
      'Owlaria Plusの価格、iOS版とmacOS版の別購入、購入の復元、Appleへの返金申請、購入サポートをご案内します。',
    contents: 'このページの内容',
    supportLink: 'サポート',
    purchaseLink: '購入・復元・返金について',
    problemReportLink: 'アプリの問題を報告する',
    problemReportQuestion:
      '購入・復元・Appleで処理済みの返金がOwlariaへ反映されない場合はどうすればよいですか？',
    reportRoute: 'Settings > Information > Report a problem',
    oneWay: '一方向の問題報告・フィードバック受付',
    supportId: '現在のRevenueCat App User ID',
    platformWarning: '移行・復元することはできません',
    refundOwner: '返金申請の受付、審査、承認、処理、進捗確認はAppleが行います',
    restoreUrl: 'https://support.apple.com/ja-jp/108096',
    refundsUrl: 'https://support.apple.com/ja-jp/118223',
  },
] as const;

const faqIds = [
  'price',
  'platforms',
  'restore',
  'refund',
  'after-refund',
  'problem-report',
] as const;

for (const locale of locales) {
  test(`${locale.path} publishes localized purchase guidance`, async ({
    page,
  }) => {
    const response = await page.goto(locale.path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page).toHaveTitle(locale.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      locale.description,
    );
    const pageHeading = page.getByRole('heading', {
      level: 1,
      name: locale.heading,
    });
    await expect(pageHeading).toBeVisible();
    await expect(pageHeading.locator('[data-semantic-phrase]')).toHaveText(
      locale.headingPhrases,
    );
    await expect(page.getByRole('main')).toHaveCount(1);

    const contents = page.getByRole('navigation', { name: locale.contents });
    await expect(contents).toBeVisible();
    await expect(contents.getByRole('link')).toHaveCount(faqIds.length);

    for (const id of faqIds) {
      await expect(contents.locator(`a[href="#${id}"]`)).toHaveCount(1);
      await expect(
        page.locator(`article#${id}[data-purchase-faq]`),
      ).toBeVisible();
    }

    await expect(page.getByText(locale.platformWarning)).toBeVisible();
    await expect(page.getByText(locale.refundOwner)).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: locale.problemReportQuestion,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(locale.reportRoute, { exact: false }),
    ).toBeVisible();
    await expect(page.getByText(locale.oneWay, { exact: false })).toBeVisible();
    await expect(
      page.getByText(locale.supportId, { exact: false }),
    ).toBeVisible();
    await expect(
      page.locator(`a[href="${locale.restoreUrl}"]`),
    ).toHaveAttribute('target', '_blank');
    await expect(
      page.locator(`a[href="${locale.refundsUrl}"]`),
    ).toHaveAttribute('target', '_blank');
    await expect(
      page.locator('a[href="https://reportaproblem.apple.com/"]'),
    ).toHaveAttribute('rel', 'noreferrer');

    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      locale.alternatePath,
    );
  });

  test(`${locale.path} is discoverable from the header Support path`, async ({
    page,
  }) => {
    await page.goto(locale.homePath);

    await page
      .getByRole('banner')
      .getByRole('link', { name: locale.supportLink, exact: true })
      .click();
    await expect(page).toHaveURL(locale.supportPath);
    await expect(
      page.getByRole('heading', { level: 1, name: locale.supportHeading }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 3,
        name: locale.purchaseLink,
      }),
    ).toBeVisible();
    await expect(page.locator('[data-support-contact]')).toHaveCount(0);
    const problemReport = page.locator('[data-support-problem-report]');
    await expect(problemReport).toContainText(locale.problemReportLink);
    await expect(problemReport).toContainText(locale.reportRoute);
    await expect(problemReport.getByRole('link')).toHaveCount(0);

    const purchaseLink = page.getByRole('link', {
      name: locale.purchaseLink,
      exact: true,
    });
    await expect(purchaseLink).toHaveAttribute('href', locale.path);
    await purchaseLink.focus();
    await expect(purchaseLink).toBeFocused();
    await purchaseLink.click();
    await expect(page).toHaveURL(locale.path);
    await expect(
      page.getByRole('heading', { level: 1, name: locale.heading }),
    ).toBeVisible();
  });
}

test('Japanese support title stays on one line when space is available', async ({
  page,
}) => {
  await page.setViewportSize({ width: 899, height: 862 });
  await page.goto('/ja/support/');

  const heading = page.getByRole('heading', {
    level: 1,
    name: 'お困りのことは？',
  });
  await expect(heading).toBeVisible();
  expect(
    await heading.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getClientRects().length;
    }),
  ).toBe(1);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('decorative page hero backgrounds blend into the page without clipped edges', async ({
  page,
}) => {
  for (const { path, selector } of [
    { path: '/ja/', selector: '.home-hero' },
    { path: '/ja/features/', selector: '.features-hero' },
    { path: '/ja/support/', selector: '.support-hub-hero' },
    { path: '/ja/support/purchases/', selector: '.support-hero' },
    { path: '/ja/privacy/', selector: '.legal-hero' },
    { path: '/ja/terms/', selector: '.legal-hero' },
    { path: '/ja/releases/', selector: '.release-hero' },
    {
      path: '/ja/releases/1.0.0/',
      selector: '.release-detail-header',
    },
  ] as const) {
    await page.goto(path);

    const heroVisual = await page.locator(selector).evaluate((hero) => {
      const before = getComputedStyle(hero, '::before');
      const hasDecorativeBackground =
        before.content !== 'none' && before.backgroundImage !== 'none';

      return {
        hasDecorativeBackground,
        overflow: getComputedStyle(hero).overflow,
      };
    });

    if (heroVisual.hasDecorativeBackground) {
      expect(
        heroVisual.overflow,
        `${path} clips its decorative hero background`,
      ).toBe('visible');
    }
  }
});

for (const locale of locales) {
  test(`${locale.path} uses a readable responsive FAQ layout without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(locale.path);

    await expect(page.locator('.support-layout')).toHaveCSS('display', 'grid');
    await expect(page.locator('.support-contents')).toHaveCSS(
      'position',
      'sticky',
    );

    await page.setViewportSize({ width: 320, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    const headingFitsViewport = await page
      .getByRole('heading', { level: 1, name: locale.heading })
      .evaluate((heading) => {
        const box = heading.getBoundingClientRect();
        const visibleRight = Math.max(
          ...Array.from(
            heading.querySelectorAll<HTMLElement>('[data-semantic-phrase]'),
            (phrase) => phrase.getBoundingClientRect().right,
          ),
        );

        return box.left >= 0 && visibleRight <= window.innerWidth;
      });

    expect(hasHorizontalOverflow).toBe(false);
    expect(headingFitsViewport).toBe(true);
    await expect(page.locator('.support-contents')).toHaveCSS(
      'position',
      'static',
    );
  });

  test(`${locale.supportPath} adapts its resource grid without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(locale.supportPath);

    const grid = page.locator('.support-hub-grid');
    await expect(grid).toHaveCSS('display', 'grid');
    const desktopColumns = await grid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns,
    );
    expect(desktopColumns.split(' ')).toHaveLength(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      page.getByText(locale.supportIntroduction, { exact: true }),
    ).toBeVisible();

    const heroVisuals = await page
      .locator('.support-hub-hero')
      .evaluate((element) => ({
        backgroundImage: getComputedStyle(element, '::before').backgroundImage,
        borderRadius: getComputedStyle(element, '::before').borderRadius,
        overflow: getComputedStyle(element).overflow,
        maskImage: getComputedStyle(element, '::before').maskImage,
      }));
    expect(heroVisuals.overflow).toBe('visible');
    expect(heroVisuals.backgroundImage).toContain('radial-gradient');
    expect(heroVisuals.borderRadius).toBe('0px');
    expect(heroVisuals.maskImage).toBe('none');

    const mobileColumns = await grid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns,
    );
    expect(mobileColumns.split(' ')).toHaveLength(1);
    await expect(grid.locator('.support-hub-card').first()).toHaveCSS(
      'min-height',
      '0px',
    );

    const categorySelectVisuals = await page
      .locator('[data-problem-report-form] select')
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          appearance: style.appearance,
          backgroundImage: style.backgroundImage,
          backgroundPosition: style.backgroundPosition,
        };
      });
    expect(categorySelectVisuals.appearance).toBe('none');
    expect(categorySelectVisuals.backgroundImage).not.toBe('none');
    expect(categorySelectVisuals.backgroundPosition).toContain('16px');

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
}

test.describe('purchase guidance without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of locales) {
    test(`${locale.path} keeps the contents and every answer available`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(locale.path);

      await expect(
        page.getByRole('navigation', { name: locale.contents }),
      ).toBeVisible();
      await expect(page.locator('[data-purchase-faq]')).toHaveCount(
        faqIds.length,
      );
      for (const answer of await page.locator('[data-purchase-faq]').all()) {
        await expect(answer).toBeVisible();
      }
    });

    test(`${locale.supportPath} keeps the Support hub purchase path available`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(locale.supportPath);

      await expect(
        page.getByRole('link', {
          name: locale.purchaseLink,
          exact: true,
        }),
      ).toHaveAttribute('href', locale.path);
      await expect(page.locator('[data-support-contact]')).toHaveCount(0);
      const problemReport = page.locator('[data-support-problem-report]');
      await expect(problemReport).toContainText(locale.reportRoute);
      await expect(problemReport.getByRole('link')).toHaveCount(0);
    });
  }
});

test('supports keyboard focus and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/support/purchases/');

  const externalLink = page.locator('a.external-link').first();
  await externalLink.focus();
  await expect(externalLink).toBeFocused();

  const reveal = page.locator('[data-reveal]').first();
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveCSS('opacity', '1');
  await expect(reveal).toHaveCSS('transform', 'none');

  await page.goto('/support/');
  const hubReveal = page.locator('[data-reveal]').first();
  await expect(hubReveal).toBeVisible();
  await expect(hubReveal).toHaveCSS('opacity', '1');
  await expect(hubReveal).toHaveCSS('transform', 'none');
});
