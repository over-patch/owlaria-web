# Purchase Support FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish accurate English and Japanese Owlaria Plus purchase, restore, and refund guidance at the existing purchase-support URLs.

**Architecture:** Keep all localized support copy in a typed content module and render both locales through one semantic Astro component. Use ordinary headings, links, and article sections so the complete page works without JavaScript; add focused unit and Playwright coverage for content parity, responsibility boundaries, metadata, links, accessibility, and responsive behavior.

**Tech Stack:** Astro 7, strict TypeScript, CSS, Vitest, Playwright, pnpm through mise

## Global Constraints

- English remains the source locale at `/support/purchases/`; Japanese is published simultaneously at `/ja/support/purchases/`.
- Canonical URLs retain trailing slashes and reciprocal `hreflang` metadata.
- Owlaria Plus is a one-time, non-consumable purchase; it is not a subscription.
- iOS and macOS are separate products and purchases; purchases cannot be transferred or restored across operating systems.
- Do not hard-code prices; direct readers to the localized Store price displayed in Owlaria.
- Apple receives, reviews, approves, processes, and reports refund requests; Owlaria and overpatch do not.
- Existing libraries and books remain available after a refund; only additions beyond Free limits are restricted.
- Defer the in-app contact path and Support ID guidance until `over-patch/owlaria#1548` is complete and the public copy can be verified against the shipped flow.
- Use locale-specific Apple support URLs and do not add an unconfirmed web contact link.
- Preserve no-JavaScript behavior, keyboard access, readable contrast, responsive layout, and reduced-motion behavior.

---

### Task 1: Define and verify bilingual purchase-support content

**Files:**

- Create: `src/content/purchases.ts`
- Create: `tests/unit/purchase-content.test.ts`

**Interfaces:**

- Consumes: `Locale` from `src/i18n/config.ts`.
- Produces: `purchaseSupportCopy: Record<Locale, PurchaseSupportCopy>`, where each locale provides metadata, hero text, page navigation, five stable FAQ sections, and locale-appropriate Apple links.

- [ ] **Step 1: Write the failing content contract test**

Create tests that import `purchaseSupportCopy` and require both locales to expose identical FAQ IDs (`price`, `platforms`, `restore`, `refund`, `after-refund`), prohibit currency-like hard-coded prices and subscription-management topics, require the cross-OS purchase warning, require Apple refund responsibility text, require the Free-limit data behavior, assert the locale-specific Apple URLs, and prohibit contact-form or Support ID guidance until the app flow is ready.

- [ ] **Step 2: Run the unit test and verify RED**

Run: `mise exec -- pnpm test tests/unit/purchase-content.test.ts`

Expected: FAIL because `src/content/purchases.ts` does not exist.

- [ ] **Step 3: Add the typed bilingual content**

Define discriminated rich-text parts (`text` and `link`), paragraph blocks, FAQ sections, page metadata, intro copy, navigation labels, and external-link labels. Transcribe the reviewed v1 English and Japanese copy from `over-patch/owlaria#1452`, keeping the wording constraints in Global Constraints exact in meaning.

- [ ] **Step 4: Run the unit test and verify GREEN**

Run: `mise exec -- pnpm test tests/unit/purchase-content.test.ts`

Expected: PASS with both locale contracts satisfied.

- [ ] **Step 5: Commit the content contract**

Run:

```bash
git add src/content/purchases.ts tests/unit/purchase-content.test.ts
git commit -m ":memo: Add bilingual purchase support copy"
```

### Task 2: Render the semantic bilingual FAQ pages

**Files:**

- Create: `src/components/support/PurchaseSupportPage.astro`
- Modify: `src/pages/support/purchases/index.astro`
- Modify: `src/pages/ja/support/purchases/index.astro`
- Modify: `src/content/site.ts`
- Create: `tests/e2e/purchase-support.spec.ts`

**Interfaces:**

- Consumes: `purchaseSupportCopy`, `Locale`, and `SiteLayout`.
- Produces: `PurchaseSupportPage` props `{ locale: Locale }`, rendering the logical pathname `/support/purchases/` for canonical and locale metadata.

