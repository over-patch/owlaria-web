# Owlaria Web Agent Rules

This repository contains the public product website for Owlaria. These rules apply to AI agents and human contributors working in this repository.

## Project Scope

- Build a static Astro website for `https://owlaria.overpatch.dev/`.
- Deploy the production build to GitHub Pages from GitHub Actions after changes are merged to `main`.
- Keep the initial architecture small enough for a two-person team to maintain.
- Do not add a CMS, dedicated backend, external preview service, or runtime database unless a later issue explicitly approves it.
- Track planning and implementation work in `over-patch/owlaria`, primarily under issue #1417 and its sub-issues.

## Source Of Truth And Public Boundaries

- General product website copy is authored here, with English as the source locale and Japanese translated from English.
- Legal content is owned by `over-patch/owlaria#1411`.
- Support and contact content is owned by `over-patch/owlaria#1412`.
- Purchase, refund, and restore guidance is owned by `over-patch/owlaria#1452`.
- Release notes are sourced from the private `over-patch/owlaria/docs/releases/` workflow and published here only after review.
- Never copy private source code, internal release notes, unpublished release content, App Store short copy, credentials, or other internal-only material into this public repository.

## Repository Navigation And Editing

- Read this file and relevant issue bodies before making changes.
- Use `rg` and `rg --files` for repository searches.
- Inspect existing scripts and configuration before introducing new tools or conventions.
- Preserve unrelated user changes in a dirty worktree.
- Prefer focused edits and small, reviewable pull requests.
- Do not edit generated output when the source can be changed instead.

## Package Manager And Commands

- Use `pnpm`; do not generate npm or Yarn lockfiles.
- Prefer scripts defined in `package.json` over ad hoc tool invocations.
- Before committing, run the formatter, lint, Astro/TypeScript checks, relevant tests, and production build required by the changed files.
- Documentation-only changes normally require formatting and diff checks, not the full application test suite.
- When fixing a bug, add a regression test that would have failed before the fix when practical. If not practical, document the manual verification.

## Astro And Frontend Architecture

- Produce a static site compatible with GitHub Pages. Avoid server-only Astro features unless the hosting decision changes.
- Use TypeScript in strict mode.
- Prefer Astro components and browser-native APIs. Add client-side frameworks or heavy animation dependencies only when they materially improve the product experience.
- Centralize shared layout, navigation, metadata, locale handling, design tokens, and motion primitives.
- Keep page content separate from reusable presentation components.
- Ensure all pages work without JavaScript unless interaction or progressive enhancement genuinely requires it.

## URLs And Localization

- English is the source locale and uses no URL prefix.
- Japanese uses the `/ja/` prefix.
- Canonical URLs use trailing slashes.
- Do not redirect automatically based on browser language.
- Do not render English body content at a Japanese URL as a fallback.
- Publish English and Japanese together by default. English-only publication is reserved for explicitly approved urgent cases.
- Generate self-referencing canonical metadata, reciprocal `hreflang` metadata, and an English `x-default`.
- Preserve stable public URLs. Define explicit redirects when a published URL must move.

## Visual And Motion Direction

- Present Owlaria as a premium app built by a modern technology company.
- Use a dark navy foundation with purple, blue, and cyan luminous accents, bold typography, restrained glass surfaces, grids, and light effects.
- Make real Owlaria product screens the primary evidence; do not present fictional UI as a real product screenshot.
- Use the product logo and app icon clearly without making the site mascot-led or overly cute.
- Motion may include scroll reveal, light or gradient changes, subtle parallax, and focused sticky presentation.
- Never hijack scrolling. Respect `prefers-reduced-motion`, keyboard navigation, touch input, performance budgets, and readable contrast.

## Accessibility And Quality

- Use semantic HTML and preserve a logical heading hierarchy.
- All interactive controls must be keyboard accessible and have visible focus states.
- Images require appropriate alternative text; decorative images must be marked accordingly.
- Do not rely on color or motion alone to communicate meaning.
- Test responsive behavior at representative mobile and desktop sizes.
- Avoid broken or placeholder external links. Until Store URLs are confirmed, render `Coming soon` as non-link text.

## Secret Handling

- Never read, print, commit, summarize, or publish secret values.
- Treat `.env*`, credentials, private keys, tokens, certificates, and local release material as secret.
- It is acceptable to check that a required variable or file exists without displaying its value.
- Keep build and deploy free of secrets unless GitHub Pages later requires a narrowly scoped, documented credential.

## Git And Pull Requests

- Do not commit directly to `main`, except for the repository's first bootstrap commit when no base branch or commit history exists.
- Use concise kebab-case branches with one of: `feature/`, `bugfix/`, `docs/`, `refactor/`, `chore/`, or `test/`.
- Commit messages use English imperative mood and GitHub Gitmoji shortcodes, for example `:sparkles: Add locale navigation`.
- Pull request titles use a GitHub Gitmoji shortcode and Japanese summary.
- Pull request bodies must summarize the change, verification performed, visual evidence when relevant, and related issues.
- All changes go through a pull request and require one team member's approval before merge.
- Merge using a merge commit unless the team explicitly changes the repository policy.
