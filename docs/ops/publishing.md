# Owlaria Web publishing runbook

This runbook is for publishing the public site at
`https://owlaria.overpatch.dev/`. All production changes go through a pull
request. The site is a static Astro build deployed by GitHub Actions to
GitHub Pages; there is no production server to update manually.

## 1. Create a branch and pull request

Start from an up-to-date `main` branch and use the repository's standard branch
prefixes (`feature/`, `bugfix/`, `docs/`, `refactor/`, `chore/`, or `test/`):

```sh
git switch main
git pull --ff-only origin main
git switch -c docs/short-description
```

Make the smallest focused change, inspect the complete diff, and open a pull
request against `main`. Keep public website content separate from private
application source, credentials, unpublished release information, and local
release material.

## 2. Run the local quality gate

Run the same checks as `.github/workflows/ci.yml` from the repository root:

```sh
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm lint:actions
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm exec playwright install chromium webkit
mise exec -- pnpm build
mise exec -- pnpm test:links
mise exec -- pnpm test:e2e
```

`test:e2e` starts the production preview defined in `playwright.config.ts`.
Record the command results in the pull request. Complete the
[preflight checklist](./preflight-checklist.md) for visual, accessibility,
metadata, integration, and production evidence that commands cannot prove.

For manual review of the production build, keep a second terminal open and run:

```sh
mise exec -- pnpm build
mise exec -- pnpm preview
```

Open the local URL printed by Astro. Review the baseline English and Japanese
routes at 1440×1000 and 390×844, including navigation, locale switching, focus,
content, assets, and horizontal overflow. Stop the preview with `Ctrl-C` after
recording the result in the pull request. This manual preview is separate from
the temporary server that Playwright starts and stops automatically.

## 3. Resolve feedback and obtain CI approval

Before merging, confirm all of the following in the pull request:

- The required `Verify website` check is passing for the latest commit.
- Every review conversation, if any, is resolved. An approving review is
  optional and is not required to merge.
- The diff contains only intended public content and the intended generated
  release-note files, if any.
- The preflight checklist has an owner and evidence for each applicable item.

Do not merge while a required check is pending or failing. Fix the branch and
rerun the checks rather than bypassing branch protection.

## 4. Merge and wait for Pages deployment

Merge the verified pull request to `main` according to repository policy. A push
to `main` starts the `Deploy to GitHub Pages` workflow in
`.github/workflows/deploy.yml`. Wait for both `Build Pages artifact` and the
deployment step `Deploy to GitHub Pages` to succeed. Do not treat a successful
CI run by itself as a production deployment.

Record the merge commit, CI run, deploy run, Pages URL, and timestamp in the
preflight evidence. If the deploy workflow fails, investigate the workflow log
and fix it through a pull request; do not upload an artifact by hand.

## 5. Smoke-test production

After Pages reports success, open the custom production URL and test every
changed route in both locales. The baseline route set is:

| English               | Japanese                 |
| --------------------- | ------------------------ |
| `/`                   | `/ja/`                   |
| `/support/`           | `/ja/support/`           |
| `/support/purchases/` | `/ja/support/purchases/` |
| `/releases/`          | `/ja/releases/`          |
| `/privacy/`           | `/ja/privacy/`           |
| `/terms/`             | `/ja/terms/`             |

For each changed route, verify the expected status, visible content, locale
switch, navigation, fragments, and assets. If release-detail pages exist,
smoke-test each published `/releases/<version>/` and
`/ja/releases/<version>/` page too. Confirm the production asset URLs used by
metadata, including `/owlaria-app-icon.png` and
`/social/owlaria-social.png`. Record the production URL, time, browser/device,
and result.

## 6. Publish release notes safely

Release-note source files live in the private `over-patch/owlaria` repository.
Use its release-note commands and the approved exporter; never copy the private
release directory or `internal.md` manually.

1. In `over-patch/owlaria`, have the Release Owner approve the public English
   content and Japanese translation, then run canonical validation:

   ```sh
   pnpm release-notes:validate -- --version 1.0.0
   ```

   Replace `1.0.0` with the actual version. The validation must pass.

2. Export only the public Web sections into a new directory outside both
   tracked repositories. Before Store publication, `--published-at` is the
   explicitly approved publication date; after publication, use the actual
   App Store Connect publication date:

   ```sh
   pnpm release-notes:export-web -- \
     --version 1.0.0 \
     --published-at YYYY-MM-DD \
     --output /private/tmp/owlaria-release-web
   ```

   The exporter writes sanitized `en.md` and `ja.md` files containing only the
   approved Web content and public metadata. The output directory must be new,
   must not be inside either repository, and must not be a symlink.

3. Review the generated diff with the Release Owner before putting anything in
   the Web pull request. Check that it contains no `internal.md`, App Store
   short copy, cancelled release, build number, tag, source SHA, secrets,
   unpublished material, or test fixture. Copy only the approved exporter
   output into the matching `src/content/releases/<locale>/<version>.md` paths
   in this repository.
4. Run the Web quality gate and review the built release pages. Before Store
   publication, keep the Web pull request unmerged. After Store publication,
   re-export with the confirmed publication date if it changed, update the
   pull request, and rerun the gate before merge.

## 7. Roll back with a revert pull request

If a production smoke test finds a faulty change:

1. Identify the faulty pull request and its merge commit. Preserve the failed
   deploy run and smoke-test evidence.
2. Create a new branch from current `main` and revert the faulty pull request
   with Git's normal revert operation. Do not rewrite history or force-push.
3. Open a new pull request for the revert. Run the full quality gate, resolve
   any review conversations, and wait for `Verify website` to pass. An
   approving review remains optional.
4. Merge the revert to `main`, wait for `Deploy to GitHub Pages` to succeed,
   and repeat the production smoke test and checklist evidence.

Never force-push `main` and never manually replace or delete the GitHub Pages
artifact. If the underlying content needs a follow-up fix, make it in another
pull request after the rollback is confirmed.
