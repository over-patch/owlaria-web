# Marketing Pages Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Owlaria home and features pages so prerelease visitors understand the product, free tier, platform differences, supported SMB environment, and next actions while improving metadata, asset delivery, and Safari coverage.

**Architecture:** Keep localized copy in the existing typed content modules and render reusable presentation through the existing Astro components. Add behavior assertions to unit and Playwright tests before changing production content, then optimize locale-specific font imports through layout-level CSS selection and extend the Playwright project matrix with WebKit.

**Tech Stack:** Astro 7, TypeScript, Vitest, Playwright, CSS, pnpm

## Global Constraints

- English remains the source locale and Japanese remains under `/ja/`.
- Keep the existing English-only social image for now.
- Show the accurate free tier: every feature, one library, up to 100 books; Owlaria Plus removes the limits.
- Show prerelease product visuals as intentional `Coming soon` experiences, never as internal replacement instructions.
- State that SMB 2.0 or later is supported and SMB 1.0 is not supported.
- Preserve static GitHub Pages output and no-JavaScript usability.

---

### Task 1: Correct the home-page message hierarchy and conversion path

**Files:**

- Modify: `tests/unit/home-content.test.ts`
- Modify: `tests/e2e/homepage.spec.ts`
- Modify: `src/content/home.ts`
- Modify: `src/components/home/HomePage.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: `HomeCopy`, `localePath(locale, pathname)`
- Produces: localized hero actions, exact free-tier copy, intentional coming-soon preview copy, and a shorter top-page story

- [ ] Add failing unit assertions for localized CTA labels, accurate free-tier language, SEO titles, and public coming-soon preview text.
- [ ] Run `mise exec -- pnpm exec vitest run tests/unit/home-content.test.ts` and confirm the new assertions fail for missing fields or old copy.
- [ ] Add failing E2E assertions that the hero exposes the features and purchase actions above the long-form content and does not expose replacement-note language.
- [ ] Implement typed CTA content, accurate pricing copy, revised titles, intentional preview labels, and remove the redundant product-story section from the home-page sequence.
- [ ] Add compact hero-action styling and run the two focused test files until green.

### Task 2: Explain platform differences and supported environments

**Files:**

- Modify: `tests/unit/features-content.test.ts`
- Modify: `tests/e2e/features.spec.ts`
- Modify: `src/content/features.ts`
- Modify: `src/components/features/FeaturesPage.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: `FeaturePageCopy.sections`, `FeatureItem`
- Produces: typed platform badges per feature and localized SMB environment content

- [ ] Add failing unit assertions for Mac/iPhone platform labels, SMB 2.0/3.0 support, SMB 1.0 exclusion, and public coming-soon preview language.
- [ ] Run `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts` and confirm the new assertions fail.
- [ ] Add failing E2E assertions for rendered platform badges and the supported-environment section.
- [ ] Add typed `platforms` metadata to feature items, render badges, add the supported-environment row, and replace internal preview notes with localized coming-soon language.
- [ ] Run the focused unit tests and relevant E2E tests until green.

### Task 3: Optimize locale fonts and extend Safari coverage

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `playwright.config.ts`
- Modify: `tests/e2e/foundation.spec.ts`

**Interfaces:**

- Consumes: layout `locale`, Playwright `devices`
- Produces: locale-selected font stylesheets and Chromium/WebKit desktop/mobile projects

- [ ] Add a failing E2E/source contract assertion that English pages do not load Noto Sans JP and Japanese pages do not load unused Inter subsets.
- [ ] Add failing config assertions for Desktop Safari and iPhone WebKit projects.
- [ ] Move font imports out of the global stylesheet and select the generated font stylesheet URL by locale in `SiteLayout`.
- [ ] Add Desktop Safari and iPhone WebKit projects while keeping the existing Chromium project.
- [ ] Run format, lint, Astro check, unit tests, build, link checks, and the Playwright suite.

### Task 4: Visual and regression verification

**Files:**

- Verify: `src/components/home/HomePage.astro`
- Verify: `src/components/features/FeaturesPage.astro`
- Verify: `src/styles/global.css`

**Interfaces:**

- Consumes: built site and browser viewports
- Produces: evidence that English/Japanese desktop/mobile layouts remain usable

- [ ] Build and open `/`, `/ja/`, `/features/`, and `/ja/features/` at 1440×1000 and 390×844.
- [ ] Confirm CTA placement, intentional coming-soon presentation, platform badges, SMB environment copy, and absence of horizontal overflow.
- [ ] Run `mise exec -- pnpm format:check`, `mise exec -- pnpm lint`, `mise exec -- pnpm check`, `mise exec -- pnpm test`, `mise exec -- pnpm build`, `mise exec -- pnpm test:links`, and `mise exec -- pnpm test:e2e`.
- [ ] Review the final diff for scope, secrets, generated output, and unrelated changes.
