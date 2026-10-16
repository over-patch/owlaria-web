# Free and Plus comparison review

Date: 2026-10-16

## Change

Before: the home and features comparison actions led to purchase support, where limits were described in prose alongside restore/refund procedures.

After: `/plans/` and `/ja/plans/` present a four-row Free/Plus table immediately below the introduction. Conditions, existing platform availability cards, and purchase support follow. Header and product footer expose the comparison; the home teaser precedes platform availability. Existing purchase-support URLs remain unchanged and link back to the comparison.

No app behavior, billing logic, Store URLs, dependencies, or legal copy changed.

## Translation review

Reviewed English source and Japanese together for titles, metadata, table labels/values, conditions, CTA labels, and support copy. Both state that every feature is available free, with one library and 100 books; Plus removes both limits with a one-time purchase per operating system. Both explain separate iOS/macOS purchases, no cross-OS restore, and in-app Store pricing. All navigation destinations preserve locale. Existing purchase/refund guidance retains its meaning. The teaser's shorter Japanese wording retains all three claims: every feature, one library, 100 books.

## Verification

- `pnpm format:check`, `pnpm lint`, `pnpm check`: passed; no Astro/TypeScript errors or warnings.
- `pnpm check:i18n`: 82 passed.
- `pnpm test`: 205 passed.
- `pnpm test:e2e --workers=4`: 166 passed, including Chromium, WebKit desktop and iPhone projects.
- `pnpm build`: 18 static pages.
- `pnpm test:links`: passed.
- `git diff --check`: passed.
- Regression tests first failed for missing comparison routes/actions; tablet header tests failed at 769/960px before the breakpoint correction.
- Comparison routes included in canonical/hreflang, sitemap and accessibility checks. Serious/critical axe violations: none.
- No-JavaScript table, pending Store state, locale switch, mobile menu, top/teaser/features/footer/support links verified.

## Visual QA

Reviewed English and Japanese comparison pages and changed home, features and purchase-support regions using Chromium and WebKit. Captured desktop (1440px) and mobile (390px); also checked Chromium at 320, 769 and 820px and automated the header boundary at 769/960/961px. No clipping or horizontal scrolling in the new comparison table and changed navigation. Narrow tables retain native column/row semantics.

Corrections from visual review:

1. Reused the global visually-hidden utility for the table caption.
2. Shortened Japanese table/teaser labels and added space above the purchase-support comparison link.
3. Moved header-only menu styles to 960px and below so navigation labels do not wrap at tablet widths.

Independent review found the caption utility issue (fixed) and confirmed the header breakpoint change. Existing marketing-heading behavior outside the changed regions is not altered by this work; the separate heading worktree was left untouched.

Screenshots are in `docs/screenshots/plans/` (English/Japanese, desktop/mobile). Additional boundary and browser captures are local QA artifacts.

This review covers the local production build. Deployment is not part of this change's verification.

## Table design follow-up

Changed the pricing row to Free / Paid (one-time purchase), with the separate iOS/macOS purchase requirement and price-screen guidance immediately below the table. The note is associated with the table through `aria-describedby`.

Self-review: retain the compact four-row structure and restrained Plus tint; center plan values to align comparisons, retain left-aligned row labels, and give the one-time payment detail secondary emphasis. Shortened Japanese cell labels without changing their meaning to avoid isolated characters at 320px. No hover decoration or recommendation badge was added to this informational table.

English/Japanese comparison screens checked at 1440, 390 and 320px in Chromium and WebKit. Follow-up checks include Astro/TypeScript, localization (82), lint, related E2E/accessibility/WebKit (45), build and built links. Screenshots refreshed after the follow-up.

## Plan presentation redesign

Supersedes the plain four-row comparison: each plan now has a prominent name, audience description, payment model and contextual action in the table header. The three body rows compare features, libraries and books. Pricing is communicated in the summary rather than duplicated as a row. Free links to platform availability; Plus links to purchase conditions. Neither action initiates a purchase.

Desktop retains aligned plan columns through the summaries and comparison rows. Mobile presents two summaries side by side, with each row label spanning both comparison values. Explicit table/row/header/cell roles preserve semantics when the layout uses CSS grid. Both locales retain per-OS purchase and Store-price guidance beneath the table.