- [ ] **Step 1: Write failing page-behavior tests**

Add Playwright tests that require a single localized `h1`, five linked FAQ sections with stable fragment IDs, correct English and Japanese Apple Restore and Refund links, `reportaproblem.apple.com`, explicit iOS/macOS separate-purchase and Apple-refund responsibility copy, no unpublished contact-form or Support ID guidance, one `main` landmark, and locale switching between the two routes.

- [ ] **Step 2: Build and run the page test to verify RED**

Run:

```bash
mise exec -- pnpm build
mise exec -- pnpm exec playwright test tests/e2e/purchase-support.spec.ts
```

Expected: FAIL because the existing FoundationPage does not contain the FAQ heading and sections.

- [ ] **Step 3: Implement the common purchase-support page**

Create `PurchaseSupportPage.astro` with a support hero, short introduction, compact contents navigation, five `<article>` FAQ sections with heading anchors, safe external links using `target="_blank" rel="noreferrer"`, and a final responsibility note. Replace both route entry points with this component and update the existing purchase page metadata copy in `site.ts` to match the published page.

- [ ] **Step 4: Run the page test and verify GREEN**

Run:

```bash
mise exec -- pnpm build
mise exec -- pnpm exec playwright test tests/e2e/purchase-support.spec.ts
```

Expected: PASS for both locales.

- [ ] **Step 5: Commit the semantic page implementation**

Run:

```bash
git add src/components/support/PurchaseSupportPage.astro src/pages/support/purchases/index.astro src/pages/ja/support/purchases/index.astro src/content/site.ts tests/e2e/purchase-support.spec.ts
git commit -m ":sparkles: Publish purchase support FAQ"
```

### Task 3: Polish responsive presentation and complete verification

**Files:**

- Modify: `src/styles/global.css`
- Modify: `tests/e2e/purchase-support.spec.ts`
- Create: `docs/screenshots/3-purchases-desktop.png`
- Modify: `README.md`

**Interfaces:**

- Consumes: semantic class names emitted by `PurchaseSupportPage.astro`.
- Produces: responsive premium support styling with no horizontal overflow at 390px and stable wide-screen reading measure at 1440px.

- [ ] **Step 1: Add failing responsive and no-JavaScript assertions**

Require the contents navigation and all FAQ answers to remain visible with JavaScript disabled, verify no horizontal overflow at 390×844, verify keyboard focus on an external link, and verify reduced-motion mode leaves all content visible and static.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/purchase-support.spec.ts`

Expected: FAIL on the new layout-specific assertion before support-page styling is added.

- [ ] **Step 3: Add focused support-page styling**

Add responsive hero, contents card, FAQ grid, anchored-heading, external-link, callout, and narrow-screen styles using existing tokens. Avoid new dependencies and animations; reuse the global reveal primitive only for progressive enhancement.

- [ ] **Step 4: Run all automated verification**

Run:

```bash
mise exec -- pnpm format
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm lint:actions
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm build
mise exec -- pnpm test:e2e
```

Expected: formatting, lint, Astro checks, unit tests, static build, and Playwright tests all pass without warnings.

- [ ] **Step 5: Perform visual and external-link QA**

Open English and Japanese pages at desktop and 390×844 mobile sizes, inspect the complete pages, capture current desktop evidence, verify mobile behavior through E2E, verify the four locale-specific Apple support URLs and `reportaproblem.apple.com` resolve to official Apple pages, and confirm no fictional product UI or private material is present.

- [ ] **Step 6: Document and commit verification evidence**

Update README status to identify the published purchase-support FAQ, then run:

```bash
git add src/styles/global.css tests/e2e/purchase-support.spec.ts docs/screenshots/3-purchases-desktop.png README.md
git commit -m ":white_check_mark: Verify purchase support experience"
```

### Task 4: Review and publish the change through a pull request

**Files:**

- Modify only files required by review findings, with a failing regression test before each behavior fix.

**Interfaces:**

- Consumes: the completed branch and verification evidence.
- Produces: a reviewable GitHub pull request linked to `over-patch/owlaria-web#3` and recorded in `over-patch/owlaria#1452`.

