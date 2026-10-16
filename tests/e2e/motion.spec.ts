import { expect, test } from '@playwright/test';

for (const prefix of ['', '/ja']) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`homepage hero fades without moving at ${prefix || '/'} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(`${prefix}/`);
      await page.evaluate(() => document.fonts.ready);

      const hero = page.locator('.hero-copy');
      const samples = await hero.evaluate((element) => {
        const animations = element.getAnimations();
        if (animations.length !== 1) return [];
        const animation = animations[0];
        animation.pause();
        const duration = Number(animation.effect!.getTiming().duration);
        return [0, duration / 2, duration].map((time) => {
          animation.currentTime = time;
          const style = getComputedStyle(element);
          return {
            top: element.getBoundingClientRect().top,
            opacity: Number(style.opacity),
            transform: style.transform,
          };
        });
      });

      expect(samples).toHaveLength(3);
      expect(samples[0].opacity).toBe(0);
      expect(samples[1].opacity).toBeGreaterThan(0);
      expect(samples[1].opacity).toBeLessThan(1);
      expect(samples[2].opacity).toBe(1);
      for (const sample of samples) {
        expect(sample.top).toBeCloseTo(samples[0].top, 3);
        expect(sample.transform).toBe('none');
      }

      const lowerSection = page.locator('.platform-roadmap');
      await expect(lowerSection).toHaveCSS('opacity', '0');
      await expect(lowerSection).toHaveCSS(
        'transform',
        'matrix(1, 0, 0, 1, 0, 20)',
      );
      await lowerSection.scrollIntoViewIfNeeded();
      await expect(lowerSection).toHaveCSS('opacity', '1');
      await expect(lowerSection).toHaveCSS('transform', 'none');
    });
  }

  for (const route of [
    '/features/',
    '/support/',
    '/support/purchases/',
    '/plans/',
    '/privacy/',
    '/terms/',
    '/releases/',
  ]) {
    test(`non-home content has no entrance animation at ${prefix}${route}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(`${prefix}${route}`);
      await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
      await expect(page.locator('[data-reveal]')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }

  test(`reduced motion keeps the hero and lower sections static at ${prefix || '/'}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${prefix}/`);
    for (const selector of ['.hero-copy', '.platform-roadmap']) {
      const element = page.locator(selector);
      await expect(element).toHaveCSS('opacity', '1');
      await expect(element).toHaveCSS('transform', 'none');
      await expect(element).toHaveCSS('animation-name', 'none');
    }
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ['/', '/ja/']) {
    test(`homepage content remains visible at ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
      await expect(page.locator('.hero-copy')).toHaveCSS('transform', 'none');
      await expect(page.locator('.platform-roadmap')).toHaveCSS('opacity', '1');
    });
  }
});