Visual checks: Chromium/WebKit, English/Japanese, 1440/390/320px. Reduced the narrow-screen payment heading size after detecting English text overflow; final captures have no overflowing cells. New tests cover three comparison rows, the two summaries, payment headings fitting at 320px, and both section links without JavaScript. Reduced-motion emulation makes anchor-click tests independent of smooth-scroll timing. Independent code review found no concrete defects.

## Screenshot improvement loops

Completed two improvement passes, then stopped because the final screenshots showed no further concrete layout issues.

1. Replaced fixed-height summaries with shared intrinsic grid rows. Plan names, payment headings, details and actions align across the two plans, while Japanese desktop summaries no longer reserve excessive blank space.
2. Kept the Plus column tint through mobile comparison values and balanced audience-description wrapping to avoid an isolated Japanese character.

Reviewed fresh screenshots in Chromium and WebKit, in English and Japanese at 1440, 390 and 320px (12 combinations). No overflowing comparison cells or clipped payment headings were detected. Updated the four desktop/mobile screenshots in this directory's companion `../screenshots/plans/` folder.

Final validation for these passes: formatting, Astro/TypeScript (zero errors/warnings), lint, and 46 related Playwright tests passed, including accessibility and WebKit smoke checks. Added a regression check for aligned summary rows in both languages at 320, 390, 769 and 1440px. Production build and built-link validation were rerun after E2E.

## Desktop column divider

Added a 1px divider using the existing surface-border token between the comparison labels and Free column, from the plan header through the last comparison row. Applied only above the mobile breakpoint. Rebuilt and reviewed Japanese desktop/mobile screenshots; Chromium/WebKit checks in both locales at 1440/390/320px found no overflow. Formatting and production build passed.

## Continuous mobile Plus column

Moved mobile Plus shading to the right half of the comparison body so full-width row labels no longer interrupt the column. A continuous central divider joins the plan summary to the comparison rows. Desktop styling is unchanged. Reviewed new Japanese desktop/mobile and English narrow WebKit screenshots; all 12 browser/locale/width combinations passed overflow checks. Format, Astro/TypeScript, lint and production build passed. Refreshed the saved screenshots. This decorative CSS adjustment was verified visually rather than adding an implementation-specific automated test.

## Shared feature highlights

Added three feature cards immediately after the comparison note and before purchase conditions: NAS/local sources, search/filtering, and reading layouts/saved position. These are supported by the existing public features page. The section explicitly states that both Free and Plus include these capabilities, with Free's library/book limits retained. A locale-aware link leads to the full features page. English and Japanese were reviewed together for matching capabilities, limits and navigation intent; existing payment copy retains its meaning.

Reviewed Chromium and WebKit screenshots at 1440, 390 and 320px in both languages. Cards use three columns on desktop and one on mobile; no clipping or horizontal overflow observed. Saved refreshed full-page and feature-section desktop/mobile images. Validation: Astro/TypeScript, lint, formatting, localization (82), related E2E/accessibility/WebKit (48), production build and built links passed. New E2E coverage checks section placement, three highlights, localized heading and navigation to the matching features page.

## Compact shared feature list

Replaced the three marketing cards with six concrete feature names in a semantic unordered list: NAS/local access, search, reading-state/rating filters, series/next unread volume, page layouts/reading direction, and saved position. The list uses two columns on desktop and one on mobile; the localized feature-details link remains. English and Japanese were compared against the existing public feature descriptions, with no new capabilities claimed.

Refreshed and reviewed desktop/mobile screenshots, including narrow English WebKit at 320px. All 12 browser/locale/width captures remain free of comparison overflow. Formatting, Astro/TypeScript, lint, localization (82), related E2E/accessibility/WebKit (48), production build and built-link checks passed. Updated the feature-section test to expect six list items and the shared-features heading.

Clarified in both locales that the list contains selected features, with an explicit sentence leading to the full features page. Reviewed narrow-screen wrapping and refreshed screenshots. Astro/TypeScript, localization (82), formatting and production build passed for this copy follow-up.

Renamed the page, metadata and shared navigation to “Plans & Pricing” / 「プランと料金」 and comparison actions to “Compare plans” / 「プランを比較する」. Kept descriptive Free/Plus comparisons unchanged. Both locales passed formatting, type/localization checks, 33 related content tests, related navigation E2E, build and link checks. Updated screenshots.
