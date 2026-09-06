# Web localization maintenance

The supported-language policy and translation workflow are owned by
`over-patch/owlaria/docs/specs/localization.md`. Its glossary and inventory are
`localization_glossary.md` and `localization_inventory.md` in the same directory.
Consult them in the private repository; this public runbook describes only the
Web implementation and does not reproduce private source material.

## Change and review

1. Check the source meaning, intended route/state, public product specifications,
   and canonical glossary. Use AI translation with public source copy, context,
   variable meanings, and layout constraints. Use fictitious examples; never pass
   real reports, user data, credentials, or private release material into copy.
2. Manually compare `src/i18n/config.ts` with the canonical supported-language
   policy upstream; the public gate cannot read that private policy. Update every
   policy-required language together. Keep public copy in
   typed `Record<Locale, ...>` exports ending in `Copy` under `src/content/*.ts`.
   The resource check discovers these exports automatically. Register a new
   storage format in that check in the same change; do not put localized copy in
   an unverified path to bypass validation.
3. Compare source and translation side by side after AI generation. Check omitted
   conditions, negation, numbers, terminology, action outcomes, accessibility
   labels, metadata, and locale-specific links. When the source meaning changes,
   update translations or record why each retained translation still expresses
   the new meaning. Identical brands and technical names can be correct.
4. Run `pnpm check` and `pnpm check:i18n`, then the relevant content and browser
   tests. Before commit use the existing [publishing quality gate](./publishing.md).
5. Preview every changed route/state in all configured locales at desktop and
   mobile widths. Review wrapping, clipping, long names, empty/error/success
   states, keyboard navigation, screen-reader names, date/number presentation,
   and links. Record locale, route/state, browser/device, result, and remaining
   work in the PR or owning issue. Use the [preflight checklist](./preflight-checklist.md)
   before publication. No additional approval requirement is introduced.

Cross-repository changes need coordinated, linked changes. Publish only approved
public material. Release notes retain the existing canonical validation and
sanitized exporter in the private repository; this procedure does not replace it.

## Executable checks and limits

- `pnpm check`: existing Astro/TypeScript checks enforce required fields and
  locale coverage through `Record<Locale, ...>`.
- `pnpm check:i18n`: checks all discovered copy exports for configured locales,
  missing string field paths in either source or translation, invalid locale roots,
  empty objects/strings/collections, and named single-brace
  interpolation variable coverage. It also runs the existing route and release
  validation regression suites. `pnpm test` includes these tests as well.
- Web copy is typed TypeScript, not i18next JSON. Release metadata templates use
  `{version}` and `{platforms}`; the app's plural suffix rules do not apply here.
  A future plural/template format requires runtime support and validator fixtures
  in the same change.
- Prose paragraphs and heading line breaks may have different counts by locale.
  Array paths are normalized to `[]`; fields and variables are compared across
  the collection. This does not prove each paragraph/item has an equivalent
  translation or catch a variable moved between items. Existing content tests,
  type checks, and manual comparison retain that responsibility.
- The check does not classify equal strings as untranslated. It cannot prove
  semantic equivalence, naturalness, source meaning updates, hardcoded text in
  Astro/browser scripts, date/number correctness, or correct link destinations.
  Those require review and the existing route/link/browser checks.
- `check:i18n` runs locally on demand, before commit as instructed by AGENTS.md,
  within `verify:ci` for PR/main CI, and with type checking before the deployment
  artifact build. There is no automatic local Git hook in this repository.

The validator fixtures intentionally remove a locale/field, change a variable,
empty source text and a collection, and verify rejection. Valid fixtures cover
reordered variables, identical product names, and different line wrapping. A
synthetic added locale verifies that checks follow the supplied locale list.
No existing copy is excluded from this resource check.

## Adding a language

1. Update the canonical supported-language policy upstream through its existing
   decision process. Coordinate app, native, store, Web, legal, support, and
   release-note work; do not independently expand the public site's policy.
2. Update `locales` in `src/i18n/config.ts` and its boundary mapping to canonical
   locales. This automatically expands `Locale`, typed copy requirements,
   resource validation, and the release frontmatter schema. Until copy is added,
   type checking and resource validation must fail for the new locale.
3. Update every copy export, routes, prefix handling, locale navigation,
   `hreflang`/`x-default`, language-specific links, release locale pairing, and
   importer/exporter coordination. The current two-language switch and routing
   are explicit implementation constraints; changing the locale list alone does
   not implement these behaviors. Extend route/release/browser tests accordingly.
4. Review translated public legal/purchase/support claims against their owners,
   and run all local CI checks plus display and accessibility review. Record
   cross-repository readiness before publication.

Existing app screen/native migration is owned upstream by #1624–#1626. Public
copy alignment is #1627 and final language QA is #1628. This Web resource gate
neither certifies those migrations nor excludes migrated resources because other
surfaces remain unfinished.
