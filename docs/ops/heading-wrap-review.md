# Heading wrap review — 2026-10-16

## Findings and fixes

The Japanese privacy title wrapped as `Owlaria / プライバシーポリ / シー` at
1024px and 1440px. Its shared legal heading used a Latin zero-based `15ch` width
cap. Remove that cap for Japanese legal headings and let the page shell provide
the available width.

The related audit also found six short card-title endings:

- At 320px: `The folders you already / use`,
  `元のフォルダへ書き込まない / 設計`, and
  `プライベートライブラ / リ` on the feature page.
- At 390px: `Organize without touching / files` on the English home page.
- At 1440px: `ファイル移動を / 追跡` and `読書を振り返る / 統計` on the Japanese home page.

Balance card-title lines with CSS. Where automatic phrase detection still splits
an unsuitable compound, use the existing `SemanticPhraseText` component with
explicit title phrases. English and Japanese phrase arrays reconstruct the
original strings exactly, so copy meaning and accessible names are retained.
English/Japanese remain the complete configured locale set, checked against the
upstream supported-language policy. No translation wording changed.

WebKit additionally stranded `せん。` on the final line of the Japanese support
form's boundary notice at 390px. Apply line balancing to this notice as well.

## Review scope

Inspect rendered text lines, not just element widths: a split word can pass both
whole-page overflow checks and the existing computed `word-break` checks.

- All 16 public English/Japanese routes, h1–h4 headings.
- Chromium: 320, 390, 768, 1024, and 1440px (80 route/width combinations).
- WebKit: 320, 390, and 1440px (48 route/width combinations).
- Flag clipped text and disproportionately short final lines, then visually review
  the candidates. The final scans returned no candidates in either engine.
- Regression tests cover the privacy term at all five widths and the six card
  titles with native and forced segmented-fallback wrapping (22 tests).
- Desktop and iPhone WebKit projects each cover the support notice regression.
- Observe failures before fixes: 15 Chromium and two WebKit regression cases
  failed for the affected layouts. All pass after the fix.

## Visual evidence

| Surface                  | Before                                                           | After                                                          |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Japanese privacy, 1440px | [Before](../screenshots/heading-wrap/privacy-desktop-before.png) | [After](../screenshots/heading-wrap/privacy-desktop-after.png) |

Additional final captures:

- [Japanese privacy, 390px](../screenshots/heading-wrap/privacy-mobile-after.png)
- [Private-library card, 320px](../screenshots/heading-wrap/private-card-320.png)
- [File-tracking card, 1440px](../screenshots/heading-wrap/tracking-card-1440.png)
- [Support boundary notice, WebKit 390px](../screenshots/heading-wrap/support-webkit-390.png)

## Validation

- `pnpm format:check`
- `pnpm check` — no Astro/TypeScript errors, warnings, or hints
- `pnpm lint`
- `pnpm test` — 204 passed
- `pnpm check:i18n` — 81 passed (unit-test subset)
- `pnpm test:e2e --workers 4` — 171 passed
- `pnpm build` — 16 static production pages, without test release fixtures
- `pnpm test:links`
- `git diff --check`

The existing E2E suite also checks accessibility, navigation, no-JavaScript
behavior, reduced motion, locale selection, and responsive layouts. Screens were
checked with browser engines and emulated widths, rather than physical devices.
No production form was submitted. The fix is prepared in the owlaria-web
`bugfix/heading-phrase-wrap` worktree; production deployment is not part of this
verification record.
