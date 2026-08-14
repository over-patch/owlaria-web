import { expect, test } from '@playwright/test';

const legalPages = [
  {
    locale: 'en',
    privacyPath: '/privacy/',
    termsPath: '/terms/',
    privacyHeading: 'Owlaria Privacy Policy',
    termsHeading: 'Owlaria Terms of Use',
    effectiveDate: 'August 15, 2026',
    privacyContact: 'overpatch.ch@gmail.com',
    purchasesPath: '/support/purchases/',
    alternatePrivacyPath: '/ja/privacy/',
    alternateTermsPath: '/ja/terms/',
  },
  {
    locale: 'ja',
    privacyPath: '/ja/privacy/',
    termsPath: '/ja/terms/',
    privacyHeading: 'Owlaria プライバシーポリシー',
    termsHeading: 'Owlaria 利用規約',
    effectiveDate: '2026年8月15日',
    privacyContact: 'overpatch.ch@gmail.com',
    purchasesPath: '/ja/support/purchases/',
    alternatePrivacyPath: '/privacy/',
    alternateTermsPath: '/terms/',
  },
] as const;

for (const legalPage of legalPages) {
  test(`${legalPage.privacyPath} publishes the complete privacy policy`, async ({
    page,
  }) => {
    const response = await page.goto(legalPage.privacyPath);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      legalPage.locale,
    );
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: legalPage.privacyHeading,
      }),
    ).toBeVisible();
    await expect(page.getByText(legalPage.effectiveDate)).toHaveCount(2);
    await expect(page.getByText(legalPage.privacyContact)).toBeVisible();
    await expect(page.locator('[data-legal-section]')).toHaveCount(12);
    await expect(page.getByText(/being prepared|準備しています/)).toHaveCount(
      0,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      legalPage.alternatePrivacyPath,
    );
  });

  test(`${legalPage.termsPath} publishes the complete terms`, async ({
    page,
  }) => {
    const response = await page.goto(legalPage.termsPath);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      legalPage.locale,
    );
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: legalPage.termsHeading,
      }),
    ).toBeVisible();
    await expect(page.getByText(legalPage.effectiveDate)).toHaveCount(2);
    await expect(page.locator('[data-legal-section]')).toHaveCount(16);
    await expect(
      page.locator('main').locator(`a[href="${legalPage.purchasesPath}"]`),
    ).toHaveCount(1);
    await expect(page.getByText(/being prepared|準備しています/)).toHaveCount(
      0,
    );
    await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
      'href',
      legalPage.alternateTermsPath,
    );
  });
}

test('legal pages remain readable on mobile without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
    const columns = await page
      .locator('.legal-layout')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
    expect(columns.split(' ')).toHaveLength(1);
  }
});
