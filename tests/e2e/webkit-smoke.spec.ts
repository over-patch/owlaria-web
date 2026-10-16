import { expect, test } from '@playwright/test';
import { measureHeadingLines } from './helpers/heading-lines';

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

test('support notice avoids a stranded sentence ending in WebKit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ja/support/');
  await page.evaluate(() => document.fonts.ready);
  const heading = page
    .locator('.problem-report-boundaries')
    .getByRole('heading', { level: 3 });
  const lines = await heading.evaluate(measureHeadingLines);
  const widest = Math.max(...lines.map(({ width }) => width));
  expect(
    lines.at(-1)!.width / widest,
    JSON.stringify(lines),
  ).toBeGreaterThanOrEqual(0.3);
  expect(lines.every(({ left, right }) => left >= 0 && right <= 391)).toBe(
    true,
  );
});
