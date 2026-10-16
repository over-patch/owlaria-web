# UI refinement review — 2026-10-16

## Scope

Refine the existing product website while retaining its page structure, public copy,
URLs, functionality, and product screenshots. Implementation is isolated on
`feature/refine-product-ui` in an owlaria-web worktree. No application repository
files, dependencies, business logic, or Store destinations changed.

## Design changes

- Move the existing platform labels and feature/purchase links above the product
  preview so the primary action is available before scrolling.
- Retain Inter / Noto Sans JP, the navy foundation, and purple/cyan accents. Reduce
  heading size and tracking, increase line height, and reserve stronger color for
  actual actions. Present Coming soon as quiet, non-interactive status text.
- Centralize section spacing, card padding, and primary-action color in tokens.
  Remove excessive card minimum heights and doubled home section spacing.
- Use a two-column mobile feature index with all six existing destinations.
- Preserve authored phrase breaks at normal widths; allow natural wrapping below
  368px so fixed lines cannot clip on small screens.
- Reserve the full overlapping phone-preview height on small screens and leave at
  least 48px before the benefit cards.
- Increase header link hit areas to at least 44px. Keep focus states, reduced
  motion, keyboard navigation, and no-JavaScript behavior.
- Tune shared support/legal/release typography and harmonize primary hover styles.

## Before / after

Measurements use Japanese pages at 1440 × 1000 and 390 × 844, bundled fonts loaded,
scroll position zero, and settled reveal animations.

| Measure                         | Before         | After          |
| ------------------------------- | -------------- | -------------- |
| Desktop home primary-action top | 1,663px        | 594px          |
| Mobile home primary-action top  | 1,131px        | 452px          |
| Desktop home heading size       | 116px          | 80px           |
| Mobile feature index            | 6 rows / 420px | 3 rows / 204px |

The earlier CTA is a measured layout improvement, not a claim about conversion.
Existing English and Japanese copy and accessible names are unchanged; there is
no source-meaning change requiring translation updates. Both languages were
checked on screen.

## Visual QA

Four review rounds were used:

1. Review home, features, and support on desktop/mobile; confirm earlier actions,
   calmer hierarchy, and compact navigation.
2. Refine support heading leading and action hover consistency. Expand inspection
   to English features, purchase support, privacy, and release pages.
3. Inspect 320px, 640px, and 768px layouts. Fix heading text clipped by fixed line
   breaks and improve mobile legal-title wrapping.
4. Reserve phone-preview space after inspecting the 320px screenshot; retest the
   image/card separation and capture the final layouts.

Reference images:

| Surface             | Before                                                            | After                                                           |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Home desktop        | [Before](../screenshots/ui-refinement/home-desktop-before.png)    | [After](../screenshots/ui-refinement/home-desktop-after.png)    |
| Home mobile         | [Before](../screenshots/ui-refinement/home-mobile-before.png)     | [After](../screenshots/ui-refinement/home-mobile-after.png)     |
| Features mobile     | [Before](../screenshots/ui-refinement/features-mobile-before.png) | [After](../screenshots/ui-refinement/features-mobile-after.png) |
| English home mobile | [Before](../screenshots/ui-refinement/home-en-mobile-before.png)  | [After](../screenshots/ui-refinement/home-en-mobile-after.png)  |

[Final full desktop home](../screenshots/ui-refinement/home-desktop-full-after.png),
[final full mobile home](../screenshots/ui-refinement/home-mobile-full-after.png),
[320px home](../screenshots/ui-refinement/narrow-home-after.png),
[320px features](../screenshots/ui-refinement/narrow-features-after.png),
[mobile privacy title](../screenshots/ui-refinement/privacy-mobile-after.png).

## Verification

- `pnpm format:check`
- `pnpm check`: Astro / TypeScript, no errors or warnings
- `pnpm lint`
- `pnpm test`: 204 tests
- `pnpm check:i18n`: 81 tests (subset of unit coverage)
- `pnpm test:e2e --workers 4`: 147 tests, Chromium plus desktop/iPhone WebKit
- `pnpm build`: static production build, 16 pages, without release fixtures
- `pnpm test:links`
- `git diff --check`

The E2E suite includes automated accessibility checks, navigation, language
selection, no-JavaScript and reduced-motion checks, product layout, legal and
purchase content, and mocked problem-report interactions. No live problem report
was submitted. New regression tests were observed failing before fixes for early
CTA visibility, mobile index height, 320px heading clipping, and preview/card
spacing. The old one-column index expectation was updated to the approved design.

Screenshots and checks use browser engines and emulated viewports; physical-device
testing and production deployment are outside this change. Independent code
review found no actionable issues. The worktree is retained for review.
