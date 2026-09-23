# Prevent Font Flash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the first visit from visibly swapping a system fallback font to the bundled locale font while preserving deterministic bundled fonts in Linux CI.

**Architecture:** Keep the existing locale-specific Fontsource stylesheets and WOFF2 assets. Transform only those generated stylesheets from `font-display: swap` to `font-display: optional`, then preload the Latin font and route-specific Japanese first-viewport Unicode subsets from the HTML head so normal connections render the intended font immediately while slow connections keep a stable fallback instead of swapping late.

**Tech Stack:** Astro 7, Vite, Fontsource variable fonts, Playwright

## Global Constraints

- Work directly on `bugfix/prevent-font-flash`; do not create a worktree.
- Keep the site static and compatible with GitHub Pages.
- Preserve locale isolation: English must not register Noto Sans JP, and Japanese must not register Inter.
- Add a regression test before production changes and observe it fail for the current `swap` behavior.
- Do not edit generated `dist/` output.

---

### Task 1: Lock the stable first-paint contract

**Files:**

- Modify: `tests/e2e/foundation.spec.ts:13-24,169-193`
- Create: `tests/unit/font-build-config.test.ts`
- Create: `src/styles/fontPreloads.ts`
- Modify: `src/layouts/SiteLayout.astro:7-23,67-73`
- Modify: `astro.config.ts:1-14`

**Interfaces:**

- Consumes: locale-specific Fontsource `wght.css` assets already selected by `SiteLayout.astro`.
- Produces: locale-specific `<link rel="preload" as="font">` tags and generated `@font-face` rules whose `font-display` descriptor is `optional`.

- [x] **Step 1: Write the failing Playwright assertion**

Extend `bundledFonts` with every stable Japanese route and its expected first-viewport preload filename fragments. In the locale-font test, inspect `document.styleSheets` for `CSSRule.FONT_FACE_RULE`, collect each `font-display` value, and assert every registered face uses `optional`. Assert each route heading's Latin, kana, and Kanji resolve through the expected family. Also assert the expected font preload links exist and carry `type="font/woff2"` and `crossorigin="anonymous"`.

Add focused unit tests for the build transform: tolerate descriptor whitespace, fail when a Fontsource stylesheet has neither `swap` nor `optional`, reject mixed unexpected descriptors, remain idempotent for an already-stabilized stylesheet, ignore Vite's processed URL module, and ignore unrelated CSS.

- [x] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec playwright test tests/e2e/foundation.spec.ts --project=chromium --grep "loads only its localized bundled font"`

Expected: FAIL because the generated Fontsource faces report `swap` and no font preload links exist.

- [x] **Step 3: Implement the minimal stable-loading behavior**

In `astro.config.ts`, add a narrowly scoped, whitespace-tolerant, idempotent pre-transform Vite plugin that replaces `font-display: swap` with `font-display: optional` only for `@fontsource-variable/inter/wght.css` and `@fontsource-variable/noto-sans-jp/wght.css`, and throws when an unrecognized source stylesheet cannot be stabilized.

In `src/styles/fontPreloads.ts`, import the Inter Latin WOFF2 URL plus the Noto Sans JP Latin and first-viewport Unicode subset URLs, select route-specific sets by locale and pathname, and provide shared and release-detail fallbacks. In `SiteLayout.astro`, emit the selected preload links before the locale font stylesheet link.

- [x] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm exec playwright test tests/e2e/foundation.spec.ts --project=chromium --grep "loads only its localized bundled font"`

Expected: PASS for both `/` and `/ja/`, with only the locale font registered, all faces using `optional`, and the expected preload assets present.

- [x] **Step 5: Refactor while green**

Keep the Vite plugin matcher and replacement constants named, local to `astro.config.ts`, and restricted to the two Fontsource weight stylesheets. Keep preload selection local to `SiteLayout.astro`; do not introduce a new abstraction for two locales.

### Task 2: Validate site-wide compatibility

**Files:**

- Verify: `astro.config.ts`
- Verify: `src/layouts/SiteLayout.astro`
- Verify: `tests/e2e/foundation.spec.ts`

**Interfaces:**

- Consumes: the completed stable font-loading behavior from Task 1.
- Produces: evidence that formatting, linting, Astro types, unit tests, production build, link checks, Chromium E2E, and WebKit font/layout checks remain valid.

- [x] **Step 1: Run static and unit checks**

Run: `pnpm format:check && pnpm lint && pnpm check && pnpm test`

Expected: all commands exit 0.

- [x] **Step 2: Run production build and link validation**

Run: `pnpm build && pnpm test:links`

Expected: both commands exit 0; generated locale font CSS contains `font-display:optional` and no `font-display:swap`.

- [x] **Step 3: Run relevant browser suites**

Run: `pnpm exec playwright test tests/e2e/foundation.spec.ts tests/e2e/webkit-smoke.spec.ts`

Expected: Chromium and WebKit projects pass their applicable tests without overflow or missing-font failures.

- [x] **Step 4: Review the final diff**

Run: `git diff --check && git diff -- astro.config.ts src/layouts/SiteLayout.astro tests/e2e/foundation.spec.ts docs/superpowers/plans/2026-09-24-prevent-font-flash.md`

Expected: no whitespace errors; the diff is limited to the plan, font-loading implementation, and regression coverage.
