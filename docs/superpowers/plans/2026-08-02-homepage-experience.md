# Owlaria Homepage Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the foundation placeholder at `/` and `/ja/` with a bilingual, premium Owlaria product homepage that uses a real application screenshot and presents honest macOS/iOS availability.

**Architecture:** Keep localized product content in a typed module, render it through Astro-only presentational components, and use the existing shared layout and browser-native reveal primitive. Store availability is modeled as data so confirmed URLs can be enabled without changing component structure; while URLs are unavailable, both platforms render non-link `Coming soon` labels.

**Tech Stack:** Astro 7 static output, strict TypeScript, CSS design tokens, Vitest, Playwright, mise-managed Node.js and pnpm.

## Global Constraints

- English is the source locale at `/`; Japanese is published at `/ja/` at the same time.
- The English heading is exactly `Your library. Reimagined.`.
- Store URLs are not yet confirmed, so `Coming soon` / `近日公開` must be non-link text.
- macOS and iOS are separate products and separate purchases.
- Use only a screenshot captured from the real Owlaria application; do not create or imply fictional product UI.
- Preserve static rendering, no-JavaScript usability, keyboard access, responsive behavior, and `prefers-reduced-motion` support.
- Do not introduce a client framework, animation dependency, backend, CMS, database, external preview service, or secret.

---

### Task 1: Typed homepage content and availability

**Files:**

- Create: `src/content/home.ts`
- Create: `tests/unit/home-content.test.ts`

**Interfaces:**

- Consumes: `Locale` from `src/i18n/config.ts`.
- Produces: `homeCopy: Record<Locale, HomeCopy>`, `platforms: Platform[]`, and `platformHref(platform: Platform): string | undefined`.

- [ ] **Step 1: Write the failing content tests**

```ts
import { describe, expect, it } from 'vitest';

import { homeCopy, platforms, platformHref } from '../../src/content/home';

describe('homepage content', () => {
  it('publishes the required English hero and a distinct Japanese hero', () => {
    expect(homeCopy.en.hero.heading).toBe('Your library. Reimagined.');
    expect(homeCopy.ja.hero.heading).toBe('本棚の未来を、ここから。');
    expect(homeCopy.ja.hero.heading).not.toBe(homeCopy.en.hero.heading);
  });

  it('keeps unavailable Store destinations as non-link data', () => {
    expect(platforms.map(platformHref)).toEqual([undefined, undefined]);
    expect(platforms.map((platform) => platform.id)).toEqual(['macos', 'ios']);
  });

  it('states that macOS and iOS are separate purchases in both locales', () => {
    expect(homeCopy.en.platforms.purchaseNote).toMatch(/separate purchase/i);
    expect(homeCopy.ja.platforms.purchaseNote).toContain('別々の購入');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `mise exec -- pnpm test tests/unit/home-content.test.ts`

Expected: FAIL because `src/content/home.ts` does not exist.

- [ ] **Step 3: Implement the typed content model**

```ts
import type { Locale } from '../i18n/config';

export type PlatformId = 'macos' | 'ios';

export type Platform = {
  id: PlatformId;
  storeUrl?: string;
};

export type HomeCopy = {
  metadata: { title: string; description: string };
  hero: { eyebrow: string; heading: string; body: string; previewAlt: string };
  features: {
    eyebrow: string;
    heading: string;
    items: Array<{ number: string; title: string; body: string }>;
  };
  platforms: {
    eyebrow: string;
    heading: string;
    body: string;
    purchaseNote: string;
    comingSoon: string;
    labels: Record<PlatformId, { name: string; detail: string }>;
  };
  closing: { eyebrow: string; heading: string; body: string };
};

export const platforms: Platform[] = [{ id: 'macos' }, { id: 'ios' }];

