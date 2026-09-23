# Owlaria Web

Public product website for [Owlaria](https://github.com/over-patch/owlaria), published at [owlaria.overpatch.dev](https://owlaria.overpatch.dev/).

## Status

The deployed site provides a bilingual product homepage, Support and purchase,
restore, and refund guidance, legal pages, release-note routes, and a
Helpdesk-backed problem-report form. GitHub Pages remains the static origin for
the custom domain declared by `public/CNAME`; a narrowly scoped Cloudflare
Worker handles the first-visit locale redirect before requests reach the
origin. DNS and HTTPS are part of the deployed hosting baseline. The product screenshot work is tracked in
[#1563](https://github.com/over-patch/owlaria/issues/1563). Store URL activation
is a separate deferred task: macOS and iOS acquisition actions must remain
non-link `Coming soon` states until both canonical URLs are supplied and
verified.

## Architecture

- Astro static site
- GitHub Pages static origin
- Cloudflare Worker for the country-based homepage redirect
- GitHub Actions build and deployment
- English source locale at `/`
- Japanese translation under `/ja/`
- No CMS or dedicated backend in the initial release

## Development

The project uses [mise](https://mise.jdx.dev/) to keep Node.js and pnpm consistent.

```sh
mise trust
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

The development server prints its local URL. It does not emulate Cloudflare's
country lookup: `/` remains English locally, while Japanese pages live below
`/ja/`. The locale Worker is covered by unit tests and can be bundled locally
with `mise exec -- pnpm check:edge`.

## Quality checks

Run the same checks used by pull requests:

```sh
mise exec -- pnpm exec playwright install chromium webkit
mise exec -- pnpm lint:actions
mise exec -- pnpm check:edge
mise exec -- pnpm verify:ci
```

`pnpm test:e2e` starts a production preview automatically. Chromium runs the full browser suite; Desktop Safari and iPhone WebKit run focused smoke coverage for bilingual home and feature routes, navigation, fonts, and horizontal overflow.

To reproduce the Ubuntu Playwright browser environment used by GitHub Actions, run
the same verification inside the pinned Playwright container:

```sh
mise exec -- pnpm verify:ci:linux
```

This command requires Docker. It keeps container dependencies separate from
the host `node_modules` directory. Workflow YAML linting remains a separate
host check because `actionlint` is provided by this repository's mise setup.

## GitHub Pages and Edge deployment

Pull requests run the full production validation workflow. A merge to `main` starts a separate GitHub Pages workflow that builds `dist/`, uploads the Pages artifact, and deploys it with GitHub's built-in Pages and OIDC permissions. The deployment does not require repository secrets.

`public/CNAME` declares `owlaria.overpatch.dev` as the custom domain. Cloudflare
DNS keeps the following record proxied so the Worker can run before the request
reaches GitHub Pages:

```text
Type:  CNAME
Name:  owlaria
Value: over-patch.github.io
Proxy status: Proxied
```

Do not add an A/AAAA record for this subdomain. GitHub repository settings use
GitHub Actions as the Pages source and `owlaria.overpatch.dev` as the custom
domain. `wrangler.jsonc` binds the Worker route to
`owlaria.overpatch.dev/*`. An authorized Cloudflare operator deploys it after
the Pages deployment with `mise exec -- pnpm deploy:edge`; credentials remain
outside the repository. Check Pages, Worker, DNS, and HTTPS state during every
production preflight.

The Worker canonicalizes plain HTTP requests to the same HTTPS URL with a 308
before applying locale behavior, so preference cookies are issued only on a
secure origin.

## Operations

- [Publishing runbook](./docs/ops/publishing.md): reviewed publication,
  release-note export, smoke test, and rollback procedure.
- [Preflight checklist](./docs/ops/preflight-checklist.md): route,
  accessibility, metadata, support, Store-link, and deployment evidence.

## Localization

- English is the source locale and has no URL prefix.
- Japanese uses `/ja/` and must provide its own translated copy.
- Canonical URLs have trailing slashes.
- Every localized route publishes self-canonical, English/Japanese `hreflang`, and English `x-default` metadata.
- Locale navigation keeps users on the equivalent logical route and stores the
  explicit choice for one year in the first-party `owlaria_locale` cookie.
- The Edge redirects only a `GET` or `HEAD` request for `/` from Japan when no
  locale preference exists. It uses HTTP 307, preserves the query string, and
  never redirects based on browser language.
- Plain HTTP requests are first canonicalized to the same HTTPS URL with HTTP
  308 and without setting a locale cookie.

Before contributing, read [AGENTS.md](./AGENTS.md).

## Public Repository Notice

This repository contains public website content only. Do not copy private application source code, internal release notes, unpublished release information, credentials, or local release material from the private Owlaria repository.
