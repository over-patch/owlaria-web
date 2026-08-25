# Sitewide Semantic Heading Wrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply phrase-aware line wrapping to every visible heading on every Japanese Owlaria website screen without changing accessible heading text or introducing horizontal overflow.

**Architecture:** Keep explicitly authored `HeadlineLines` and `SemanticPhraseText` boundaries for design-critical headings. Add a shared Japanese heading rule using `word-break: auto-phrase` for every `h1`–`h6`. Where that CSS feature is unavailable, use `Intl.Segmenter` to add word-boundary `<wbr>` opportunities while retaining `keep-all` and strict kinsoku processing. If both phrase-aware CSS and the script are unavailable, fall back to standards-based Japanese line breaking so text remains visible. Remove existing emergency `overflow-wrap: anywhere` heading breaks that would defeat the rule.

**Tech Stack:** Astro 7, TypeScript, CSS Text Module Level 4, Playwright, Vitest

## Global Constraints

- Apply the mechanism to all Japanese headings (`h1` through `h6`) across home, features, support, purchases, legal, and release screens.
- Preserve the existing English rendering and every heading's accessible name.
- Preserve explicitly authored desktop/mobile lines and manual semantic phrase boundaries.
- On unsupported browsers, preserve Japanese word boundaries, kinsoku processing, and readability without clipping; do not use `overflow-wrap: anywhere`.
- Do not add a third-party runtime dependency. The small fallback script must be inert where `auto-phrase` is supported.
- Do not commit unless the user explicitly requests a commit.

---

### Task 1: Sitewide heading-wrap contract

**Files:**

- Create: `tests/e2e/heading-wrap.spec.ts`
- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: Japanese routes rendered with `html[lang='ja']` and existing semantic heading components.
- Produces: A sitewide CSS contract where every Japanese `h1`–`h6` computes to `word-break: auto-phrase` on supported browsers.

- [x] **Step 1: Write the failing E2E test**

Create a data-driven Playwright test for `/ja/`, `/ja/features/`, `/ja/support/`, `/ja/support/purchases/`, `/ja/privacy/`, `/ja/terms/`, `/ja/releases/`, and a fixture-backed release detail. At 390×844 and 1098×862, assert that every page heading (including footer headings) computes to `word-break: auto-phrase`, that the standards-based fallback remains within the viewport, and that each page still has exactly one visible H1 with a non-empty accessible name.

- [x] **Step 2: Run the test and verify RED**

Run:

```bash
mise exec -- pnpm exec playwright test tests/e2e/heading-wrap.spec.ts --project=chromium
```

Expected: FAIL because plain headings currently compute to `word-break: normal` or `keep-all`.

- [x] **Step 3: Implement the shared CSS mechanism**

Add a Japanese-only fallback rule for all heading levels. Keep authored and segmented break opportunities in unsupported browsers, and expose the selected value through a custom property so the fallback can be exercised in Chromium tests:

```css
html[lang='ja'] {
  --heading-word-break: normal;
}

html[lang='ja'] :where(h1, h2, h3, h4, h5, h6) {
  line-break: strict;
  overflow-wrap: normal;
  word-break: var(--heading-word-break);
}

@supports (word-break: auto-phrase) {
  html[lang='ja'] {
    --heading-word-break: auto-phrase;
  }
}
```

Update the two existing Japanese heading selectors that specify `overflow-wrap: anywhere` and `word-break: keep-all` so they no longer override the sitewide phrase-aware behavior.

Add a feature-detected fallback script that uses `Intl.Segmenter('ja', { granularity: 'word' })` to insert `<wbr>` only at semantic word boundaries when `auto-phrase` is unavailable. Keep Japanese particles and connective suffixes attached to the preceding word. Simulate the unsupported-browser branch in Playwright and assert `keep-all`, inserted break opportunities, unchanged heading text, and no overflow across every route family.

- [x] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: all route/viewport cases pass.

- [x] **Step 5: Run proportional quality gates**

Run:

```bash
mise exec -- pnpm exec prettier --check src/styles/global.css tests/e2e/heading-wrap.spec.ts
mise exec -- pnpm exec eslint tests/e2e/heading-wrap.spec.ts
mise exec -- pnpm check
env TMPDIR=/private/tmp mise exec -- pnpm test
mise exec -- pnpm exec playwright test tests/e2e/heading-wrap.spec.ts tests/e2e/homepage.spec.ts tests/e2e/features.spec.ts tests/e2e/purchase-support.spec.ts tests/e2e/legal-pages.spec.ts tests/e2e/releases.spec.ts --project=chromium
git diff --check
```

Expected: formatting, lint, Astro diagnostics, all 135 unit tests, affected E2E suites, and diff validation pass.

- [x] **Step 6: Add a manual semantic boundary for the purchase-support title**

Use `SemanticPhraseText` for the purchase-support H1 because the automatic Japanese segmentation can leave `購入・` at the end of a line. Keep the global `auto-phrase` rule as the default, while expressing this design-critical title as `Owlaria Plusの` / `購入・復元・返金について`. Cover both locales with a regression assertion for the authored phrase spans.

- [x] **Step 7: Perform browser verification**

Restart the dev server at `http://127.0.0.1:4322`, reload the in-app browser, and inspect representative Japanese headings on home, features, purchases, privacy, terms, and releases at the current desktop viewport. Confirm that no title ends with a single orphaned character and that explicit marketing line breaks remain unchanged.

## Self-Review

- Spec coverage: all current public Japanese screen families and heading levels are covered by one shared rule and route-driven E2E test.
- Placeholder scan: no placeholders or deferred implementation steps remain.
- Type consistency: design-critical headings expose typed phrase arrays, while all other headings inherit the shared CSS behavior.
