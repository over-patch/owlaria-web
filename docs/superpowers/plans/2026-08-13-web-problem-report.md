# Web Problem Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible English/Japanese one-way problem-report form to the existing Support hub and submit only the approved Owlaria Web payload to overpatch-helpdesk.

**Architecture:** Keep the static Astro pages and progressively enhance a semantic HTML form with a focused browser-side TypeScript controller. Put the API/payload/error behavior in a framework-independent module so Vitest can prove validation, idempotency, field exclusion, status mapping, timeout/offline behavior, and `Retry-After`; use Playwright route fixtures for localized UI and accessibility coverage without writing production data.

**Tech Stack:** Astro 7, strict TypeScript, browser `fetch`, Vitest, Playwright, pnpm.

## Global Constraints

- English remains the source locale at `/support/`; Japanese is published with equivalent meaning at `/ja/support/`.
- The only user inputs are category and a required problem description of at most 8,000 characters.
- The payload always uses `application_id = owlaria`, `consent.diagnostics_approved = false`, and privacy notice version `2026-07-26`.
- Send only `client.consumer_type = web` and `client.platform = web` to identify the Web source; never send other client metadata, `support_identity`, `diagnostics`, `subject`, `contact`, or app-only diagnostic metadata from the Web form.
- Treat HTTP 201 and idempotent HTTP 200 as success; retain one `client_request_id` for retries of the same logical submission.
- Never persist the report message; clear it after success and rely on page lifetime only for a failed submission retry.
- Use only the public overpatch-helpdesk intake API, with one environment-overridable base URL definition.
- Preserve keyboard access, visible focus, screen-reader announcements, IME composition, reduced-motion behavior, and responsive no-overflow layouts.
- Do not perform production POST smoke tests from automated tests.

---

### Task 1: API contract and validation core

**Files:**

- Create: `src/lib/problem-report.ts`
- Create: `src/config/helpdesk.ts`
- Create: `tests/unit/problem-report.test.ts`

**Interfaces:**

- Produces: `validateProblemReport`, `createProblemReportAttempt`, `submitProblemReport`, `parseRetryAfter`, `ProblemReportPayload`, `ProblemReportErrorKind`, and `HELPDESK_INTAKE_URL`.
- Consumes: browser-compatible `fetch`, `crypto.randomUUID`, `AbortController`, and an injectable clock/UUID/fetch implementation for deterministic tests.

- [ ] **Step 1: Write failing validation and payload tests**

  Add Vitest cases proving category membership, required/8,000-character message boundaries, exact payload keys, `diagnostics_approved: false`, omitted forbidden fields, and one request ID retained by the same attempt.

- [ ] **Step 2: Run test to verify RED**

  Run: `env TMPDIR=/private/tmp pnpm test tests/unit/problem-report.test.ts`
  Expected: FAIL because `src/lib/problem-report.ts` does not exist.

- [ ] **Step 3: Implement the minimal payload core**

  Define the six stable categories, validate without trimming user content from the transmitted message, construct exactly `{ application_id, client_request_id, category, message, consent, client }` with only the approved Web source markers in `client`, and retain an immutable request ID on the attempt object.

- [ ] **Step 4: Run test to verify GREEN**

  Run: `env TMPDIR=/private/tmp pnpm test tests/unit/problem-report.test.ts`
  Expected: PASS.

- [ ] **Step 5: Write failing transport/error tests**

  Add cases for 201/200 success, invalid success JSON, 400, 403, 413, 429 with seconds/date `Retry-After`, 5xx, timeout, offline/network failure, and raw API message suppression.

- [ ] **Step 6: Run transport tests to verify RED**

  Run: `env TMPDIR=/private/tmp pnpm test tests/unit/problem-report.test.ts`
  Expected: FAIL because submission and error normalization are absent.

- [ ] **Step 7: Implement the minimal transport**

  POST JSON to the injected intake URL, set `Content-Type: application/json`, abort after the configured timeout, accept only 200/201 with `reference_number`, parse `Retry-After`, and return stable internal error kinds without exposing response messages.

- [ ] **Step 8: Run transport tests to verify GREEN**

  Run: `env TMPDIR=/private/tmp pnpm test tests/unit/problem-report.test.ts`
  Expected: PASS.

### Task 2: Localized form, progressive enhancement, and styling

**Files:**

- Create: `src/content/problem-report.ts`
- Create: `src/components/support/ProblemReportForm.astro`
- Create: `src/scripts/problem-report-form.ts`
- Modify: `src/components/support/SupportHubPage.astro`
- Modify: `src/content/support.ts`
- Modify: `src/styles/global.css`
- Modify: `tests/unit/problem-report-content-contract.test.ts`
- Modify: `tests/unit/helpers/problem-report-content-contract.ts`
- Modify: `tests/unit/purchase-content.test.ts`

