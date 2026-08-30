# Owlaria Web

Public product website for [Owlaria](https://github.com/over-patch/owlaria), published at [owlaria.overpatch.dev](https://owlaria.overpatch.dev/).

## Status

The deployed site provides a bilingual product homepage, Support and purchase,
restore, and refund guidance, legal pages, release-note routes, and a
Helpdesk-backed problem-report form. GitHub Pages serves the custom domain
declared by `public/CNAME`; DNS and HTTPS are part of the deployed hosting
baseline. The product screenshot work is tracked in
[#1563](https://github.com/over-patch/owlaria/issues/1563). Store URL activation
is a separate deferred task: macOS and iOS acquisition actions must remain
non-link `Coming soon` states until both canonical URLs are supplied and
verified.

## Architecture

- Astro static site
- GitHub Pages hosting
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

The development server prints its local URL. It does not redirect based on browser language: `/` is always English, while Japanese pages live below `/ja/`.

## Quality checks

Run the same checks used by pull requests:

```sh
mise exec -- pnpm exec playwright install chromium webkit
mise exec -- pnpm lint:actions
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

## GitHub Pages deployment

Pull requests run the full production validation workflow. A merge to `main` starts a separate GitHub Pages workflow that builds `dist/`, uploads the Pages artifact, and deploys it with GitHub's built-in Pages and OIDC permissions. The deployment does not require repository secrets.

`public/CNAME` declares `owlaria.overpatch.dev` as the custom domain. The custom
domain uses this record, which the DNS owner must keep in place:

```text
Type:  CNAME
Name:  owlaria
Value: over-patch.github.io
```

Do not add an A/AAAA record for this subdomain. GitHub repository settings use
GitHub Actions as the Pages source and `owlaria.overpatch.dev` as the custom
domain. Check the current Pages, DNS, and HTTPS state during every production
preflight.

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
- Locale navigation keeps users on the equivalent logical route and never performs browser-language redirects.

Before contributing, read [AGENTS.md](./AGENTS.md).

## Public Repository Notice

This repository contains public website content only. Do not copy private application source code, internal release notes, unpublished release information, credentials, or local release material from the private Owlaria repository.
