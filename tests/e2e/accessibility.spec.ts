import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/ja/',
  '/support/',
  '/ja/support/',
  '/privacy/',
  '/ja/privacy/',
  '/terms/',
  '/ja/terms/',
] as const;

const viewports = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
] as const;

for (const { name, viewport } of viewports) {
  test.describe(`${name} accessibility`, () => {
    test.use({ viewport });

    for (const route of routes) {
      test(`${route} has no serious or critical axe violations`, async ({
        page,
      }) => {
        await page.goto(route);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(
          results.violations.filter(
            ({ impact }) => impact === 'critical' || impact === 'serious',
          ),
        ).toEqual([]);
      });
    }
  });
}
