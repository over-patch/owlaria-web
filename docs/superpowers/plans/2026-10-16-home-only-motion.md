# Homepage-only Motion Implementation Plan

> **For agentic workers:** Execute the single focused task below in this session, with a separate reviewer before delivery.

**Goal:** Limit entrance motion to the homepage, keep its hero stationary while fading in, and retain slide-up reveals below it.

**Architecture:** Load the reveal script from `HomePage.astro` instead of `SiteLayout.astro`. Give the hero an opacity-only CSS animation and remove unused reveal attributes from other page components.

**Tech Stack:** Astro, TypeScript, CSS, Playwright, pnpm.

## Global Constraints

- Preserve English and Japanese content and static hosting.
- Respect reduced motion and keep content available without JavaScript.
- Implement on `bugfix/home-only-reveal` in an isolated worktree.
- Commit and integrate after the requested visual review.

### Task 1: Scope and verify entrance motion

**Files:**

- Modify: `src/layouts/SiteLayout.astro`, `src/components/home/HomePage.astro`, `src/styles/global.css`.
- Modify: non-home components currently containing `data-reveal`.
- Test: `tests/e2e/motion.spec.ts`, `tests/e2e/purchase-support.spec.ts`.

- [x] Add browser regression coverage for stationary hero fade, below-fold slide-up, static non-home pages, reduced motion, and JavaScript-disabled rendering in both locales.
- [x] Run `mise exec -- pnpm test:e2e tests/e2e/motion.spec.ts --project=chromium` and confirm failures identify the existing hero slide and non-home reveal initialization.
- [x] Remove the shared motion import and import `../../scripts/motion` in the homepage component instead.
- [x] Remove `data-reveal` from the hero and non-home components. Add `animation: hero-fade-in var(--duration-medium) var(--ease-out) both` to `.hero-copy`, with keyframes changing only opacity from 0 to 1. Disable that animation under reduced motion.
- [x] Update support reduced-motion tests to locate the actual headings instead of removed reveal attributes.
- [x] Run the focused motion and existing affected E2E tests, unit tests, formatter check, lint, Astro check, and production build.
- [x] Review the final diff independently and report the worktree and validation.

## Verification Results

- Before implementation: motion regression tests failed in the expected 14 cases (hero fade missing and non-home reveal active).
- After implementation: all 22 motion regressions passed; the 83-test affected Chromium set passed across the initial run and the homepage rerun after updating its obsolete reveal-class assertion.
- Unit tests: 205 passed.
- Lint, Astro check (100 files, no diagnostics), formatting, production builds, and diff whitespace checks passed.
- Independent read-only review: no actionable findings.
- The requester verified the development preview and approved the result before requesting commit, PR creation, and merge.
- Localization validation: 82 tests passed; no localized copy changed.