export const platformHref = (platform: Platform): string | undefined =>
  platform.storeUrl;

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    metadata: {
      title: 'Owlaria — Your library. Reimagined.',
      description:
        'Bring the books you care about into one focused library with Owlaria for macOS and iOS.',
    },
    hero: {
      eyebrow: 'A new perspective on your books',
      heading: 'Your library. Reimagined.',
      body: 'Bring the books you care about into one focused library—designed to feel at home on macOS and iOS.',
      previewAlt: 'Owlaria displaying a library of books',
    },
    features: {
      eyebrow: 'Made for your collection',
      heading: 'Less friction. More room for every book.',
      items: [
        {
          number: '01',
          title: 'One calm library',
          body: 'Keep the books that matter to you in a focused space built for browsing.',
        },
        {
          number: '02',
          title: 'Sources, brought together',
          body: 'Build your collection from the sources you choose without losing sight of the whole.',
        },
        {
          number: '03',
          title: 'Designed for Apple platforms',
          body: 'A clear, responsive experience shaped for macOS and iOS from the start.',
        },
      ],
    },
    platforms: {
      eyebrow: 'Choose your platform',
      heading: 'Owlaria, where your library lives.',
      body: 'Owlaria is coming to macOS and iOS.',
      purchaseNote:
        'The macOS and iOS editions are separate products and require a separate purchase.',
      comingSoon: 'Coming soon',
      labels: {
        macos: { name: 'Owlaria for macOS', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iOS', detail: 'App Store' },
      },
    },
    closing: {
      eyebrow: 'Your next chapter',
      heading: 'A better place for every book you keep.',
      body: 'Owlaria is being prepared for its first release on macOS and iOS.',
    },
  },
  ja: {
    metadata: {
      title: 'Owlaria — 本棚の未来を、ここから。',
      description:
        '大切な本をひとつの心地よいライブラリへ。OwlariaはmacOSとiOSに登場します。',
    },
    hero: {
      eyebrow: '本との向き合い方を、新しく',
      heading: '本棚の未来を、ここから。',
      body: '大切な本を、ひとつの心地よいライブラリへ。macOSとiOSのために生まれた、新しい読書の居場所です。',
      previewAlt: '本のライブラリを表示するOwlariaの画面',
    },
    features: {
      eyebrow: 'コレクションのための設計',
      heading: '探す手間を減らして、本と出会う余白を。',
      items: [
        {
          number: '01',
          title: '心地よい、ひとつの本棚',
          body: '大切な本を見渡しやすく、落ち着いて楽しめる場所にまとめます。',
        },
        {
          number: '02',
          title: '選んだソースを、ひとつに',
          body: '使いたいソースから集めながら、コレクション全体をすっきり見渡せます。',
        },
        {
          number: '03',
          title: 'Appleプラットフォームのために',
          body: 'macOSとiOS、それぞれで自然に使える明快な体験を目指しました。',
        },
      ],
    },
    platforms: {
      eyebrow: 'プラットフォームを選ぶ',
      heading: 'Owlariaを、あなたの本棚がある場所へ。',
      body: 'OwlariaはmacOSとiOSに登場します。',
      purchaseNote: 'macOS版とiOS版は別商品で、それぞれ別々の購入が必要です。',
      comingSoon: '近日公開',
      labels: {
        macos: { name: 'Owlaria for macOS', detail: 'Mac App Store' },
        ios: { name: 'Owlaria for iOS', detail: 'App Store' },
      },
    },
    closing: {
      eyebrow: '次の一冊へ',
      heading: '大切な本に、もっとふさわしい居場所を。',
      body: 'OwlariaはmacOSとiOSでの初回リリースに向けて準備中です。',
    },
  },
};
```

- [ ] **Step 4: Run the focused and full unit suites and verify GREEN**

Run: `mise exec -- pnpm test tests/unit/home-content.test.ts`

Expected: 3 tests pass.

Run: `mise exec -- pnpm test`

Expected: all tests pass.

- [ ] **Step 5: Commit the content model**

```sh
git add src/content/home.ts tests/unit/home-content.test.ts
git commit -m ":sparkles: Add bilingual homepage content"
```

### Task 2: Homepage structure and honest Store states

**Files:**

- Create: `src/components/home/HomePage.astro`
- Create: `src/components/home/PlatformCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/ja/index.astro`
- Modify: `tests/e2e/foundation.spec.ts`
- Create: `tests/e2e/homepage.spec.ts`

**Interfaces:**

- Consumes: `homeCopy`, `platforms`, and `platformHref` from Task 1; `SiteLayout`; `/owlaria-app-icon.png`; `/screenshots/owlaria-library.png` from Task 3.
- Produces: semantic bilingual homepage sections and `data-testid="platform-macos"` / `data-testid="platform-ios"` cards.

- [ ] **Step 1: Write failing homepage browser tests**

```ts
import { expect, test } from '@playwright/test';

