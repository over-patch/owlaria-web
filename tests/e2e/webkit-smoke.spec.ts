import { expect, test } from '@playwright/test';

const routes = [
  {
    path: '/',
    fontFamily: 'Inter Variable',
    absentFontFamily: 'Noto Sans JP Variable',
  },
  {
    path: '/features/',
    fontFamily: 'Inter Variable',
    absentFontFamily: 'Noto Sans JP Variable',
  },
  {
    path: '/ja/',
    fontFamily: 'Noto Sans JP Variable',
    absentFontFamily: 'Inter Variable',
  },
  {
    path: '/ja/features/',
    fontFamily: 'Noto Sans JP Variable',
    absentFontFamily: 'Inter Variable',
  },
] as const;

for (const { path, fontFamily, absentFontFamily } of routes) {
  test(`${path} renders without overflow in WebKit`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    const fontState = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        bodyFamily: getComputedStyle(document.body).fontFamily,
        registeredFamilies: Array.from(document.fonts, (font) => font.family),
      };
    });
    expect(fontState.bodyFamily).toContain(fontFamily);
    expect(fontState.registeredFamilies).toContain(fontFamily);
    expect(fontState.registeredFamilies).not.toContain(absentFontFamily);

    const pageWidth = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth);

    const menuButton = page.locator('[data-menu-toggle]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    await expect(
      page.getByRole('navigation', { name: /navigation|ナビゲーション/i }),
    ).toBeVisible();
  });
}
