import { expect, test } from '@playwright/test';

for (const locale of [
  {
    root: '/',
    plans: '/plans/',
    alternate: '/ja/plans/',
    cta: 'Compare plans',
    title: 'Plans & Pricing',
    rows: [
      'FeaturesEvery featureEvery feature',
      'Libraries1No limit',
      'BooksUp to 100No limit',
    ],
  },
  {
    root: '/ja/',
    plans: '/ja/plans/',
    alternate: '/plans/',
    cta: 'プランを比較する',
    title: 'プランと料金',
    rows: [
      '機能全機能全機能',
      'ライブラリ1つまで上限なし',
      '登録冊数100冊まで上限なし',
    ],
  },
]) {
  test(`${locale.plans} home comparison action reaches the comparison`, async ({
    page,
  }) => {
    await page.goto(locale.root);
    await page
      .locator('.hero-actions')
      .getByRole('link', { name: locale.cta })
      .click();
    await expect(page).toHaveURL(locale.plans);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale.title,
    );
    await expect(page.locator('.plan-summary')).toHaveCount(2);
    await expect(page.locator('.plan-price')).toHaveText(
      locale.root === '/'
        ? ['Free', 'One-time purchase']
        : ['無料', '買い切り'],
    );
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(3);
    for (let i = 0; i < locale.rows.length; i++) {
      expect((await rows.nth(i).textContent())?.replace(/\s+/g, '')).toBe(
        locale.rows[i].replace(/\s+/g, ''),
      );
    }
    await expect(
      page.locator('main a[href="' + locale.root + 'support/purchases/"]'),
    ).toBeVisible();
    await page.getByTestId('header-locale-switch').click();
    await expect(page).toHaveURL(locale.alternate);
  });

  test(`${locale.plans} product and support navigation reach the comparison`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(locale.root);
    await page.locator('[data-menu-toggle]').click();
    await page
      .locator('.site-navigation')
      .getByRole('link', { name: locale.title, exact: true })
      .click();
    await expect(page).toHaveURL(locale.plans);
    await page.goto(locale.root);
    await expect(
      page
        .locator('.site-footer')
        .getByRole('link', { name: locale.title, exact: true }),
    ).toHaveAttribute('href', locale.plans);
    const teaser = page.locator('.plans-teaser');
    const platform = page.locator('.platform-section');
    expect(
      await teaser.evaluate(
        (element, next) =>
          Boolean(
            element.compareDocumentPosition(next as Node) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        await platform.elementHandle(),
      ),
    ).toBe(true);
    await teaser.getByRole('link', { name: locale.cta }).click();
    await expect(page).toHaveURL(locale.plans);
    await page.goto(locale.root + 'features/');
    await page.locator('main').getByRole('link', { name: locale.cta }).click();
    await expect(page).toHaveURL(locale.plans);
    await page
      .locator('main a[href="' + locale.root + 'support/purchases/"]')
      .click();
    await page.locator('main').getByRole('link', { name: locale.cta }).click();
    await expect(page).toHaveURL(locale.plans);
  });

  test(`${locale.plans} comparison remains usable without JavaScript on narrow screens`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      reducedMotion: 'reduce',
      viewport: { width: 320, height: 740 },
    });
    const page = await context.newPage();
    await page.goto(locale.plans);
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader')).toHaveCount(3);
    await expect(page.getByRole('rowheader')).toHaveCount(3);
    for (const price of await page.locator('.plan-price').all()) {
      expect(
        await price.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    }
    await page.locator('.plan-header--plus .plan-action').click();
    await expect(page).toHaveURL(locale.plans + '#conditions-title');
    await page.locator('.plan-header--free .plan-action').click();
    await expect(page).toHaveURL(locale.plans + '#availability-title');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('main .platform-action--pending')).toHaveCount(2);
    await expect(page.locator('main .platform-card a')).toHaveCount(0);
    await context.close();
  });
}

for (const width of [769, 960, 961]) {
  test(`navigation stays readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/plans/');
    if (width <= 960) {
      await expect(page.locator('[data-menu-toggle]')).toBeVisible();
      await page.locator('[data-menu-toggle]').click();
    }
    const links = page.locator('.site-navigation a');
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      const lines = await link.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getClientRects().length;
      });
      expect(lines).toBe(1);
    }
  });
}

test('plan summaries align across languages and screen sizes', async ({
  page,
}) => {
  for (const width of [320, 390, 769, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/plans/', '/ja/plans/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      for (const selector of [
        '.plan-name',
        '.plan-price',
        '.plan-detail',
        '.plan-action',
      ]) {
        const positions = await page
          .locator(selector)
          .evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().top),
          );
        expect(
          Math.abs(positions[0] - positions[1]),
          `${route} ${width}px ${selector}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  }
});

for (const root of ['/', '/ja/']) {
  test(`${root}plans feature highlights lead to localized details`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${root}plans/`);
    const section = page.locator('.plans-features');
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(
      root === '/'
        ? 'Some of the features included in Free and Plus'
        : '無料版・Plus共通の主な機能',
    );
    await expect(section.getByRole('listitem')).toHaveCount(6);
    await expect(
      page.locator('#comparison-note + .plans-features + .plan-conditions'),
    ).toHaveCount(1);
    await section.getByRole('link').click();
    await expect(page).toHaveURL(`${root}features/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}
