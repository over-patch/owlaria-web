import { expect, test } from '@playwright/test';

const locales = [
  {
    path: '/support/purchases/',
    alternatePath: '/ja/support/purchases/',
    lang: 'en',
    heading: 'Owlaria Plus purchases, restores, and refunds',
    contents: 'On this page',
    platformWarning:
      'An iOS purchase cannot be transferred or restored on macOS',
    refundOwner:
      'Apple handles refund requests, eligibility reviews, approvals, processing, and status updates',
    restoreUrl: 'https://support.apple.com/en-us/108096',
    refundsUrl: 'https://support.apple.com/en-us/118223',
  },
  {
    path: '/ja/support/purchases/',
    alternatePath: '/support/purchases/',
    lang: 'ja',
    heading: 'Owlaria Plusの購入・復元・返金について',
    contents: 'このページの内容',
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
  'support',
] as const;

for (const locale of locales) {
  test(`${locale.path} publishes localized purchase guidance`, async ({
    page,
  }) => {
    const response = await page.goto(locale.path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
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

    await expect(
      page.locator('#support a[href*="support"], #support a[href*="contact"]'),
    ).toHaveCount(0);
    await expect(page.locator('#support')).toContainText('Support ID');
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      locale.alternatePath,
    );
  });
}