for (const locale of [
  {
    path: '/',
    heading: 'Your library. Reimagined.',
    platformHeading: 'Owlaria, where your library lives.',
    comingSoon: 'Coming soon',
  },
  {
    path: '/ja/',
    heading: '本棚の未来を、ここから。',
    platformHeading: 'Owlariaを、あなたの本棚がある場所へ。',
    comingSoon: '近日公開',
  },
] as const) {
  test(`${locale.path} presents the localized product story`, async ({
    page,
  }) => {
    await page.goto(locale.path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale.heading,
    );
    await expect(
      page.getByRole('heading', { name: locale.platformHeading }),
    ).toBeVisible();
    await expect(page.getByAltText(/Owlaria/)).toBeVisible();

    for (const id of ['macos', 'ios']) {
      const card = page.getByTestId(`platform-${id}`);
      await expect(card).toContainText(locale.comingSoon);
      await expect(card.getByRole('link')).toHaveCount(0);
    }
  });
}

test('homepage remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Your library. Reimagined.' }),
  ).toBeVisible();
  await expect(page.getByText('One calm library')).toBeVisible();
  await context.close();
});
```

- [ ] **Step 2: Run the homepage suite and verify RED**

Run: `mise exec -- pnpm build && mise exec -- pnpm test:e2e -- tests/e2e/homepage.spec.ts`

Expected: FAIL because the foundation placeholder does not contain the product story or platform cards.

- [ ] **Step 3: Implement the platform card**

```astro
---
import type { Platform, PlatformId } from '../../content/home';

interface Props {
  platform: Platform;
  label: { name: string; detail: string };
  comingSoon: string;
  href?: string;
}

const { platform, label, comingSoon, href } = Astro.props;
const icon = platform.id === ('macos' satisfies PlatformId) ? '⌘' : '◉';
---

<article class="platform-card" data-testid={`platform-${platform.id}`}>
  <span class="platform-symbol" aria-hidden="true">{icon}</span>
  <div>
    <p class="platform-detail">{label.detail}</p>
    <h3>{label.name}</h3>
  </div>
  {
    href ? (
      <a class="platform-action" href={href}>
        {label.detail}
      </a>
    ) : (
      <span class="platform-action platform-action--pending">{comingSoon}</span>
    )
  }
</article>
```

- [ ] **Step 4: Implement the homepage sections**

`HomePage.astro` must render, in order:

```astro
<SiteLayout
  locale={locale}
  pathname="/"
  title={copy.metadata.title}
  description={copy.metadata.description}
