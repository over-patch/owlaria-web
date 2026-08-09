# Problem Report Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add matching English and Japanese guidance for Owlaria's implemented in-app problem-report flow to the purchases FAQ and Support hub.

**Architecture:** Extend the existing typed locale content instead of adding a web form or URL. Add one stable FAQ entry for the complete purchase/restore/refund-state reporting boundary and one non-link Support hub card for the in-app route, then render both through the existing static Astro components.

**Tech Stack:** Astro 7, strict TypeScript, Vitest, Playwright, Prettier, ESLint, pnpm

## Global Constraints

- English is the source locale and Japanese must carry the same meaning.
- The normal route is exactly `Settings > Information > Report a problem`; eligible billing errors may expose `Report this problem`.
- The form is a one-way problem report and feedback channel, not individual support; no reply, investigation result, fix, or timing is promised.
- Do not describe collection of names, email addresses, reply preferences, subjects, or attachments.
- Diagnostics are reviewable before submission and sent only when selected for that submission; category and description remain sufficient without diagnostics.
- Support ID is the current RevenueCat App User ID when available, not an Apple Account or Owlaria account; do not request manual entry and allow reports without it.
- A successful submission's reference number can confirm submission and support data access/deletion questions.
- Apple retains responsibility for refund requests, reviews, approvals, processing, and status; do not route refund decisions to Owlaria.
- Do not add a nonexistent web form URL.
- Keep existing purchase, platform-product, restore, refund, post-refund, and Free-tier-limit guidance unchanged.
- Keep Owlaria #1548's packaged production smoke test explicitly out of scope.

---

### Task 1: Specify localized problem-report content

**Files:**

- Modify: `tests/unit/purchase-content.test.ts`
- Modify: `tests/e2e/purchase-support.spec.ts`

**Interfaces:**

- Consumes: `purchaseSupportCopy`, `supportHubCopy`, and the rendered `/support/`, `/ja/support/`, `/support/purchases/`, `/ja/support/purchases/` routes.
- Produces: Regression expectations for FAQ id `problem-report`, in-app routes, one-way intake boundaries, diagnostics consent, Support ID semantics, reference numbers, Apple responsibility, locale switching, Apple links, no web form links, responsive layouts, no-JavaScript, keyboard access, and reduced motion.

- [ ] **Step 1: Replace the pre-launch negative unit test with failing published-flow tests**

Add `problem-report` to `expectedFaqIds`; assert the English and Japanese copy contains the exact settings route, billing-error shortcut, one-way/no-reply boundary, non-collected contact fields, optional reviewed diagnostics, current RevenueCat App User ID meaning, no-manual-entry/no-ID path, reference-number use, and Apple-only refund boundary. Assert serialized support content contains no `mailto:`, web form URL, or promise of a reply or fix.

- [ ] **Step 2: Run the focused unit test and verify RED**

Run: `TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm test tests/unit/purchase-content.test.ts`

Expected: FAIL because `problem-report` and `supportHubCopy.*.problemReport` do not exist and the former pre-launch copy omits the required guidance.

- [ ] **Step 3: Update the purchase E2E contract before production content**

Add localized expected strings for the settings route, Support hub problem-report title, one-way boundary, and Support ID. Replace `unpublishedGuidance` negative assertions with positive visibility assertions; expect six FAQ links/articles, a static `[data-support-problem-report]` card without anchors, two desktop grid columns and one mobile column, and preserve locale-switch and Apple-link assertions.

- [ ] **Step 4: Run the focused E2E and verify RED**

Run: `TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm exec playwright test tests/e2e/purchase-support.spec.ts`

Expected: FAIL because the sixth FAQ and Support hub problem-report card are not rendered.

### Task 2: Publish the localized guidance

**Files:**