**Interfaces:**

- Consumes: Task 1 validation/attempt/submission APIs and locale-aware `/privacy/` links.
- Produces: one `[data-problem-report-form]` per Support page, localized field labels/notices/statuses, receipt copy UI, and a no-JavaScript fallback.

- [ ] **Step 1: Write failing content-contract tests**

  Replace the obsolete “no web form” expectation with exact requirements for category labels, one-way/no-reply policy, prohibited-information warning, Privacy Policy route, app-form alternative, localized errors, and no contact/subject fields.

- [ ] **Step 2: Run content tests to verify RED**

  Run: `env TMPDIR=/private/tmp pnpm test tests/unit/problem-report-content-contract.test.ts tests/unit/purchase-content.test.ts`
  Expected: FAIL because the Support hub still contains app-only guidance.

- [ ] **Step 3: Add localized form markup and copy**

  Render semantic `label`, `select`, `textarea maxlength="8000"`, character count, privacy/app notices, submit button, validation/status live regions, success receipt with copy button, and `<noscript>` guidance. Do not render any contact, subject, diagnostics, Support ID, or attachment control.

- [ ] **Step 4: Add progressive enhancement controller**

  Intercept valid submissions, focus validation errors, preserve the same attempt across retry, invalidate it when input changes, prevent double submission and composition-Enter submission, map stable errors to localized UI, respect `Retry-After`, clear report data after success/page departure, and copy the receipt through the Clipboard API.

- [ ] **Step 5: Integrate and style the form**

  Place the form after Support resources, retain app-report guidance as the diagnostic-capable alternative, and add responsive/focus/disabled/error/success styling using existing tokens.

- [ ] **Step 6: Run content/unit tests to verify GREEN**

  Run: `env TMPDIR=/private/tmp pnpm test`
  Expected: PASS.

### Task 3: Browser behavior and isolated API contract fixture

**Files:**

- Create: `tests/e2e/problem-report.spec.ts`
- Modify: `tests/e2e/purchase-support.spec.ts`

**Interfaces:**

- Consumes: rendered form data attributes and the overpatch-helpdesk `POST /v1/inquiries` response contract.
- Produces: browser regression coverage without contacting production.

- [ ] **Step 1: Write failing localized rendering/accessibility tests**

  Verify both locales, exact six options, accessible names, Privacy Policy route, app-form guidance, no forbidden controls, 8,000 boundary, error focus, keyboard submission, IME Enter suppression, and no-JavaScript fallback.

- [ ] **Step 2: Run E2E test to verify RED**

  Run: `env TMPDIR=/private/tmp pnpm exec playwright test tests/e2e/problem-report.spec.ts`
  Expected: FAIL until all browser behavior is present.

- [ ] **Step 3: Add isolated route fixtures for contract and retry behavior**

  Intercept the intake URL and assert the exact request payload; return 201 and idempotent 200 receipts; exercise copy, 400/403/413/429/5xx/offline mappings, `Retry-After`, duplicate-click prevention, and same-ID retry.

- [ ] **Step 4: Make browser tests GREEN**

  Adjust only production behavior required by failing browser tests, then rerun the focused spec until it passes.

- [ ] **Step 5: Add desktop/mobile layout checks**

  At 1440×1000 and 390×844, prove readable layout, form visibility, usable controls, and no horizontal overflow.

- [ ] **Step 6: Run complete E2E suite**

  Run: `env TMPDIR=/private/tmp pnpm test:e2e`
  Expected: PASS.

### Task 4: Quality gate and handoff

**Files:**

- Modify only files required to address verifier findings.

**Interfaces:**

- Consumes: all prior tasks.
- Produces: a reviewable Issue #8 implementation branch.

- [ ] **Step 1: Format and inspect the diff**

  Run: `pnpm format && git diff --check && git status --short`
  Expected: no formatting or whitespace errors; only Issue #8 files changed.

- [ ] **Step 2: Run static quality checks**

  Run: `env TMPDIR=/private/tmp pnpm lint && env TMPDIR=/private/tmp pnpm check`
  Expected: PASS with no warnings/errors.

- [ ] **Step 3: Run all automated verification**

  Run: `env TMPDIR=/private/tmp pnpm test && env TMPDIR=/private/tmp pnpm test:e2e && env TMPDIR=/private/tmp pnpm build`
  Expected: all tests pass and all 12 static pages build.

- [ ] **Step 4: Review the final diff against Issue #8**

  Confirm every automated completion condition is covered; explicitly report that production POST/PWA receipt verification remains a release smoke-test activity and was not performed automatically.
