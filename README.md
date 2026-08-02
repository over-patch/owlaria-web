# Owlaria Web

Public product website for [Owlaria](https://github.com/over-patch/owlaria), published at [owlaria.overpatch.dev](https://owlaria.overpatch.dev/).

## Status

The shared Astro foundation and bilingual product homepage are complete. Bilingual purchase, restore, and refund guidance is tracked in [owlaria-web#3](https://github.com/over-patch/owlaria-web/issues/3), under the Phase 2 product Web epic [over-patch/owlaria#1417](https://github.com/over-patch/owlaria/issues/1417). Independent domain, DNS, and HTTPS setup is tracked in [#1562](https://github.com/over-patch/owlaria/issues/1562).

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
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm lint:actions
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm build
mise exec -- pnpm exec playwright install chromium
mise exec -- pnpm test:e2e
```

`pnpm test:e2e` starts a production preview automatically. The browser suite covers bilingual routing and metadata, shared navigation, purchase-support guidance and links, representative mobile and desktop viewports, no-JavaScript use, and reduced-motion behavior.

## GitHub Pages deployment

Pull requests run the full production validation workflow. A merge to `main` starts a separate GitHub Pages workflow that builds `dist/`, uploads the Pages artifact, and deploys it with GitHub's built-in Pages and OIDC permissions. The deployment does not require repository secrets.

`public/CNAME` declares `owlaria.overpatch.dev` as the custom domain. The external DNS owner must add this record before the custom URL and HTTPS certificate can become healthy:

```text
Type:  CNAME
Name:  owlaria
Value: over-patch.github.io
```

Do not add an A/AAAA record for this subdomain. GitHub repository settings must use GitHub Actions as the Pages source and `owlaria.overpatch.dev` as the custom domain.

## Localization

- English is the source locale and has no URL prefix.
- Japanese uses `/ja/` and must provide its own translated copy.
- Canonical URLs have trailing slashes.
- Every localized route publishes self-canonical, English/Japanese `hreflang`, and English `x-default` metadata.
- Locale navigation keeps users on the equivalent logical route and never performs browser-language redirects.

Before contributing, read [AGENTS.md](./AGENTS.md).

## Public Repository Notice

This repository contains public website content only. Do not copy private application source code, internal release notes, unpublished release information, credentials, or local release material from the private Owlaria repository.
