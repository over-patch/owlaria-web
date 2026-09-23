# Browser locale redirect implementation plan

**Goal:** Send a first-time visitor from the English homepage to the Japanese
homepage when Japanese is the browser's first supported preferred language,
without adding an edge service or backend.

**Architecture:** Keep GitHub Pages as the only production hosting layer. A
small browser module reads `navigator.languages`, selects the first supported
English or Japanese preference, and redirects `/` to `/ja/` only when Japanese
wins and no stored locale preference exists. Existing language links store the
explicit choice in a first-party cookie.

## Behavior

- Apply automatic detection only to the English homepage `/`.
- Select the first supported locale from the browser's ordered preferences.
- Redirect to `/ja/` only when that locale is Japanese.
- Preserve the query string and fragment.
- Store `owlaria_locale=ja` after an automatic redirect to avoid repeat
  redirects; explicit English or Japanese selections always take precedence.
- Leave English-first, unsupported-language, non-home, and JavaScript-disabled
  visits unchanged.
- Keep GitHub Pages as the sole deployment target; do not use IP geolocation,
  Cloudflare Workers, or another edge runtime.

## Verification

- Unit-test ordered browser-language selection, URL preservation, stored
  preferences, unsupported languages, and non-home routes.
- E2E-test a Japanese-browser first visit and the resulting preference cookie.
- Retain E2E coverage for explicit English/Japanese switching and no-JavaScript
  locale links.
- Update both privacy-policy locales and their semantic assertions.
- Run formatting, linting, Astro checks, i18n checks, unit tests, production
  build, built-link validation, and the full Playwright suite before merge.
