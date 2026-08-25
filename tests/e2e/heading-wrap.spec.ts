import { expect, test } from '@playwright/test';

const japaneseRoutes = [
  '/ja/',
  '/ja/features/',
  '/ja/support/',
  '/ja/support/purchases/',
  '/ja/privacy/',
  '/ja/terms/',
  '/ja/releases/',
  '/ja/releases/1.0.0/',
] as const;

const viewports = [
  { width: 390, height: 844 },
  { width: 1098, height: 862 },
] as const;

for (const pathname of japaneseRoutes) {
  test(`${pathname} wraps every heading at Japanese phrase boundaries`, async ({
    page,
  }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(pathname);
      await page.evaluate(() => document.fonts.ready);

      const headingMetrics = await page
        .locator('body :is(h1, h2, h3, h4, h5, h6)')
        .evaluateAll((headings) =>
          headings.map((heading) => ({
            text: heading.textContent?.trim() ?? '',
            wordBreak: getComputedStyle(heading).wordBreak,
          })),
        );
      expect(headingMetrics.length).toBeGreaterThan(0);
      expect(
        headingMetrics.every(
          ({ text, wordBreak }) =>
            text.length > 0 && wordBreak === 'auto-phrase',
        ),
        `${pathname} headings did not use phrase-aware wrapping at ${viewport.width}px: ${JSON.stringify(headingMetrics)}`,
      ).toBe(true);

      const phraseAwarePageWidth = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        phraseAwarePageWidth.scrollWidth,
        `${pathname} overflowed at ${viewport.width}px: ${JSON.stringify(phraseAwarePageWidth)}`,
      ).toBeLessThanOrEqual(phraseAwarePageWidth.clientWidth);

      const pageHeading = page.getByRole('heading', { level: 1 });
      await expect(pageHeading).toHaveCount(1);
      expect((await pageHeading.innerText()).trim().length).toBeGreaterThan(0);
    }
  });
}

for (const pathname of japaneseRoutes) {
  test(`${pathname} keeps semantic heading breaks without auto-phrase support`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const nativeSupports = CSS.supports.bind(CSS);
      CSS.supports = (property: string, value?: string) =>
        property === 'word-break' && value === 'auto-phrase'
          ? false
          : value === undefined
            ? nativeSupports(property)
            : nativeSupports(property, value);
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(pathname);
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator('html')).toHaveAttribute(
      'data-heading-wrap-fallback',
      'segmented',
    );
    const fallbackMetrics = await page
      .locator('body :is(h1, h2, h3, h4, h5, h6)')
      .evaluateAll((headings) =>
        headings.map((heading) => ({
          lineBreak: getComputedStyle(heading).lineBreak,
          text: heading.textContent?.trim() ?? '',
          wordBreak: getComputedStyle(heading).wordBreak,
        })),
      );
    expect(
      fallbackMetrics.every(
        ({ lineBreak, text, wordBreak }) =>
          lineBreak === 'strict' && text.length > 0 && wordBreak === 'keep-all',
      ),
      `${pathname} headings did not use segmented fallback: ${JSON.stringify(fallbackMetrics)}`,
    ).toBe(true);
    expect(
      await page.locator('wbr[data-auto-heading-break]').count(),
    ).toBeGreaterThan(0);

    const pageWidth = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      pageWidth.scrollWidth,
      `${pathname} segmented fallback overflowed: ${JSON.stringify(pageWidth)}`,
    ).toBeLessThanOrEqual(pageWidth.clientWidth);
  });
}
