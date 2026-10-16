import { expect, test } from '@playwright/test';

for (const path of ['/', '/ja/']) {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    test(`${path} exposes the primary action before scrolling at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const action = page.locator('.hero-actions .primary-link');
      await expect(action).toBeInViewport({ ratio: 1 });
      const actionBox = await action.boundingBox();
      const previewBox = await page
        .getByTestId('hero-product-preview')
        .boundingBox();
      expect(actionBox!.y + actionBox!.height).toBeLessThan(previewBox!.y);
      await action.click();
      await expect(page).toHaveURL(new RegExp(`${path}features/$`));
    });
  }

  test(`${path} feature navigation keeps all six destinations compact on mobile`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${path}features/`);
    await page.evaluate(() => document.fonts.ready);
    const nav = page.locator('.feature-jump-nav ol');
    await expect(nav.getByRole('link')).toHaveCount(6);
    expect((await nav.boundingBox())!.height).toBeLessThanOrEqual(240);
    for (const link of await nav.getByRole('link').all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      const target = await link.getAttribute('href');
      await expect(page.locator(target!)).toHaveCount(1);
    }
  });
}

for (const path of ['/', '/ja/', '/features/', '/ja/features/']) {
  test(`${path} keeps heading text inside a 320px viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const clipped = await page
      .locator('main h1, main h2, main h3')
      .evaluateAll((headings) =>
        headings
          .filter((heading) => {
            const range = document.createRange();
            range.selectNodeContents(heading);
            const box = range.getBoundingClientRect();
            return (
              box.width > 0 && (box.left < 0 || box.right > innerWidth + 1)
            );
          })
          .map(
            (heading) =>
              heading.getAttribute('aria-label') ?? heading.textContent?.trim(),
          ),
      );
    expect(clipped).toEqual([]);
  });
}

for (const width of [320, 390]) {
  test(`product screens leave room before the next card at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ja/');
    await page.evaluate(() => document.fonts.ready);
    const phone = await page.locator('.hero-preview-mobile').boundingBox();
    const desktop = await page.locator('.hero-preview-desktop').boundingBox();
    const benefits = await page.locator('.hero-benefits').boundingBox();
    expect(
      benefits!.y -
        Math.max(phone!.y + phone!.height, desktop!.y + desktop!.height),
    ).toBeGreaterThanOrEqual(48);
  });
}
