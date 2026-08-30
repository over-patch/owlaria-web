# Library and Statistics Feature Reclassification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the catch-all Reading chapter with distinct Organize, Library, Viewer, Statistics, and Settings stories, placing saved reading position and private-library protection under Library.

**Architecture:** Keep the existing data-driven `FeatureSection` rendering and split the content records into six ordered sections shared by English and Japanese. Update icon mappings and the desktop navigation grid to match the new section boundaries; preserve the existing viewer and responsive component structure.

**Tech Stack:** Astro, TypeScript, Vitest, Playwright, CSS

## Global Constraints

- Use six concise chapter labels: Sources/フォルダ, Organize/整理, Library/ライブラリ, Viewer/ビューア, Statistics/統計, Settings/設定.
- Treat saved reading position and private-library protection as Library capabilities.
- Keep statistics limited to already-supported dimensions: reading amount, active hours, and tag trends.
- Keep English and Japanese section IDs, ordering, platforms, and item counts aligned.
- Do not create a git commit unless the user explicitly requests one.

---

### Task 1: Specify the six-section content model

**Files:**

- Modify: `tests/unit/features-content.test.ts`
- Modify: `tests/e2e/features.spec.ts`

**Interfaces:**

- Consumes: `featurePageCopy.en.sections` and `featurePageCopy.ja.sections` from `src/content/features.ts`
- Produces: Assertions for section IDs `sources`, `organize`, `library`, `viewer`, `statistics`, `settings`

- [x] **Step 1: Write the failing unit tests**

Assert both locales use the six IDs and concise labels. Assert Organize contains search, filename metadata, tracking, and Explorer items; Library contains series, cover, private-library, and saved-position items; Statistics contains reading amount, active hours, and tag trends.

- [x] **Step 2: Write the failing E2E expectations**

Update navigation labels, section count, icon counts, and icon ordering for the six sections.

- [x] **Step 3: Run tests to verify they fail**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: FAIL because the content still has five sections and an `everyday` chapter.

### Task 2: Implement the new content taxonomy

**Files:**

- Modify: `src/content/features.ts`

**Interfaces:**

- Consumes: Existing `FeatureSection`, `FeatureItem`, and locale copy structures
- Produces: Six aligned English/Japanese feature sections

- [x] **Step 1: Expand the section ID union**

Replace the old `everyday` ID and distinguish `organize`, `library`, and `statistics`.

- [x] **Step 2: Split Organize and Library**

Move search, filename metadata, file tracking, and Explorer into Organize. Move series continuation, folder-based series creation, cover editing, private-library protection, and saved reading position into Library.

- [x] **Step 3: Create Statistics**

Use three cards for reading amount, active hours, and tag trends, reusing only the existing statistics dimensions.

- [x] **Step 4: Renumber Viewer and Settings**

Set Viewer to 04, Statistics to 05, and Settings to 06 in both locales.

- [x] **Step 5: Run the unit test to verify it passes**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: PASS.

### Task 3: Align presentation and icons

**Files:**

- Modify: `src/components/features/FeaturesPage.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/features/FeatureGlyph.astro` only if an icon name is not already supported

**Interfaces:**

- Consumes: `section.id` and ordered feature items
- Produces: Matching icons and a balanced six-item navigation grid

- [x] **Step 1: Update feature-card icon mappings**

Map Organize to search, filename, tracking, and Explorer icons; Library to series, folder, cover, lock, and history icons; Statistics to chart/clock/chart-related supported icons; Settings remains sliders and keyboard.

- [x] **Step 2: Update section-specific layout selectors**

Replace `feature-story-everyday` selectors with the new Library/Statistics selectors where special card layout is required.

- [x] **Step 3: Change the desktop navigation grid**

Use six equal columns above 60rem and retain the existing three-column and one-column responsive breakpoints.

- [x] **Step 4: Run formatting and static checks**

Run: `mise exec -- pnpm format:check && mise exec -- pnpm lint && mise exec -- pnpm check`

Expected: All commands pass without diagnostics.

### Task 4: Verify the complete feature page

**Files:**

- Test: `tests/e2e/features.spec.ts`

**Interfaces:**

- Consumes: Rendered `/features/` and `/ja/features/` pages
- Produces: Verified desktop/mobile navigation, section content, icons, and overflow behavior

- [x] **Step 1: Run all unit tests**

Run: `mise exec -- pnpm test`

Expected: All tests pass.

- [x] **Step 2: Run feature-page E2E tests**

Run: `mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts --project=chromium`

Expected: All feature-page scenarios pass.

- [x] **Step 3: Check the diff**

Run: `git diff --check`

Expected: No whitespace errors.

- [x] **Step 4: Inspect the Japanese page in the in-app browser**

Open `/ja/features/#library` and `/ja/features/#statistics`; confirm navigation, headings, cards, and responsive layout are visually coherent.
