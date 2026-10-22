import { expect, test } from '@playwright/test';

for (const { width, sectionGap } of [
  { width: 390, sectionGap: 64 },
  { width: 590, sectionGap: 64 },
  { width: 1440, sectionGap: 100.8 },
]) {
  for (const path of ['/support/', '/ja/support/']) {
    test(`report form has one section gap after support resources at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 852 });
      await page.goto(path);
      const cards = await page.locator('.support-hub-grid').boundingBox();
      const report = await page
        .locator('.problem-report-section')
        .boundingBox();
      expect(cards).not.toBeNull();
      expect(report).not.toBeNull();
      expect(report!.y - (cards!.y + cards!.height)).toBeCloseTo(sectionGap, 0);
    });
  }
}