- [ ] **Step 1: Review the complete diff against Issue #3**

Confirm every completion checkbox is supported by code, tests, or visual evidence; check that the public repository contains no private implementation detail beyond the approved public guidance.

- [ ] **Step 2: Push the feature branch and open the pull request**

Use a Japanese Gitmoji title and include summary, automated verification, desktop evidence, responsive E2E verification, and Apple-link verification. Mark PR #4 ready and merge the publishable FAQ without closing Issue #3. Keep the in-app contact flow and Support ID guidance deferred to a small follow-up after `over-patch/owlaria#1548` is complete.

- [ ] **Step 3: Record the implementation in Owlaria #1452**

Comment with the owlaria-web Issue and pull-request URLs, noting that the public copy becomes authoritative in owlaria-web after merge.

- [ ] **Step 4: Move Project #5 status to In Review**

Move owlaria-web #3 to In Review after PR #4 is ready, but keep the Issue open after merge for the deferred follow-up.

### Task 5: Make purchase guidance discoverable from Support

**Files:**

- Create: `src/content/support.ts`
- Create: `src/components/support/SupportHubPage.astro`
- Modify: `src/pages/support/index.astro`
- Modify: `src/pages/ja/support/index.astro`
- Modify: `src/content/site.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/purchase-support.spec.ts`
- Create: `docs/screenshots/3-support-desktop.png`

**Interfaces:**

- Consumes: the shared header Support links, `Locale`, `localePath()`, and the published purchase-support routes.
- Produces: `SupportHubPage` props `{ locale: Locale }` and a bilingual hub that links to the currently published purchase guidance.

- [ ] **Step 1: Write and verify a failing user-journey test**

Navigate from the localized homepage header to Support, require a locale-matched purchase-guidance link, click it, and require the purchase FAQ heading. Require the deferred contact card to be absent.

Run: `mise exec -- pnpm exec playwright test tests/e2e/purchase-support.spec.ts`

Expected: FAIL because the FoundationPage support placeholder contains no purchase-guidance link.

- [ ] **Step 2: Implement the bilingual Support hub**

Add typed English and Japanese hub copy, render it through one semantic Astro component, replace both support route placeholders, and use `localePath()` for the purchase link.

- [ ] **Step 3: Write and verify a failing responsive layout test**

Require `.support-hub-grid` to use one column at 1440×1000 and 390×844, with no horizontal overflow.

Run: `mise exec -- pnpm exec playwright test tests/e2e/purchase-support.spec.ts --grep 'support hub adapts'`

Expected: FAIL with `.support-hub-grid` using `display: block` before hub styling exists.

- [ ] **Step 4: Add hub styling and visual evidence**

Use existing navy, cyan, blue, glass, radius, focus, and reveal primitives for the responsive purchase-resource card. Capture current desktop evidence as `3-support-desktop.png`; verify mobile layout through the responsive E2E suite.

- [ ] **Step 5: Re-run verification and update PR #4**

Run:

```bash
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm lint:actions
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm build
mise exec -- pnpm test:e2e
```

Expected: every check passes, both localized header-to-FAQ journeys pass, and PR #4 includes current Support hub evidence without deferred inquiry claims.

## Self-Review

- Spec coverage: Every Issue #3 content, localization, responsibility, metadata, navigation, discoverability, responsive, testing, Apple-link, and cross-repository record requirement maps to Tasks 1–5.
- Publication split: Web Issue #3 and `over-patch/owlaria#1452` remain open after PR #4; once `over-patch/owlaria#1548` is complete, add verified contact and Support ID guidance in a small follow-up PR, then close both issues.
- Placeholder scan: The unconfirmed web contact link and unshipped app flow are explicitly excluded from this PR.
- Type consistency: `purchaseSupportCopy`, `PurchaseSupportCopy`, `Locale`, and `PurchaseSupportPage` are introduced once and consumed with the same names.
