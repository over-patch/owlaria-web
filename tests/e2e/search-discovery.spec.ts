import { expect, test } from '@playwright/test';

const origin = 'https://owlaria.overpatch.dev';

test('robots.txt permits crawling and advertises the sitemap index', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  const robots = await response.text();
  expect(robots).toMatch(/^User-agent: \*$/m);
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:\s*\S+/m);
  expect(robots).toContain(`Sitemap: ${origin}/sitemap-index.xml`);
});

test('the sitemap lists working canonical pages in both languages', async ({
  request,
}) => {
  const indexResponse = await request.get('/sitemap-index.xml');
  expect(indexResponse.status()).toBe(200);
  expect(indexResponse.headers()['content-type']).toContain('xml');
  const index = await indexResponse.text();
  expect(index).toContain('<sitemapindex');
  const sitemapUrls = Array.from(
    index.matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, url]) => new URL(url),
  );
  expect(sitemapUrls.length).toBeGreaterThan(0);

  const pageUrls: string[] = [];
  for (const sitemapUrl of sitemapUrls) {
    expect(sitemapUrl.origin).toBe(origin);
    const response = await request.get(sitemapUrl.pathname);
    expect(response.status()).toBe(200);
    const sitemap = await response.text();
    expect(sitemap).toContain('<urlset');

    for (const [, entry] of sitemap.matchAll(/<url>(.*?)<\/url>/gs)) {
      const url = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
      expect(url).toBeDefined();
      pageUrls.push(url!);
      expect(entry).toMatch(/hreflang="en"/);
      expect(entry).toMatch(/hreflang="ja"/);
    }
  }

  for (const path of [
    '/',
    '/features/',
    '/plans/',
    '/support/',
    '/support/purchases/',
    '/privacy/',
    '/terms/',
    '/releases/',
    '/releases/1.0.0/',
    '/releases/1.10.0/',
  ]) {
    expect(pageUrls).toContain(`${origin}${path}`);
    expect(pageUrls).toContain(`${origin}/ja${path}`);
  }
  expect(new Set(pageUrls).size).toBe(pageUrls.length);

  for (const pageUrl of pageUrls) {
    const url = new URL(pageUrl);
    expect(url.origin).toBe(origin);
    expect(url.pathname).toMatch(/\/$/);
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.pathname).not.toMatch(/(?:404|fixtures|internal)/);
    const response = await request.get(url.pathname);
    expect(response.status(), pageUrl).toBe(200);
    expect(await response.text()).toContain(
      `<link rel="canonical" href="${pageUrl}"`,
    );
  }
});