- Modify: `src/content/purchases.ts`
- Modify: `src/content/support.ts`
- Modify: `src/components/support/SupportHubPage.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: Existing `PurchaseFaq`, `PurchaseTextPart`, and `SupportHubCopy` locale structures.
- Produces: `PurchaseFaqId` value `problem-report`; `supportHubCopy[locale].problemReport` with `label`, `title`, and `paragraphs`; static rendered guidance marked by `data-support-problem-report`.

- [ ] **Step 1: Add the English source FAQ**

Append `problem-report` to `purchaseFaqIds` and add an English FAQ answering when and how to report an app-side purchase, restore, or completed-refund reflection problem. Include `Settings > Information > Report a problem`, `Report this problem`, category/description requirements, one-way/no-contact/no-promise boundaries, per-submission diagnostics review and consent, optional diagnostics, current RevenueCat App User ID semantics, no manual entry and unavailable-ID handling, and reference-number uses.

- [ ] **Step 2: Add the corresponding Japanese FAQ**

Add a Japanese `problem-report` entry with the same paragraph boundaries and meaning, keeping the two English UI labels exact while explaining them in Japanese.

- [ ] **Step 3: Extend typed Support hub copy**

Add `problemReport: { label: string; title: string; paragraphs: string[] }` to `SupportHubCopy`. English and Japanese paragraphs must direct users to the exact in-app route and identify the channel as one-way, with no contact details, reply, investigation-result notice, or fix promise.

- [ ] **Step 4: Render a non-link Support hub card**

Render `page.problemReport` as a second `<article class="support-hub-card support-hub-card--available" data-support-problem-report data-reveal>` with label, heading, and paragraphs. Do not add an `<a>`, placeholder URL, disabled link, or fake action.

- [ ] **Step 5: Adapt the Support hub grid**

Set the desktop resource grid to two columns while retaining the existing single-column mobile breakpoint, card readability, focus behavior for the purchases link, and no horizontal overflow.

- [ ] **Step 6: Run focused unit and E2E tests and verify GREEN**

Run:

```bash
TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm test tests/unit/purchase-content.test.ts
pnpm build
TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm exec playwright test tests/e2e/purchase-support.spec.ts
```

Expected: All focused unit and Playwright tests pass.

### Task 3: Verify and deliver the branch

**Files:**

- Modify: formatting-only changes in the files above if produced by Prettier

**Interfaces:**

- Consumes: Completed content, rendering, CSS, and regression tests.
- Produces: A committed, pushed feature branch and a ready-for-review PR related to owlaria-web Issue #3.

- [ ] **Step 1: Format and run all required checks**

Run:

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm check
TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm test
TMPDIR=/private/tmp/owlaria-web-problem-report-tests pnpm test:e2e
pnpm build
```

Expected: formatter, lint, Astro/TypeScript checks, all unit tests, all E2E tests, and production build pass.

- [ ] **Step 2: Review the diff and verify scope**

Run: `git diff --check && git diff --stat && git diff`

Expected: Only the plan, localized content, Support hub renderer/styles, and tests change; no web form URL, unrelated purchase copy, secrets, or generated output is added.

- [ ] **Step 3: Commit the implementation**

Run:

```bash
git add docs/superpowers/plans/2026-08-09-problem-report-guidance.md src/content/purchases.ts src/content/support.ts src/components/support/SupportHubPage.astro src/styles/global.css tests/unit/purchase-content.test.ts tests/e2e/purchase-support.spec.ts
git commit -m ":sparkles: Add in-app problem report guidance"
```

Expected: One focused commit on `feature/problem-report-guidance`.

- [ ] **Step 4: Request code review and resolve findings**

Compare `origin/main` to `HEAD` against Issue #3 and this plan. Fix all Critical and Important findings and rerun affected checks before continuing.

- [ ] **Step 5: Push and create the PR**

Push `feature/problem-report-guidance` and create a ready PR titled `:sparkles: アプリ内問題報告の案内を追加`. The body must summarize changes, list verification and visual evidence or its status, relate Issue #3, state that Owlaria #1548's packaged production smoke test remains separate and incomplete, and state that the PR must not merge before team approval.

- [ ] **Step 6: Report follow-up updates**

Return the PR URL and specify that Issue #3 and Owlaria #1452 should receive the PR/public URL now, then have completion conditions updated and be closed only after merge. Do not close Owlaria #1548.
