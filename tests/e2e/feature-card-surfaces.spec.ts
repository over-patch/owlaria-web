import { expect, test } from '@playwright/test';

for (const width of [590, 1440]) {
  for (const path of ['/', '/ja/']) {
    test(`feature cards share a consistent surface at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 852 });
      await page.goto(path);

      const summaryCard = page.locator('.feature-grid > li').first();
      const readerCard = page.locator('.reader-feature-card');
      await readerCard.scrollIntoViewIfNeeded();
      await expect(readerCard).toBeVisible();

      for (const property of [
        'background-image',
        'background-color',
        'box-shadow',
      ]) {
        const expected = await summaryCard.evaluate(
          (element, name) => getComputedStyle(element).getPropertyValue(name),
          property,
        );
        await expect(readerCard).toHaveCSS(property, expected);
      }
    });
  }
}
