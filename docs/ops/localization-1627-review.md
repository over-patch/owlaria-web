# Public language alignment review — 2026-09-07

Related: [Owlaria #1627](https://github.com/over-patch/owlaria/issues/1627),
[Web #3](https://github.com/over-patch/owlaria-web/issues/3),
[#5](https://github.com/over-patch/owlaria-web/issues/5),
[#6](https://github.com/over-patch/owlaria-web/issues/6),
[#8](https://github.com/over-patch/owlaria-web/issues/8).

Baseline: `96e6b309c8ca1cfac539c6e9747244246024c611`.
This review accompanies `bugfix/public-language-alignment`; its PR records
commit, CI, deployment, and final production verification evidence.
The cross-product evidence and outstanding store/release work remain in the
upstream issue; this document records only this website's review.

## Source comparison

- Both configured Web locales match the upstream supported-language policy.
- Japanese support and purchase instructions now use the localized app actions:
  「設定 > 情報 > 問題を報告する」, 「この問題を報告」, and 「購入を復元」.
- Japanese form warnings translate general terms for raw logs, receipts,
  transaction IDs, and credentials. Category identifiers and payloads are unchanged.
- Japanese legal prose translates general English terms while preserving the
  English conditions, exceptions, data handling, retention, purchase boundaries,
  and lack of individual support promises. English legal conditions are retained; both locales receive the separately
  approved clarification of the existing diagnostic default described below.
- Japanese feature copy restores the English restrictions on newly found comics
  and leaf-folder series grouping. Spread guidance now includes alignment control
  and does not add a promise of automatic cover detection. Author and reading
  direction labels follow the localized app terminology. Offline reading retains
  the prerequisite of saving selected books, within the existing Japanese
  supporting-copy length limit.
- Provider URLs explicitly select English or Japanese where offered. RevenueCat's
  English page is labelled as English in Japanese navigation. Provider-owned
  legal text is not reproduced or independently translated here.
- Legal dates and the privacy notice version are unchanged for these
  meaning-preserving changes. On 2026-09-08 the owner approved
  explicitly describing the existing app diagnostic default and ability to turn
  it off before sending. Both languages now explain this without changing
  collection, optional submission, form behavior, or consent boundaries. The
  clarification explicitly applies to the app, not the website form. The
  existing notice version and dates are retained; deployment remains pending.

## Public and local evidence

Production's English/Japanese homepage, features, support, purchases, privacy,
terms, and release index were opened on 2026-09-07 in the Codex in-app browser.
Headings, body text, actual destinations, and same-page locale switches were
checked. Production still has the pre-change Japanese copy. Store CTAs remain
non-links and both release indexes remain empty.

Local preview at 1440×1000 and 390×844 covered the twelve changed English/Japanese
pages, including DOM language, headings, and absence of horizontal overflow.
Representative screenshots and content were visually reviewed in the task.
This is not physical iPhone testing, VoiceOver review, or a claim that every
paragraph/state has a persisted visual baseline.

All five existing product screenshots were opened. Four contain English UI
(Mac/iPhone library, series, viewer controls); the clean viewer image has no
visible action text. Japanese pages currently reuse those images. Japanese UI
captures are deferred by the owner decision below; the original image delivery
is recorded in [Owlaria #1563](https://github.com/over-patch/owlaria/issues/1563).
The current alt text describes each depicted feature, but translated alt text
alone does not complete the missing localized image assets.

## Verification

Commands use `mise exec --` because the host's plain Node entry point references
a missing Homebrew library.

- Prettier, ESLint, Astro check and `check:i18n` pass.
- Content regressions were observed failing before the source fixes.
- Unit suite: 174 pass; localization subset: 81 pass.
- Full Playwright suite: 124 pass after fixing a pre-existing timing race in the
  homepage image geometry test. The test now waits for the ancestor reveal
  transition; its 1.5px tolerance and four-edge checks remain unchanged.
- Homepage geometry: English/Japanese, five repetitions each, all ten pass.
- After the final feature copy and provider link changes, the related Features
  and legal-page E2E suite passes all twelve tests.
- A sandbox run could not launch Chromium due to Mach-port permissions; it is
  not counted as a content test result. The subsequent permitted run passed.
- Normal production build: fourteen pages; built-link check passes. Fixture
  release details used by E2E are not published articles or evidence that initial
  release copy is complete.

No production report submission, purchase, or store setting change is part of
this verification. Integration and deployment were authorized on 2026-09-08;
record the subsequent production check in the PR.

## Follow-up verification — 2026-09-08

The two locale regressions for the initial diagnostic state failed before the
clarification and passed afterwards (eleven legal unit tests total). The related
legal E2E suite passes five tests, including the new English/Japanese paragraph
and all four legal pages at mobile width. These focused results supplement the
previous full-suite run; they do not represent a new full-suite run.

## Scope decision — 2026-09-08

The owner approved retaining the existing English UI screenshots on both
website locales for now. Missing Japanese captures no longer block this review;
this does not claim that Japanese captures exist or waive store-image language
requirements. Store comparison is tracked in Owlaria #1639 under #1413; initial
release comparison is tracked in Owlaria #1640 under #1530. Remaining website
work is integration and verification of the changed live pages after deployment.

## Publication preflight ownership

Codex is responsible for this change review and production smoke evidence; the
Release Owner retains publication and rollback ownership. The PR records the
latest Verify website and Pages runs and a route-by-route production check.

The applicable local gate includes Prettier, ESLint, actionlint, Astro, locale
validation, unit tests, Chromium/WebKit E2E, normal build, and built links.
Keyboard, axe, no-JavaScript, reduced motion, metadata, and responsive coverage
use the existing E2E suite; the earlier manual viewport/content checks remain
recorded above. Physical-device and VoiceOver QA belong to Owlaria #1628.

The preflight's production intake submission is not applicable to this copy
change: the owner expressly prohibited production sends, and the endpoint,
payload, and intake behavior are unchanged. Intake behavior is verified with
the existing mock tests. Store URL activation remains deferred, with both CTAs
non-links; no release-detail page exists to smoke-test. Missing article review
is tracked in #1640, and store comparison in #1639. No new contact or purchase
flow is activated by this publication.
