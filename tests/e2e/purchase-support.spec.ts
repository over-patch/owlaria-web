import { expect, test } from '@playwright/test';

const locales = [
  {
    homePath: '/',
    supportPath: '/support/',
    supportHeading: 'How can we help?',
    path: '/support/purchases/',
    alternatePath: '/ja/support/purchases/',
    lang: 'en',
    heading: 'Owlaria Plus purchases, restores, and refunds',
    title: 'Owlaria Plus purchases, restores, and refunds · Owlaria Support',
    description:
      'Learn about Owlaria Plus pricing, separate iOS and macOS purchases, Restore Purchases, Apple refunds, and purchase support.',
    contents: 'On this page',
    supportLink: 'Support',
    purchaseLink: 'Purchases, restores, and refunds',
    unpublishedGuidance: /in-app Owlaria support form|Support ID/i,
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
    path: '/ja/support/purchases/',
    alternatePath: '/support/purchases/',
    lang: 'ja',
    heading: 'Owlaria Plusの購入・復元・返金について',
    title: 'Owlaria Plusの購入・復元・返金について · Owlariaサポート',
    description:
      'Owlaria Plusの価格、iOS版とmacOS版の別購入、購入の復元、Appleへの返金申請、購入サポートをご案内します。',
    contents: 'このページの内容',
    supportLink: 'サポート',
    purchaseLink: '購入・復元・返金について',
    unpublishedGuidance: /アプリ内問い合わせフォーム|Support ID/i,
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
    await expect(
      page.getByRole('heading', { level: 1, name: locale.heading }),
    ).toBeVisible();
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
      page.locator(`a[href="${locale.restoreUrl}"]`),
    ).toHaveAttribute('target', '_blank');
    await expect(
      page.locator(`a[href="${locale.refundsUrl}"]`),
    ).toHaveAttribute('target', '_blank');
    await expect(
      page.locator('a[href="https://reportaproblem.apple.com/"]'),
    ).toHaveAttribute('rel', 'noreferrer');

    await expect(page.getByRole('main')).not.toContainText(
      locale.unpublishedGuidance,
    );
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

test('uses a readable responsive FAQ layout without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/support/purchases/');

  await expect(page.locator('.support-layout')).toHaveCSS('display', 'grid');
  await expect(page.locator('.support-contents')).toHaveCSS(
    'position',
    'sticky',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  await expect(page.locator('.support-contents')).toHaveCSS(
    'position',
    'static',
  );
});

test('support hub adapts its resource grid without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/support/');

  const grid = page.locator('.support-hub-grid');
  await expect(grid).toHaveCSS('display', 'grid');
  const desktopColumns = await grid.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );
  expect(desktopColumns.split(' ')).toHaveLength(1);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileColumns = await grid.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );
  expect(mobileColumns.split(' ')).toHaveLength(1);

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test.describe('purchase guidance without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps the contents and every answer available', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/support/purchases/');

    await expect(
      page.getByRole('navigation', { name: 'On this page' }),
    ).toBeVisible();
    await expect(page.locator('[data-purchase-faq]')).toHaveCount(
      faqIds.length,
    );
    for (const answer of await page.locator('[data-purchase-faq]').all()) {
      await expect(answer).toBeVisible();
    }
  });

  test('keeps the Support hub purchase path available', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/support/');

    await expect(
      page.getByRole('link', {
        name: 'Purchases, restores, and refunds',
        exact: true,
      }),
    ).toHaveAttribute('href', '/support/purchases/');
    await expect(page.locator('[data-support-contact]')).toHaveCount(0);
  });
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
