# Owlaria Web preflight and release evidence

Complete this checklist for each production publication. Put links, run IDs,
screenshots, timestamps, and the responsible person's name beside the relevant
item. An unchecked item is a release blocker unless it is explicitly marked as
a deferred follow-up below.

## Change and review

- [ ] Branch uses a repository-standard prefix and targets `main`.
- [ ] Pull request diff contains only the intended public website content.
- [ ] All review conversations, if any, are resolved. An approving review is
      optional and is not a merge requirement.
- [ ] `Verify website` is passing for the latest commit.
- [ ] Local quality gate results are recorded: `format:check`, `lint`,
      `lint:actions`, `check`, `test`, build, `test:links`, and `test:e2e`.

## Routes, locales, and responsive behavior

- [ ] All English routes are smoke-tested: `/`, `/support/`,
      `/support/purchases/`, `/releases/`, `/privacy/`, and `/terms/`.
- [ ] All Japanese routes are smoke-tested: `/ja/`, `/ja/support/`,
      `/ja/support/purchases/`, `/ja/releases/`, `/ja/privacy/`, and
      `/ja/terms/`.
- [ ] Every published release-detail route is checked in both locales.
- [ ] Locale switching stays on the equivalent logical route and never falls
      back to the wrong language.
- [ ] Desktop behavior is checked at 1440×1000.
- [ ] Mobile behavior is checked at 390×844, including no horizontal overflow.

## Accessibility and resilience

- [ ] Keyboard-only navigation reaches every control in a logical order.
- [ ] Focus indicators are visible and focus is not trapped unexpectedly.
- [ ] Each page has the expected landmarks and a logical heading hierarchy.
- [ ] Interactive controls and images have accessible names or appropriate alt
      text.
- [ ] Automated axe checks pass, with the run link or output recorded.
- [ ] Manual contrast review passes for text, controls, focus, and status
      messages in the current theme.
- [ ] Pages remain usable with JavaScript disabled; the Support form's
      no-JavaScript message is understandable.
- [ ] Reduced-motion behavior is checked with `prefers-reduced-motion: reduce`.

## Metadata and assets

- [ ] Every changed page has the correct canonical URL with a trailing slash.
- [ ] English/Japanese `hreflang` links and English `x-default` are reciprocal
      and point to the equivalent route.
- [ ] `<title>` and meta description are present and match the page content.
- [ ] Open Graph title, description, URL, type, and social image are correct.
- [ ] Twitter card metadata is present and uses the intended social image.
- [ ] Favicon is reachable at `/owlaria-app-icon.png`.
- [ ] Social image is reachable at `/social/owlaria-social.png` and renders at
      the expected dimensions.
- [ ] Internal links, fragments, and built assets pass `pnpm test:links`.
- [ ] The published Apple Restore Purchases guide links resolve to the official
      destinations (`https://support.apple.com/en-us/108096` and
      `https://support.apple.com/ja-jp/108096`). The in-app `Restore Purchases`
      action itself is not an external URL to resolve.
- [ ] Apple refund guidance links resolve to the official destinations
      (`https://support.apple.com/en-us/118223` and
      `https://support.apple.com/ja-jp/118223`), and
      `https://reportaproblem.apple.com/` resolves to Apple.

## Support intake

- [ ] The deployed Support form sends to the configured production Helpdesk
      intake endpoint and passes the production-origin CORS check.
- [ ] A Release Owner has authorized exactly one production submission for this
      verification (use non-sensitive test text and the intended category).
- [ ] The form displays the returned reference number. Record the receipt time
      separately from the authorized Helpdesk receipt or API response.
- [ ] The authorized submission is visible in the Helpdesk receipt/log; record
      the reference number without recording private message content.
- [ ] No unauthorized or repeated production submissions were made.

## Store-link gate (explicitly deferred)

- [ ] **Post-release gate:** confirm both canonical App Store URLs only after
      the Store URLs are supplied and verified by the Release Owner. This is
      a separate deferred Store URL activation task; it is not the #1563
      product-screenshot task.
- [ ] **Pre-release state:** until that gate passes, macOS and iOS acquisition
      actions remain non-links (`Coming soon` / `近日公開`).
- [ ] **Post-release state:** when the gate passes, enable both canonical links
      together in one pull request and verify both locales.
- [ ] Never publish a mixed state with one Store link active and the other still
      pending.

Do not mark the deferred Store URL item complete based on a guessed, temporary,
or region-specific link. The current pre-release non-link state is the required
state until the follow-up evidence exists.

## Deployment and ownership evidence

- [ ] `Deploy to GitHub Pages` workflow succeeded, including the Pages artifact
      build and deployment step.
- [ ] GitHub Pages project is configured for GitHub Actions and the custom
      domain is `owlaria.overpatch.dev`.
- [ ] DNS resolves the committed `public/CNAME` value
      (`owlaria.overpatch.dev` → `over-patch.github.io`).
- [ ] HTTPS is healthy for `https://owlaria.overpatch.dev/` and redirects or
      mixed-content errors are absent.
- [ ] Merge commit, CI run URL, deploy run URL, reviewer (if any), and
      production smoke test timestamp are recorded.
- [ ] A rollback owner is named and can open the revert PR if needed.
- [ ] If a rollback occurred, the revert PR, its CI/deploy runs, and the repeat
      smoke test are linked here.

## Evidence record

- Pull request:
- Merge commit:
- `Verify website` run:
- `Deploy to GitHub Pages` run:
- Production smoke-test timestamp and browser/device:
- Reviewer (if any):
- Rollback owner:
- Notes or follow-up issue:
