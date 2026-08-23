# Features Page Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Owlaria features page as a persuasive product page that explains the product's differentiated value, supports it with dedicated real-screen placeholders, and makes availability and pricing conditions easy to understand.

**Architecture:** Keep localized copy in `src/content/features.ts` and rendering in `src/components/features/FeaturesPage.astro`. Replace the six equal-weight catalog categories with four value-led sections (`sources`, `library`, `viewer`, `everyday`), each with a distinct presentation. Use semantic HTML and CSS-only diagrams/placeholders; do not depict fictional application UI as a real screenshot.

**Tech Stack:** Astro, TypeScript, CSS, Vitest, Playwright

## Global Constraints

- Japanese product copy uses `マンガ`, not `漫画` or `コミック`.
- Lead with keeping folders unchanged, not writing management files to storage, unifying multiple NAS/local sources, and flexible reading modes.
- Display ZIP, CBZ, RAR, CBR, 7Z, CB7, LZH, and PDF as individual extensions.
- Password support is limited to ZIP, CBZ, RAR, CBR, 7Z, and CB7.
- Mac and iPhone are current launch platforms; Windows and Android must be marked as planned, never currently available.
- State that core features are free and that paid features are purchased separately per platform.
- Until approved screenshots are supplied, reserve clearly labelled replacement frames and do not draw fictional product UI.
- All layouts must avoid horizontal overflow at 390px, 768px, 1024px, and 1440px.

---

### Task 1: Lock the revised content contract

**Files:**

- Modify: `tests/unit/features-content.test.ts`
- Modify: `src/content/features.ts`

**Interfaces:**

- Produces: `FeaturePageCopy.sections`, `formats.passwordArchive`, and `availability.currentPlatforms/futurePlatforms/freeNote/purchaseNote` for the page component.

- [ ] **Step 1: Write failing content tests**

Assert the following exact contracts before changing production content:

```ts
expect(featurePageCopy.ja.hero.heading).toBe(
  'フォルダはそのまま。整理も、読み方も、思いどおりに。',
);
expect(featurePageCopy.en.sections.map(({ id }) => id)).toEqual([
  'sources',
  'library',
  'viewer',
  'everyday',
]);
expect(featurePageCopy.ja.formats.archive).toEqual([
  'ZIP',
  'CBZ',
  'RAR',
  'CBR',
  '7Z',
  'CB7',
  'LZH',
  'PDF',
]);
expect(featurePageCopy.ja.formats.passwordArchive).toEqual([
  'ZIP',
  'CBZ',
  'RAR',
  'CBR',
  '7Z',
  'CB7',
]);
expect(JSON.stringify(featurePageCopy.ja)).not.toMatch(/漫画|コミック/);
expect(featurePageCopy.ja.availability.freeNote).toContain('基本機能は無料');
expect(featurePageCopy.ja.availability.futurePlatforms).toEqual([
  'Windows',
  'Android',
]);
```

- [ ] **Step 2: Run the unit test and verify RED**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: FAIL because the revised hero, section model, individual format badges, password formats, and availability fields do not exist yet.

- [ ] **Step 3: Implement the bilingual content model**

Define these exact section IDs and presentation kinds:

```ts
type FeatureSectionId = 'sources' | 'library' | 'viewer' | 'everyday';
type FeatureVisual =
  | { kind: 'source-diagram' }
  | { kind: 'product-preview'; platform: string; title: string; note: string }
  | { kind: 'reader-modes'; groups: { title: string; values: string[] }[] };
```

Write aligned English and Japanese copy for the four sections. Move duplicated Read-Only/metadata language into `sources`; group search, series, metadata, cover, bulk editing, and tracking under `library`; make reading direction/display/scrolling the dominant `viewer` content; group private libraries, history, statistics, and preferences under `everyday`.

- [ ] **Step 4: Run the unit test and verify GREEN**

Run: `mise exec -- pnpm exec vitest run tests/unit/features-content.test.ts`

Expected: PASS.

### Task 2: Rebuild the page hierarchy and evidence blocks

**Files:**

- Modify: `tests/e2e/features.spec.ts`
- Modify: `src/components/features/FeaturesPage.astro`

**Interfaces:**

- Consumes: `FeaturePageCopy.sections`, `formats`, and `availability` from Task 1.
- Produces: `.feature-source-diagram`, `[data-testid="feature-product-preview"]`, `.feature-reader-modes`, and `.feature-platform-panel` for styling and tests.

