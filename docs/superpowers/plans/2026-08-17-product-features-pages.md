# Product Features Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the bilingual homepage around Owlaria's concrete NAS, Read-Only, and comic-viewer advantages, and add a bilingual `/features/` page that documents the wider implemented feature set.

**Architecture:** Keep English source copy and Japanese translations in typed content modules. Render the homepage and feature catalog with Astro-only components, reuse the shared layout and locale helpers, and add navigation links without introducing client frameworks or fictional product screenshots.

**Tech Stack:** Astro 7 static output, strict TypeScript, CSS design tokens, Vitest, Playwright, mise-managed Node.js and pnpm.

## Global Constraints

- English is the source locale at `/` and `/features/`; Japanese is published at `/ja/` and `/ja/features/` in the same change.
- Lead with NAS/SMB comic reading, structural Read-Only behavior, partial retrieval and prefetching, and comic-specific reading controls.
- Do not claim cloud sync, EPUB, OCR, margin removal, Windows support, or Android support.
- Do not claim every archive format supports remote range streaming; describe ZIP/CBZ and PDF partial retrieval separately from the supported-format list.
- Keep Store destinations as non-link `Coming soon` labels until confirmed URLs exist.
- Do not present invented UI as a real product screenshot.
- Preserve static rendering, no-JavaScript usability, keyboard access, responsive behavior, reciprocal locale metadata, trailing-slash URLs, and `prefers-reduced-motion` support.

---

### Task 1: Typed product stories and feature catalog

**Files:**

- Modify: `src/content/home.ts`
- Create: `src/content/features.ts`
- Modify: `tests/unit/home-content.test.ts`
- Create: `tests/unit/features-content.test.ts`

**Interfaces:**

- Consumes: `Locale` from `src/i18n/config.ts`.
- Produces: revised `homeCopy`, existing `platforms` and `platformAction`, plus `featurePageCopy: Record<Locale, FeaturePageCopy>` with six stable category ids and a separate compatibility section.

- [ ] **Step 1: Write failing content-contract tests**

```ts
expect(homeCopy.en.hero.heading).toContain('NAS');
expect(homeCopy.ja.features.items.map(({ title }) => title)).toEqual([
  '原本を汚さない',
  '待たずに読み始める',
  '読み方を妥協しない',
]);
expect(featurePageCopy.en.categories.map(({ id }) => id)).toEqual(
  featurePageCopy.ja.categories.map(({ id }) => id),
);
expect(JSON.stringify(featurePageCopy)).not.toMatch(/cloud sync|EPUB|OCR/i);
```

- [ ] **Step 2: Run tests and verify RED**

Run: `mise exec -- pnpm test tests/unit/home-content.test.ts tests/unit/features-content.test.ts`

Expected: FAIL because the new homepage contract and `src/content/features.ts` do not exist.

- [ ] **Step 3: Implement the minimal typed bilingual copy**

Define concrete hero copy, the three product principles, a feature-page teaser, six feature categories plus a compatibility section, the exact supported archive/image formats, and honest platform limitations.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `mise exec -- pnpm test tests/unit/home-content.test.ts tests/unit/features-content.test.ts`

Expected: PASS.

### Task 2: Localized feature routes and shared navigation

**Files:**

- Create: `src/components/features/FeaturesPage.astro`
- Create: `src/pages/features/index.astro`
- Create: `src/pages/ja/features/index.astro`
- Modify: `src/content/site.ts`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Create: `tests/e2e/features.spec.ts`
- Modify: `tests/unit/i18n.test.ts`

**Interfaces:**

- Consumes: `featurePageCopy`, `localePath(locale, '/features/')`, and `SiteLayout`.
- Produces: static `/features/` and `/ja/features/` pages with reciprocal locale navigation and stable category anchors.

- [ ] **Step 1: Write failing route and localization tests**

```ts
await page.goto('/features/');
await expect(page.getByRole('heading', { level: 1 })).toHaveText(
  'Everything your comic library needs.',
);
await expect(
  page.getByRole('heading', { name: 'Storage & NAS' }),
).toBeVisible();
await expect(page.getByRole('link', { name: '日本語' })).toHaveAttribute(
  'href',
  '/ja/features/',
);
```

- [ ] **Step 2: Run the Playwright test and verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts`

Expected: FAIL with a missing `/features/` route.

- [ ] **Step 3: Implement the feature component, routes, and navigation labels**

Render an intro, anchor navigation, category sections with benefit-first copy, a supported-formats block, platform notes, and a return-to-home CTA.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts`

Expected: PASS for English and Japanese routes.

### Task 3: Rebuild the homepage information hierarchy

**Files:**

- Modify: `src/components/home/HomePage.astro`
- Modify: `tests/e2e/homepage.spec.ts`

**Interfaces:**

- Consumes: revised `homeCopy`, `localePath`, `PlatformCard`.
- Produces: a concrete hero, three differentiator sections, wider-feature teaser, platform availability, and a feature-page CTA.

- [ ] **Step 1: Replace old homepage expectations with failing product-story tests**

```ts
await expect(page.getByRole('heading', { level: 1 })).toContainText('NAS');
await expect(
  page.getByRole('heading', { name: '原本を汚さない' }),
).toBeVisible();
await expect(
  page.getByRole('link', { name: 'すべての機能を見る' }),
).toHaveAttribute('href', '/ja/features/');
await expect(page.locator('.preview-artwork')).toHaveCount(0);
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/homepage.spec.ts`

Expected: FAIL against the existing generic hero and placeholder preview.

- [ ] **Step 3: Implement the new semantic homepage structure**

Replace the fictional-preview-shaped hero with an honest source/read-only/device relationship diagram, add the concrete product principles, and link the wider feature teaser to the localized feature page.

- [ ] **Step 4: Run the homepage test and verify GREEN**

Run: `mise exec -- pnpm exec playwright test tests/e2e/homepage.spec.ts`

Expected: PASS with and without JavaScript.

### Task 4: Responsive presentation and full verification

**Files:**

- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: existing color, spacing, radius, typography, motion, and breakpoint tokens.
- Produces: responsive homepage story panels, feature catalog layout, visible focus states, and reduced-motion-safe presentation.

- [ ] **Step 1: Add failing responsive assertions to the relevant Playwright tests**

Assert one-column mobile layouts, multi-column desktop layouts, no horizontal overflow, and visible feature navigation.

- [ ] **Step 2: Run both E2E files and verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/homepage.spec.ts tests/e2e/features.spec.ts`

Expected: FAIL until the new layout classes have responsive CSS.

- [ ] **Step 3: Implement styles using existing tokens**

Add only the selectors needed by the new semantic structures. Reuse the existing navy, purple, blue, cyan, surface, typography, and motion primitives.

- [ ] **Step 4: Run focused and full quality gates**

Run:

```bash
mise exec -- pnpm format
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm test:e2e
mise exec -- pnpm build
mise exec -- pnpm test:links
```

Expected: all commands pass with no broken localized links or accessibility regressions.
