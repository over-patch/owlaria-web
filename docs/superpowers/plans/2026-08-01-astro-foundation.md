# Owlaria Astro Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable bilingual Astro foundation, automated quality checks, and GitHub Pages deployment required by `over-patch/owlaria#1552` without implementing the finished homepage owned by #1553.

**Architecture:** Astro statically renders a small explicit route set from locale-specific content into one shared layout. Pure TypeScript locale and route helpers are unit-tested with Vitest, while Playwright validates rendered navigation, responsive behavior, and reduced-motion behavior against a production preview. GitHub Actions separates pull-request validation from trusted `main` deployment.

**Tech Stack:** mise, Node.js 24.12, pnpm 10.33, actionlint 1.7, Astro 7, strict TypeScript 6, Vitest 4, Playwright 1.62, ESLint 10, Prettier 3, GitHub Pages Actions

## Global Constraints

- Generate a static site for `https://owlaria.overpatch.dev/`; do not add a CMS, backend, runtime database, external preview service, or deploy secret.
- English is unprefixed, Japanese uses `/ja/`, canonical URLs have trailing slashes, and `/` always renders English without browser-language redirects.
- Every published localized page must render a self-canonical, reciprocal `hreflang`, and English `x-default`; Japanese content must never fall back to English body copy.
- Header contains logo, Support, Release Notes, a non-link `Coming soon` acquisition label, and locale switching in desktop/mobile navigation; footer contains Product, Support, Legal, copyright, and locale switching.
- The visual system uses dark navy with purple, blue, and cyan accents, restrained glass surfaces, accessible contrast, visible focus, and motion that becomes effectively static under `prefers-reduced-motion: reduce`.
- This plan provides only minimal route-shell content; the finished Hero, feature presentation, platforms, screenshots, and Store acquisition flow remain in #1553.

---

### Task 1: Toolchain and quality commands

**Files:**

- Create: `package.json`
- Create: `mise.toml`
- Create: `pnpm-lock.yaml`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`

**Interfaces:**

- Produces scripts `dev`, `build`, `preview`, `check`, `lint`, `format`, `format:check`, `test`, and `test:e2e`.
- Produces an Astro static build configured with `site: "https://owlaria.overpatch.dev"` and `trailingSlash: "always"`.

- [ ] **Step 1: Pin the local runtime and add package metadata**

  Pin Node `24.12.0`, pnpm `10.33.0`, and actionlint `1.7.12` in `mise.toml`. Use `packageManager: "pnpm@10.33.0"`, Node `>=22.12.0`, Astro `^7.1.6`, and the quality packages listed in the Tech Stack. Configure scripts so CI calls repository-owned commands rather than ad hoc commands.

- [ ] **Step 2: Install dependencies and create the pnpm lockfile**

  Run: `mise install && mise exec -- pnpm install`
  Expected: `node_modules/` and `pnpm-lock.yaml` are created without npm or Yarn lockfiles.

- [ ] **Step 3: Add static Astro, strict TypeScript, formatting, lint, unit-test, and browser-test configuration**

  Configure Astro output as `static`; extend `astro/tsconfigs/strict`; lint JS, TS, and Astro with `typescript-eslint` and `eslint-plugin-astro`; format Astro through `prettier-plugin-astro`; use Vitest for `tests/unit/**/*.test.ts`; serve `pnpm preview --host 127.0.0.1` for Playwright.

- [ ] **Step 4: Verify the empty toolchain**

  Run: `mise exec -- pnpm format:check && mise exec -- pnpm lint && mise exec -- pnpm check`
  Expected: commands execute successfully once the source files from later tasks exist.

### Task 2: Locale and route model (TDD)

**Files:**

- Create: `tests/unit/i18n.test.ts`
- Create: `src/i18n/config.ts`
- Create: `src/content/site.ts`

**Interfaces:**

- Produces `type Locale = "en" | "ja"`, `locales`, `defaultLocale`, `localePath(locale, pathname)`, `alternateLocale(locale)`, and `absoluteLocaleUrl(locale, pathname)`.
- Produces complete `SiteCopy` values for both locales; access is keyed by `Locale`, so missing Japanese content is a type error instead of an English fallback.

- [ ] **Step 1: Write failing locale tests**

  Assert that English paths are unprefixed, Japanese paths use `/ja/`, all generated paths end in `/`, switching locale preserves the logical route, and absolute URLs use `https://owlaria.overpatch.dev/`.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `mise exec -- pnpm test -- tests/unit/i18n.test.ts`
  Expected: FAIL because `src/i18n/config.ts` does not exist.

- [ ] **Step 3: Implement the minimal typed locale helpers and independent copy dictionaries**

  Normalize leading and trailing slashes, special-case the root, and define English and Japanese navigation/route-shell strings explicitly in `src/content/site.ts`.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `mise exec -- pnpm test -- tests/unit/i18n.test.ts`
  Expected: all locale helper tests pass.

### Task 3: Shared visual, motion, layout, and navigation foundation

**Files:**

- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/scripts/motion.ts`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/layouts/SiteLayout.astro`
- Create: `public/owlaria-app-icon.png`

**Interfaces:**

- `SiteLayout` accepts `locale: Locale`, `pathname: string`, `title: string`, and `description: string`.
- Header and footer receive `locale` and `pathname` and generate locale-correct navigation via Task 2 helpers.
- Elements with `[data-reveal]` progressively enhance from visible server HTML and only animate after the document receives `.motion-ready`.

- [ ] **Step 1: Add browser assertions for the desired shared shell before implementation**

  In Task 5's Playwright file, assert one `<main>`, skip-link functionality, locale-correct header/footer links, canonical and alternate metadata, a button-controlled mobile navigation, and no motion transforms/transitions when reduced motion is enabled.