- [ ] **Step 1: Write failing page-structure tests**

Add assertions for four value-led sections, three independent source nodes, two screenshot replacement frames, reader-mode groups, basic-free copy, and planned platforms:

```ts
await expect(page.locator('.feature-story')).toHaveCount(4);
await expect(page.locator('.feature-source-node')).toHaveCount(3);
await expect(page.getByTestId('feature-product-preview')).toHaveCount(2);
await expect(page.locator('.feature-reader-mode-group')).toHaveCount(3);
await expect(page.getByText('Windows', { exact: true })).toBeVisible();
await expect(page.getByText('Android', { exact: true })).toBeVisible();
await expect(page.getByText(/基本機能は無料/)).toBeVisible();
```

- [ ] **Step 2: Run the focused E2E test and verify RED**

Run: `env TMPDIR=/private/tmp mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts`

Expected: FAIL because the new story, visual, and availability elements are absent.

- [ ] **Step 3: Implement semantic Astro sections**

Render the hero with three concise decision points. Render `sources` with `NAS 1`, `NAS 2`, and `LOCAL` as separate nodes flowing into Owlaria. Render `library` and `viewer` with labelled replacement frames containing the app icon and `note`; include a source comment that approved screenshots must replace these frames. Render `viewer` with three groups for direction, page display, and continuous scrolling. Render platform availability as non-link cards while Store URLs are unavailable.

- [ ] **Step 4: Run the focused E2E test and verify GREEN**

Run: `env TMPDIR=/private/tmp mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts`

Expected: PASS.

### Task 3: Create a responsive, varied visual system

**Files:**

- Modify: `src/styles/global.css`
- Modify: `tests/e2e/features.spec.ts`

**Interfaces:**

- Consumes: class names introduced in Task 2.
- Produces: two-column story layouts above tablet width and single-column layouts below it without overlap or overflow.

- [ ] **Step 1: Add failing responsive assertions**

At 390px, 768px, 1024px, and 1440px, assert no horizontal overflow. At 390px and 768px, assert every `.feature-story-layout` has one computed grid column. At 1024px and 1440px, assert screenshot-led stories have two columns. Assert every replacement frame begins below its section heading at narrow widths.

- [ ] **Step 2: Run the responsive E2E test and verify RED**

Run: `env TMPDIR=/private/tmp mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts -g "responsive"`

Expected: FAIL until the new layout styles exist.

- [ ] **Step 3: Implement the visual hierarchy**

Use rounded glass surfaces and restrained cyan/purple gradients already defined by the site tokens. Give source, library, reader, and everyday sections distinct compositions instead of identical cards. Keep preview frames at `aspect-ratio: 16 / 10`, reserve a phone-sized inset only where it adds evidence, and use `minmax(0, 1fr)` throughout. At `max-width: 64rem`, collapse story layouts to one column; at `max-width: 48rem`, reduce heading scale and padding; never position a preview over copy.

- [ ] **Step 4: Run responsive and accessibility tests**

Run:

```bash
env TMPDIR=/private/tmp mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts tests/e2e/accessibility.spec.ts
```

Expected: PASS with no serious/critical axe violations or horizontal overflow.

### Task 4: Review and verify the complete change

**Files:**

- Review: `src/content/features.ts`
- Review: `src/components/features/FeaturesPage.astro`
- Review: `src/styles/global.css`
- Review: `tests/unit/features-content.test.ts`
- Review: `tests/e2e/features.spec.ts`

- [ ] **Step 1: Dispatch independent diff review**

Ask reviewers to verify the Global Constraints, copy consistency, semantic structure, responsive behavior, and absence of fictional UI. Fix every Critical or Important finding and rerun covering tests.

- [ ] **Step 2: Run repository quality gates**

Run:

```bash
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm check
mise exec -- pnpm test
env TMPDIR=/private/tmp mise exec -- pnpm exec playwright test tests/e2e/features.spec.ts tests/e2e/accessibility.spec.ts
mise exec -- pnpm build
git diff --check
```

Expected: all commands pass.

- [ ] **Step 3: Verify visually in the in-app browser**

Inspect `/ja/features/` and `/features/` at representative desktop, tablet, and mobile widths. Confirm the four-section hierarchy is clear, screenshot frames never overlap copy, Japanese phrase breaks are intentional, platform status is unambiguous, and the page works without relying on motion.
