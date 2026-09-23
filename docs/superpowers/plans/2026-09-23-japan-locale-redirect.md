# Japan Locale Redirect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redirect first-time visits from Japan at the English homepage to `/ja/` while preserving every explicit English or Japanese language choice.

**Architecture:** Keep GitHub Pages as the static origin and add a small Cloudflare Worker at the edge. Share a first-party locale-preference cookie format between the Worker and the static site's language links; the Worker only redirects `GET` or `HEAD` requests for `/`, while all other traffic passes through unchanged.

**Tech Stack:** Astro 7, TypeScript 6, Vitest, Playwright, Cloudflare Workers, GitHub Pages

## Global Constraints

- English remains unprefixed and Japanese remains under `/ja/`.
- Plain HTTP is first canonicalized to the same HTTPS URL with HTTP 308; the country redirect applies only to the homepage, uses HTTP 307, and preserves the query string.
- A stored `en` or `ja` preference always wins over IP-derived country.
- Language links remain ordinary navigable links when JavaScript is unavailable.
- The preference cookie contains only `en` or `ja`, lasts one year, uses `Path=/` and `SameSite=Lax`, and uses `Secure` over HTTPS.
- GitHub Pages remains the origin; Cloudflare activation and DNS changes are operational follow-up work.

---

### Task 1: Edge redirect policy

**Files:**

- Create: `tests/unit/locale-preference.test.ts`
- Create: `tests/unit/locale-redirect-worker.test.ts`
- Create: `src/i18n/locale-preference.ts`
- Create: `cloudflare/locale-redirect-worker.ts`
- Create: `wrangler.jsonc`

**Interfaces:**

- Produces: `readLocalePreference(cookieHeader: string | null): Locale | null`
- Produces: `serializeLocalePreference(locale: Locale, secure?: boolean): string`
- Produces: `localeRedirectResponse(request: Request): Response | null`
- Produces: default Worker handler whose `fetch` forwards non-redirected requests to the GitHub Pages origin

- [x] **Step 1: Write failing cookie tests**

Assert that only exact `en` and `ja` cookie values are accepted and that serialization includes the one-year lifetime, root path, `SameSite=Lax`, and optional `Secure` attribute.

- [x] **Step 2: Run the cookie tests and verify RED**

Run: `mise exec -- pnpm exec vitest run tests/unit/locale-preference.test.ts`

Expected: FAIL because `src/i18n/locale-preference.ts` does not exist.

- [x] **Step 3: Implement the cookie helpers**

Create a pure TypeScript module with the constant cookie name `owlaria_locale`, strict parsing, and deterministic serialization.

- [x] **Step 4: Run the cookie tests and verify GREEN**

Run: `mise exec -- pnpm exec vitest run tests/unit/locale-preference.test.ts`

Expected: PASS.

- [x] **Step 5: Write failing Worker tests**

Cover JP homepage redirect, preserved query strings, explicit English/Japanese preferences, non-JP and unknown countries, non-home routes, non-safe methods, and origin forwarding.

- [x] **Step 6: Run the Worker tests and verify RED**

Run: `mise exec -- pnpm exec vitest run tests/unit/locale-redirect-worker.test.ts`

Expected: FAIL because the Worker module does not exist.

- [x] **Step 7: Implement the Worker and Wrangler configuration**

Canonicalize HTTP to HTTPS without setting a cookie. Then read Cloudflare's two-letter country from `request.cf.country`, return a 307 response with `Location: /ja/` and the Japanese preference cookie only for eligible requests, and otherwise call `fetch(request)`. Configure `wrangler.jsonc` with a pinned compatibility date and the Worker entry point, without embedding account credentials.

- [x] **Step 8: Run focused unit tests and verify GREEN**

Run: `mise exec -- pnpm exec vitest run tests/unit/locale-preference.test.ts tests/unit/locale-redirect-worker.test.ts`

Expected: PASS.

### Task 2: Explicit locale preference

**Files:**

- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Create: `src/scripts/locale-preference.ts`
- Modify: `tests/e2e/foundation.spec.ts`

**Interfaces:**

- Consumes: `serializeLocalePreference(locale, secure)`
- Produces: `data-locale-preference="en|ja"` on every language switch link
- Produces: browser behavior that writes the preference before ordinary link navigation

- [x] **Step 1: Add failing browser expectations**

Assert that choosing Japanese stores `owlaria_locale=ja`, choosing English stores `owlaria_locale=en`, and locale links still navigate with JavaScript disabled.

- [x] **Step 2: Run the focused browser test and verify RED**

Run: `mise exec -- pnpm exec playwright test tests/e2e/foundation.spec.ts --project=chromium`

Expected: FAIL because locale links do not store a preference.

- [x] **Step 3: Add preference attributes and the browser script**

Annotate both header and footer links with the target locale. Load one layout-level script that listens for link activation and writes the shared cookie, adding `Secure` only on HTTPS.

- [x] **Step 4: Run the focused browser test and verify GREEN**

Run: `mise exec -- pnpm exec playwright test tests/e2e/foundation.spec.ts --project=chromium`

Expected: PASS.

### Task 3: Public documentation and policy disclosure

**Files:**

- Modify: `tests/unit/legal-content.test.ts`
- Modify: `src/content/legal.ts`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/ops/publishing.md`
- Modify: `docs/ops/preflight-checklist.md`

**Interfaces:**

- Consumes: Worker redirect conditions and `owlaria_locale` cookie behavior
- Produces: bilingual disclosure and activation/verification instructions

- [x] **Step 1: Add failing bilingual policy assertions**

Assert that both privacy-policy locales disclose IP-derived country selection, the exact cookie name, the `en`/`ja` values, the one-year lifetime, and the fact that the cookie is not used for analytics or tracking.

- [x] **Step 2: Run the legal-content test and verify RED**

Run: `mise exec -- pnpm exec vitest run tests/unit/legal-content.test.ts`

Expected: FAIL because the disclosure is absent.

- [x] **Step 3: Update English and Japanese policy copy**

Add aligned paragraphs to the technical-information and analytics sections and update both privacy-policy last-updated dates to September 23, 2026 / 2026年9月23日.

- [x] **Step 4: Run the legal-content test and verify GREEN**

Run: `mise exec -- pnpm exec vitest run tests/unit/legal-content.test.ts`

Expected: PASS.

- [x] **Step 5: Update architecture and operations documentation**

Replace the obsolete no-redirect statements with the exact one-time homepage policy. Document Cloudflare proxy/Worker activation, rollback, cookie behavior, country simulation, and production smoke checks while keeping GitHub Pages as origin.

- [x] **Step 6: Run the complete quality gate**

Run: `mise exec -- pnpm format`

Run: `mise exec -- pnpm lint`

Run: `mise exec -- pnpm check`

Run: `mise exec -- pnpm check:i18n`

Run: `mise exec -- pnpm test`

Run: `mise exec -- pnpm build`

Run: `mise exec -- pnpm test:links`

Run: `mise exec -- pnpm test:e2e`

Expected: every command succeeds with no new warnings or failures.
