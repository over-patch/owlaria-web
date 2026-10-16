import { expect, test } from '@playwright/test';

import { measureHeadingLines } from './helpers/heading-lines';

for (const fallback of [false, true]) {
  test.describe(
    fallback ? 'segmented heading fallback' : 'native heading wrapping',
    () => {
      test.beforeEach(async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        if (fallback) {
          await page.addInitScript(() => {
            const nativeSupports = CSS.supports.bind(CSS);
            CSS.supports = (property: string, value?: string) =>
              property === 'word-break' && value === 'auto-phrase'
                ? false
                : value === undefined
                  ? nativeSupports(property)
                  : nativeSupports(property, value);
          });
        }
      });

      for (const width of [320, 390, 768, 1024, 1440]) {
        test(`Japanese privacy title keeps its complete term at ${width}px`, async ({
          page,
        }) => {
          await page.setViewportSize({ width, height: 1000 });
          await page.goto('/ja/privacy/');
          await page.evaluate(() => document.fonts.ready);
          const heading = page.getByRole('heading', { level: 1 });
          await expect(heading).toHaveAccessibleName(
            'Owlaria プライバシーポリシー',
          );
          const lines = await heading.evaluate(measureHeadingLines);
          expect(
            lines.some(({ text }) => text.includes('プライバシーポリシー')),
            JSON.stringify(lines),
          ).toBe(true);
          expect(
            lines.every(({ left, right }) => left >= 0 && right <= width + 1),
          ).toBe(true);
        });
      }

      for (const { path, title, width } of [
        {
          path: '/features/',
          title: 'The folders you already use',
          width: 320,
        },
        {
          path: '/ja/features/',
          title: '元のフォルダへ書き込まない設計',
          width: 320,
        },
        { path: '/ja/features/', title: 'プライベートライブラリ', width: 320 },
        { path: '/', title: 'Organize without touching files', width: 390 },
        { path: '/ja/', title: 'ファイル移動を追跡', width: 1440 },
        { path: '/ja/', title: '読書を振り返る統計', width: 1440 },
      ]) {
        test(`${path} balances ${title} at ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 1000 });
          await page.goto(path);
          await page.evaluate(() => document.fonts.ready);
          const heading = page.getByRole('heading', {
            level: 3,
            name: title,
            exact: true,
          });
          const lines = await heading.evaluate(measureHeadingLines);
          const widest = Math.max(...lines.map(({ width }) => width));
          expect(
            lines.at(-1)!.width / widest,
            JSON.stringify(lines),
          ).toBeGreaterThanOrEqual(0.3);
          expect(
            lines.every(({ left, right }) => left >= 0 && right <= width + 1),
          ).toBe(true);
        });
      }
    },
  );
}