>
  <section class="home-hero shell">
    <div class="hero-copy" data-reveal>
      <p class="eyebrow">{copy.hero.eyebrow}</p>
      <h1>{copy.hero.heading}</h1>
      <p class="hero-body">{copy.hero.body}</p>
      <div class="hero-availability" aria-label={copy.platforms.body}>
        <span>macOS</span><span>iOS</span><strong
          >{copy.platforms.comingSoon}</strong
        >
      </div>
    </div>
    <figure class="product-preview" data-reveal>
      <img
        src="/screenshots/owlaria-library.png"
        alt={copy.hero.previewAlt}
        width="1440"
        height="960"
      />
    </figure>
  </section>
  <section class="feature-section shell" aria-labelledby="feature-heading">
    <p class="eyebrow">{copy.features.eyebrow}</p>
    <h2 id="feature-heading">{copy.features.heading}</h2>
    <ol class="feature-grid">
      {
        copy.features.items.map((feature) => (
          <li data-reveal>
            <>
              <span>{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </>
          </li>
        ))
      }
    </ol>
  </section>
  <section class="platform-section shell" aria-labelledby="platform-heading">
    <div data-reveal>
      <p class="eyebrow">{copy.platforms.eyebrow}</p><h2 id="platform-heading">
        {copy.platforms.heading}
      </h2><p>{copy.platforms.body}</p>
    </div>
    <div class="platform-grid">
      {
        platforms.map((platform) => (
          <PlatformCard
            platform={platform}
            label={copy.platforms.labels[platform.id]}
            comingSoon={copy.platforms.comingSoon}
            href={platformHref(platform)}
          />
        ))
      }
    </div>
    <p class="purchase-note">{copy.platforms.purchaseNote}</p>
  </section>
  <section class="closing-section shell" data-reveal>
    <img src="/owlaria-app-icon.png" width="96" height="96" alt="" />
    <p class="eyebrow">{copy.closing.eyebrow}</p><h2>
      {copy.closing.heading}
    </h2><p>{copy.closing.body}</p>
  </section>
</SiteLayout>
```

Both route files must import `HomePage` and render `<HomePage locale="en" />` or `<HomePage locale="ja" />`. Remove only the two home-route uses of `FoundationPage`; keep `FoundationPage` for unfinished routes.

- [ ] **Step 5: Run the homepage and foundation suites and verify GREEN**

Run: `mise exec -- pnpm build && mise exec -- pnpm test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/foundation.spec.ts`

Expected: homepage tests pass; all existing route, metadata, navigation, no-JavaScript, and reduced-motion tests remain green.

- [ ] **Step 6: Commit the semantic homepage**

```sh
git add src/components/home src/pages/index.astro src/pages/ja/index.astro tests/e2e
git commit -m ":sparkles: Build bilingual product homepage"
```

### Task 3: Real Owlaria application screenshot

**Files:**

- Create: `public/screenshots/owlaria-library.png`
- Create: `docs/screenshots/1553-source-app.png`

**Interfaces:**

- Consumes: the existing local Owlaria debug or release application bundle and non-sensitive sample library data.
- Produces: a reviewed 3:2 product screenshot used by `HomePage.astro` plus a visual evidence copy for the PR.

- [ ] **Step 1: Launch the real application**

Run the existing local macOS application bundle at:

```text
/Users/kiyotaka/ghq/github.com/over-patch/owlaria/src-tauri/target/release/bundle/macos/Owlaria.app
```

Use only the application UI. Do not expose account identifiers, local filesystem paths, debug panels, receipts, tokens, unpublished release notes, or personal library data.

- [ ] **Step 2: Prepare a safe product view**

Open the normal library screen with non-sensitive sample books. Keep normal application chrome visible so the image is unambiguously a real Owlaria screen. Use a 1440×960 capture area and verify that every visible title is acceptable for a public website.

- [ ] **Step 3: Capture and review the source screenshot**

Save the capture as `docs/screenshots/1553-source-app.png`. Inspect the image at original resolution and confirm:

```text
real Owlaria UI: yes
personal data: none
secret or debug data: none
fictional overlay: none
readable at desktop hero size: yes
```

- [ ] **Step 4: Create the public product image without altering UI content**

Crop only empty outer desktop space if necessary. Do not redraw controls, add fake book data, or composite fictional interface elements. Save the final 1440×960 PNG as `public/screenshots/owlaria-library.png`.

- [ ] **Step 5: Verify image dimensions and the static build**

Run: `sips -g pixelWidth -g pixelHeight public/screenshots/owlaria-library.png`

Expected: `pixelWidth: 1440` and `pixelHeight: 960`.

Run: `mise exec -- pnpm build`

Expected: the build completes and copies the screenshot to `dist/screenshots/owlaria-library.png`.

- [ ] **Step 6: Commit the reviewed screenshot**

```sh
git add public/screenshots/owlaria-library.png docs/screenshots/1553-source-app.png
git commit -m ":camera_flash: Add real Owlaria product preview"
```

### Task 4: Premium responsive styling and motion QA

**Files:**

- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/homepage.spec.ts`
- Create: `docs/screenshots/1553-desktop.png`
- Create: `docs/screenshots/1553-mobile.png`
- Modify: `README.md`

**Interfaces:**

- Consumes: semantic class names from Task 2 and the existing `data-reveal` behavior.
- Produces: premium desktop/mobile layouts, no horizontal overflow, static reduced-motion presentation, and review evidence.

- [ ] **Step 1: Add failing responsive and reduced-motion assertions**

```ts
test('homepage fits representative mobile and desktop viewports', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(page.locator('.product-preview')).toBeVisible();
    await expect(page.getByTestId('platform-macos')).toBeVisible();
  }
});

test('reduced motion preserves every homepage section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const element of await page.locator('[data-reveal]').all()) {
    await expect(element).toHaveCSS('opacity', '1');
    await expect(element).toHaveCSS('transform', 'none');
  }
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `mise exec -- pnpm build && mise exec -- pnpm test:e2e -- tests/e2e/homepage.spec.ts`

Expected: FAIL until the new homepage classes have complete responsive styling.

- [ ] **Step 3: Extend design tokens**

Add these tokens to `:root` in `tokens.css`:

```css
--text-2xl: clamp(3.5rem, 2rem + 6.8vw, 8.5rem);
--text-section: clamp(2.3rem, 1.75rem + 2.8vw, 5rem);
--radius-lg: 2rem;
--shadow-product: 0 2rem 8rem rgb(0 0 0 / 48%), 0 0 7rem rgb(85 124 255 / 24%);
```

- [ ] **Step 4: Style the homepage without scroll hijacking**

Add focused rules for `.home-hero`, `.hero-copy`, `.hero-body`, `.hero-availability`, `.product-preview`, `.feature-section`, `.feature-grid`, `.platform-section`, `.platform-grid`, `.platform-card`, `.platform-symbol`, `.platform-detail`, `.platform-action`, `.purchase-note`, and `.closing-section`.

The exact layout requirements are:

```css
.home-hero {
  min-height: 52rem;
  padding-block: clamp(4rem, 9vw, 9rem);
}
.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 68rem;
}
.hero-copy h1 {
  max-width: 10ch;
  font-size: var(--text-2xl);
  line-height: 0.88;
  text-wrap: balance;
}
.product-preview {
  width: min(100%, 68rem);
  margin: clamp(3rem, 8vw, 7rem) auto 0;
  overflow: hidden;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-product);
}
.feature-grid,
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.platform-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (max-width: 48rem) {
  .feature-grid,
  .platform-grid {
    grid-template-columns: 1fr;
  }
}
```

Use only normal document flow, CSS Grid, and the existing reveal transitions. Do not add sticky sections or parallax unless the finished static composition has a specific need.

- [ ] **Step 5: Update repository status documentation**

Change the README status to:

```markdown
The shared Astro foundation is complete. The bilingual product homepage is being implemented in [over-patch/owlaria#1553](https://github.com/over-patch/owlaria/issues/1553), under the Phase 2 product Web epic [#1417](https://github.com/over-patch/owlaria/issues/1417). Independent domain, DNS, and HTTPS setup is tracked in [#1562](https://github.com/over-patch/owlaria/issues/1562).
```

- [ ] **Step 6: Run all automated quality gates**

Run, in order:

```sh
mise exec -- pnpm format
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm lint:actions
mise exec -- pnpm check
mise exec -- pnpm test
mise exec -- pnpm build
mise exec -- pnpm test:e2e
```

Expected: every command exits successfully with no warnings introduced by the homepage work.

- [ ] **Step 7: Capture visual evidence**

Use production preview and capture the complete English homepage at 1440×1000 and 390×844 as `docs/screenshots/1553-desktop.png` and `docs/screenshots/1553-mobile.png`. Repeat the visual inspection for `/ja/`, no-JavaScript navigation, keyboard focus, and reduced motion; record those checks in the PR body.

- [ ] **Step 8: Commit the finished experience**

```sh
git add src/styles tests/e2e/homepage.spec.ts docs/screenshots README.md
git commit -m ":lipstick: Polish the Owlaria homepage experience"
```

### Task 5: Pull request and review handoff

**Files:**

- No source files added unless verification finds a defect, in which case return to the relevant RED-GREEN cycle.

**Interfaces:**

- Consumes: all verified Task 1–4 commits.
- Produces: a ready-for-review pull request linked to #1553.

- [ ] **Step 1: Review the complete diff and public boundary**

Run:

```sh
git status --short
git diff main...HEAD --check
git diff --stat main...HEAD
```

Confirm that the diff contains no credentials, private source, internal release notes, personal library data, or unreviewed Store URLs.

- [ ] **Step 2: Push the feature branch**

```sh
git push -u origin feature/homepage-experience
```

- [ ] **Step 3: Open the pull request**

Use title `:sparkles: Owlariaトップページと入手導線を実装する`. The body must summarize the bilingual product story, real screenshot provenance, non-link Store states, separate-purchase explanation, automated verification, desktop/mobile evidence, and `Closes over-patch/owlaria#1553`.

- [ ] **Step 4: Leave the branch ready for one team-member approval**

Do not merge until one team member approves. Use a merge commit after approval, then delete the local and remote feature branch.
