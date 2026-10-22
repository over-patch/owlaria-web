import { expect, test } from '@playwright/test';

for (const width of [390, 590, 1440]) {
  for (const path of ['/', '/ja/']) {
    test(`platform section has a full section gap after plans at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 852 });
      await page.goto(path);

      const plans = await page.locator('.plans-teaser').boundingBox();
      const platforms = await page.locator('.platform-section').boundingBox();
      const sectionGap = await page
        .locator('.capability-section')
        .evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).paddingBottom),
        );

      expect(plans).not.toBeNull();
      expect(platforms).not.toBeNull();
      expect(platforms!.y - (plans!.y + plans!.height)).toBeCloseTo(
        sectionGap,
        0,
      );
    });

    test(`plans teaser has one section gap after capabilities at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 852 });
      await page.goto(path);

      const action = await page
        .locator('.capability-section > .primary-link')
        .boundingBox();
      const plans = await page.locator('.plans-teaser').boundingBox();
      const sectionGap = await page
        .locator('.capability-section')
        .evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).paddingBottom),
        );

      expect(action).not.toBeNull();
      expect(plans).not.toBeNull();
      expect(plans!.y - (action!.y + action!.height)).toBeCloseTo(
        sectionGap,
        0,
      );
    });
  }
}