- [ ] **Step 2: Run the browser test and verify RED**

  Run: `mise exec -- pnpm build && mise exec -- pnpm test:e2e`
  Expected: FAIL because the pages and shared shell do not exist.

- [ ] **Step 3: Implement design tokens and global responsive styles**

  Define semantic custom properties for background, text, accents, surfaces, focus, spacing, type scale, container width, radii, shadows, easing, and duration. At `prefers-reduced-motion: reduce`, set animation/transition durations to `0.01ms`, disable smooth scrolling, and remove reveal/parallax transforms.

- [ ] **Step 4: Implement accessible header, footer, and layout**

  Use semantic landmarks, a visible-on-focus skip link, an actual button for mobile navigation with `aria-expanded`, logo/icon alt text, locale-preserving links, non-link `Coming soon`, self-canonical metadata, `en`/`ja` alternates, and English `x-default`.

- [ ] **Step 5: Add progressive motion initialization**

  Use `IntersectionObserver` only when motion is allowed; preserve all content when JavaScript is absent, mark revealed elements once, and disconnect the observer when complete.

### Task 4: Minimal bilingual route shells

**Files:**

- Create: `src/components/FoundationPage.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/support/index.astro`
- Create: `src/pages/support/purchases/index.astro`
- Create: `src/pages/privacy/index.astro`
- Create: `src/pages/terms/index.astro`
- Create: `src/pages/releases/index.astro`
- Create: `src/pages/ja/index.astro`
- Create: `src/pages/ja/support/index.astro`
- Create: `src/pages/ja/support/purchases/index.astro`
- Create: `src/pages/ja/privacy/index.astro`
- Create: `src/pages/ja/terms/index.astro`
- Create: `src/pages/ja/releases/index.astro`

**Interfaces:**

- Every page passes an explicit locale and logical pathname into `FoundationPage`; no locale detection or content fallback occurs.
- Route-shell text explains that content is being prepared and never invents legal, support, purchase, release, or product claims owned by other issues.

- [ ] **Step 1: Add thin explicit page entries**

  Each route imports `FoundationPage` and renders it with the corresponding `Locale` and route key. Do not add a release version, because no reviewed public release content exists yet.

- [ ] **Step 2: Build and inspect generated routes**

  Run: `mise exec -- pnpm build`
  Expected: static HTML exists for all twelve route shells with trailing-slash directories and no generated release-version page.

### Task 5: Automated route, responsive, and reduced-motion verification

**Files:**

- Create: `tests/e2e/foundation.spec.ts`

**Interfaces:**

- Validates `/`, `/ja/`, support, purchases, privacy, terms, and releases in both locales against the production preview.

- [ ] **Step 1: Complete browser tests for routing and metadata**

  For every route, assert HTTP 200, the expected `html[lang]`, one heading and main landmark, self-canonical, both locale alternates, English `x-default`, and a locale switch to the equivalent path.

- [ ] **Step 2: Add desktop and mobile navigation tests**

  At 1440×1000 assert desktop navigation is visible. At 390×844 assert the menu button opens/closes navigation, focus is usable, and the page has no horizontal overflow.

- [ ] **Step 3: Add reduced-motion tests**

  Emulate `reducedMotion: "reduce"`, load the page, and assert reveal content is visible with `animation-duration` and `transition-duration` effectively disabled.

- [ ] **Step 4: Run the full browser suite and verify GREEN**

  Run: `mise exec -- pnpm build && mise exec -- pnpm test:e2e`
  Expected: all route, responsive, and reduced-motion tests pass.

### Task 6: GitHub Pages CI/deploy and contributor documentation

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `public/CNAME`
- Modify: `README.md`

**Interfaces:**

- Pull requests and pushes to `main` run install, format, lint, Astro check, unit tests, browser installation, production build, and Playwright tests.
- `main` deployment uses `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` with only GitHub's Pages/OIDC permissions.

- [ ] **Step 1: Add CI and deployment workflows**

  Pin Node 24 and pnpm 10, use `pnpm install --frozen-lockfile`, cache through `actions/setup-node`, serialize Pages deployments, set the deployment environment URL, and do not reference repository secrets.

- [ ] **Step 2: Add custom-domain source file and document operations**

  Set `public/CNAME` to `owlaria.overpatch.dev`. Document prerequisites, install/dev/build/preview/test commands, static architecture, locale rules, Pages deployment, and that the external DNS owner must add only the required `CNAME owlaria -> over-patch.github.io` record before HTTPS can become healthy.

- [ ] **Step 3: Run the complete local quality gate**

  Run: `mise exec -- pnpm format && mise exec -- pnpm format:check && mise exec -- pnpm lint && mise exec -- pnpm check && mise exec -- pnpm test && mise exec -- pnpm build && mise exec -- pnpm test:e2e`
  Expected: all commands pass with no errors or warnings.

- [ ] **Step 4: Review repository safety and scope**

  Run: `git status --short && git diff --check && git diff --stat origin/main...HEAD`
  Expected: no secret/environment files, private source, internal release notes, finished #1553 homepage, or unrelated `.serena/` content is included.

- [ ] **Step 5: Commit, push, and open a pull request**

  Commit message: `:sparkles: Build Astro website foundation`

  PR title: `:sparkles: Astro共通基盤とPages deployを実装`

  PR body must summarize foundation scope, list every verification command, include desktop/mobile screenshots, reference `over-patch/owlaria#1552`, and state that DNS/HTTPS activation and merge wait on the repository's required team review.
