import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const origin = 'https://owlaria.overpatch.dev';
const privateDecoy = await readFile(
  resolve('tests/fixtures/private-release-decoys/internal.md'),
  'utf8',
);
const nonPublicSentinels = privateDecoy
  .split('\n')
  .filter((line) => /^(?:#|- )/.test(line))
  .map((line) => line.replace(/^(?:# |- )/, ''));

test('English and Japanese indexes publish paired releases in descending order', async ({
  page,
}) => {
  for (const expected of [
    {
      path: '/releases/',
      lang: 'en',
      heading: 'Owlaria release notes',
      listLabel: 'Published releases',
      versions: ['1.10.0', '1.0.0'],
    },
    {
      path: '/ja/releases/',
      lang: 'ja',
      heading: 'Owlaria リリースノート',
      listLabel: '公開済みリリース',
      versions: ['1.10.0', '1.0.0'],
    },
  ] as const) {
    const response = await page.goto(expected.path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', expected.lang);
    await expect(
      page.getByRole('heading', { level: 1, name: expected.heading }),
    ).toBeVisible();
    const links = page
      .getByRole('list', { name: expected.listLabel })
      .getByRole('link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toContainText(expected.versions[0]);
    await expect(links.nth(1)).toContainText(expected.versions[1]);
  }
});

test('release details render reviewed Markdown and preserve the version across locales', async ({
  page,
}) => {
  await page.goto('/releases/1.0.0/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Owlaria 1.0.0' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: 'Highlights' }),
  ).toBeVisible();
  await expect(
    page.getByText('Public route verification fixture.'),
  ).toBeVisible();
  await expect(page.getByTestId('header-locale-switch')).toHaveAttribute(
    'href',
    '/ja/releases/1.0.0/',
  );

  await page.getByTestId('header-locale-switch').click();
  await expect(page).toHaveURL('/ja/releases/1.0.0/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(
    page.getByRole('heading', { level: 2, name: 'ハイライト' }),
  ).toBeVisible();
  await expect(page.getByText('公開ルート確認用のfixtureです。')).toBeVisible();
});

test('detail pages publish canonical and reciprocal locale metadata', async ({
  page,
}) => {
  for (const expected of [
    {
      path: '/releases/1.0.0/',
      canonical: `${origin}/releases/1.0.0/`,
    },
    {
      path: '/ja/releases/1.0.0/',
      canonical: `${origin}/ja/releases/1.0.0/`,
    },
  ]) {
    await page.goto(expected.path);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      expected.canonical,
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      `${origin}/releases/1.0.0/`,
    );
    await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute(
      'href',
      `${origin}/ja/releases/1.0.0/`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${origin}/releases/1.0.0/`,
    );
  }
});

test('detail descriptions name only the platforms in each release', async ({
  page,
}) => {
  for (const expected of [
    {
      path: '/releases/1.0.0/',
      description: 'What changed in Owlaria 1.0.0 for macOS and iOS.',
    },
    {
      path: '/releases/1.10.0/',
      description: 'What changed in Owlaria 1.10.0 for macOS.',
    },
    {
      path: '/ja/releases/1.0.0/',
      description: 'macOS・iOS版Owlaria 1.0.0の変更内容です。',
    },
    {
      path: '/ja/releases/1.10.0/',
      description: 'macOS版Owlaria 1.10.0の変更内容です。',
    },
  ]) {
    await page.goto(expected.path);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      expected.description,
    );
  }
});

test('release navigation works from the keyboard', async ({ page }) => {
  await page.goto('/releases/');
  const releaseLink = page.getByRole('link', { name: /Version 1\.0\.0/ });

  await releaseLink.focus();
  await expect(releaseLink).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('/releases/1.0.0/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Owlaria 1.0.0' }),
  ).toBeVisible();
});

test('release pages stay readable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/releases/', '/releases/1.0.0/']) {
    await page.goto(path);
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
  }

  await page.goto('/releases/');
  const columns = await page
    .getByRole('list', { name: 'Published releases' })
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(columns.split(' ')).toHaveLength(1);
});

test('the production-empty build has a polished bilingual index and no detail pages', async ({
  page,
}) => {
  const englishIndex = await readFile(
    resolve('dist/releases/index.html'),
    'utf8',
  );
  const japaneseIndex = await readFile(
    resolve('dist/ja/releases/index.html'),
    'utf8',
  );

  await page.setContent(englishIndex);
  await expect(
    page.getByRole('heading', { level: 2, name: 'No release notes yet' }),
  ).toBeVisible();
  await expect(
    page.getByText('Reviewed updates will appear here'),
  ).toBeVisible();

  await page.setContent(japaneseIndex);
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: '公開済みのリリースはまだありません',
    }),
  ).toBeVisible();
  await expect(
    page.getByText('レビュー済みの更新情報をこちらで公開します'),
  ).toBeVisible();

  await expect(stat(resolve('dist/releases/1.0.0'))).rejects.toMatchObject({
    code: 'ENOENT',
  });
  await expect(stat(resolve('dist/ja/releases/1.0.0'))).rejects.toMatchObject({
    code: 'ENOENT',
  });
});

test('generated release pages exclude non-public metadata and copy', async ({
  page,
}) => {
  expect(nonPublicSentinels).toHaveLength(5);

  for (const path of [
    '/releases/',
    '/ja/releases/',
    '/releases/1.0.0/',
    '/ja/releases/1.0.0/',
  ]) {
    await page.goto(path);
    const body = await page.locator('body').innerText();

    for (const sentinel of nonPublicSentinels) {
      expect(body).not.toContain(sentinel);
    }
  }

  const generatedReleasePages = await Promise.all(
    [
      'releases/index.html',
      'releases/1.0.0/index.html',
      'ja/releases/index.html',
      'ja/releases/1.0.0/index.html',
    ].map((path) =>
      readFile(resolve('test-results/release-fixtures-site', path), 'utf8'),
    ),
  );
  const generatedHtml = generatedReleasePages.join('\n');
  for (const sentinel of nonPublicSentinels) {
    expect(generatedHtml).not.toContain(sentinel);
  }
});
