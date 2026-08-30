# Feature Page Classification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every feature card belong to a chapter whose heading accurately describes it, while preserving the existing bilingual marketing claims.

**Architecture:** Keep the data-driven `FeaturePageCopy.sections` model and add a fifth `settings` story rather than introducing one-off markup. Remove one duplicated metadata card, move preferences out of history, and keep compatibility and availability as specification and CTA blocks outside the feature-story navigation.

**Tech Stack:** Astro, TypeScript, Vitest, Playwright, CSS

## Global Constraints

- Keep English and Japanese section IDs, ordering, items, and platform availability structurally aligned.
- Do not add product capabilities. Reclassify existing claims, broaden the viewer story so streaming, cache, offline use, and reading controls share one clear promise, preserve the user-approved streaming wording, and clarify the prefetch label.
- Preserve `environment`, `formats`, and `availability` as supporting specification blocks outside `sections`.
- Do not create a worktree or commit; the user requested work directly on the existing feature branch.

---

### Task 1: Lock the revised taxonomy in content tests

**Files:**

- Modify: `tests/unit/features-content.test.ts`

**Interfaces:**

- Consumes: `featurePageCopy: Record<Locale, FeaturePageCopy>`
- Produces: Assertions for section IDs and item ownership

- [ ] **Step 1: Write the failing taxonomy test**

```ts
expect(featurePageCopy.en.sections.map(({ id }) => id)).toEqual([
  'sources',
  'library',
  'viewer',
  'everyday',
  'settings',
]);
expect(
  japaneseLibrary?.items.some(
    ({ title }) => title === '整理情報はOwlariaだけに保存',
  ),
).toBe(false);
expect(japaneseEveryday?.items.map(({ title }) => title)).toEqual([
  'プライベートライブラリ',
  '履歴から続きを読む',
  '読書統計',
]);
expect(japaneseSettings?.items.map(({ title }) => title)).toEqual([
  '好みに合わせた設定',
  'キーボードショートカット',
]);
```

- [ ] **Step 2: Verify RED**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: FAIL because `settings` does not exist and the two settings items still belong to `everyday`.

### Task 2: Reclassify bilingual feature content and icons

**Files:**

- Modify: `src/content/features.ts`
- Modify: `src/components/features/FeaturesPage.astro`

**Interfaces:**

- Produces: `FeatureSectionId` including `'settings'`
- Produces: five aligned feature stories with icon arrays matching item order

- [ ] **Step 1: Add the `settings` section ID and bilingual 05 copy**

Use the following Japanese story:

```ts
{
  id: 'settings',
  number: '05',
  label: '設定・操作',
  heading: '見た目も、操作も、自分に合わせる。',
  body: 'テーマやページ表現、Macのショートカットを好みに合わせて調整できます。',
  platforms: ['mac', 'iphone'],
  visual: 'cards',
  items: [
    { title: '好みに合わせた設定', body: 'テーマ、背景、ページ表現を調整できます。' },
    { title: 'キーボードショートカット', body: 'Macのショートカットを好みに合わせて変更できます。', platforms: ['mac'] },
  ],
}
```

Add equivalent English copy titled `Make Owlaria look and work your way.`

- [ ] **Step 2: Remove the duplicated metadata card and clarify prefetching**

Delete `Metadata stays in Owlaria` / `整理情報はOwlariaだけに保存`. Rename `Prepare nearby pages` / `読む方向に先読み` to `Prefetch the next pages` / `次のページを先読み` without changing their bodies.

- [ ] **Step 3: Update icon ownership**

```ts
library: ['search', 'filename', 'series', 'folder', 'cover', 'tracking', 'explorer'],
everyday: ['lock', 'history', 'chart'],
settings: ['sliders', 'keyboard'],
```

- [ ] **Step 4: Verify GREEN**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: 13 tests pass.

### Task 3: Keep five-section navigation responsive

**Files:**

- Modify: `src/styles/global.css`
- Modify: `tests/e2e/features.spec.ts`

**Interfaces:**

- Consumes: five rendered `copy.sections` navigation entries
- Produces: 5 desktop columns, 3 compact-desktop columns, 1 mobile column

- [ ] **Step 1: Update the failing responsive expectation**

Keep `1` column at 390px and 768px, expect `3` columns from 800px through 820px, and expect `5` columns from 1024px through 1440px.

- [ ] **Step 2: Verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts --project=chromium`

Expected: FAIL because desktop still renders four columns and tablet still renders two.

- [ ] **Step 3: Implement the navigation grid**

Set `.feature-jump-nav ol` to five columns by default and three columns below 60rem. Preserve the existing single-column rule below 48rem.

- [ ] **Step 4: Verify GREEN and quality checks**

Run:

```sh
mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts --project=chromium
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm check
git diff --check
```

Expected: all commands pass without errors.

### Task 4: Visual browser verification

**Files:** None

**Interfaces:**

- Consumes: `http://127.0.0.1:4322/ja/features/`
- Produces: visual confirmation of sections 02, 04, and 05

- [ ] **Step 1: Reload the existing in-app browser tab**

Confirm the jump navigation has five entries and the Japanese item titles are owned by the intended sections.

- [ ] **Step 2: Inspect desktop layout**

Verify 02 has seven cards, 04 has three cards, and 05 has two cards without overlap or misleading grouping.
