import { describe, expect, it } from 'vitest';

import {
  handleLocaleRedirectRequest,
  localeRedirectResponse,
  type CloudflareRequest,
} from '../../cloudflare/locale-redirect-worker';

function requestFromCountry(
  path: string,
  country: string | null,
  init?: RequestInit,
  protocol = 'https:',
): CloudflareRequest {
  const request = new Request(
    `${protocol}//owlaria.overpatch.dev${path}`,
    init,
  );
  Object.defineProperty(request, 'cf', {
    value: { country },
  });
  return request as CloudflareRequest;
}

describe('localeRedirectResponse', () => {
  it.each([
    ['/', 'JP'],
    ['/support/?source=legacy', 'US'],
  ])('canonicalizes HTTP %s before locale handling', (path, country) => {
    const response = localeRedirectResponse(
      requestFromCountry(path, country, undefined, 'http:'),
    );

    expect(response?.status).toBe(308);
    expect(response?.headers.get('location')).toBe(
      `https://owlaria.overpatch.dev${path}`,
    );
    expect(response?.headers.has('set-cookie')).toBe(false);
  });

  it.each(['GET', 'HEAD'])('redirects a JP %s homepage request', (method) => {
    const response = localeRedirectResponse(
      requestFromCountry('/', 'JP', { method }),
    );

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe(
      'https://owlaria.overpatch.dev/ja/',
    );
    expect(response?.headers.get('set-cookie')).toBe(
      'owlaria_locale=ja; Max-Age=31536000; Path=/; SameSite=Lax; Secure',
    );
  });

  it('preserves the homepage query string when redirecting', () => {
    const response = localeRedirectResponse(
      requestFromCountry('/?utm_source=app', 'JP'),
    );

    expect(response?.headers.get('location')).toBe(
      'https://owlaria.overpatch.dev/ja/?utm_source=app',
    );
  });

  it.each(['en', 'ja'])('respects an explicit %s preference', (locale) => {
    const response = localeRedirectResponse(
      requestFromCountry('/', 'JP', {
        headers: { cookie: `owlaria_locale=${locale}` },
      }),
    );

    expect(response).toBeNull();
  });

  it.each([
    ['a visitor outside Japan', requestFromCountry('/', 'US')],
    ['an unknown country', requestFromCountry('/', null)],
    ['a Japanese localized route', requestFromCountry('/ja/', 'JP')],
    ['another English route', requestFromCountry('/support/', 'JP')],
    [
      'a non-safe request',
      requestFromCountry('/', 'JP', { method: 'POST', body: 'report' }),
    ],
  ])('does not redirect %s', (_label, request) => {
    expect(localeRedirectResponse(request)).toBeNull();
  });
});

describe('handleLocaleRedirectRequest', () => {
  it('forwards a request that does not qualify for redirect', async () => {
    const request = requestFromCountry('/support/', 'JP');
    let forwardedRequest: Request | undefined;
    const originFetch = async (input: Request) => {
      forwardedRequest = input;
      return new Response('origin', { status: 200 });
    };

    const response = await handleLocaleRedirectRequest(request, originFetch);

    expect(forwardedRequest).toBe(request);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('origin');
  });

  it('does not contact the origin for a redirect', async () => {
    const request = requestFromCountry('/', 'JP');
    let originCalls = 0;
    const originFetch = async () => {
      originCalls += 1;
      return new Response('origin');
    };

    const response = await handleLocaleRedirectRequest(request, originFetch);

    expect(originCalls).toBe(0);
    expect(response.status).toBe(307);
  });
});
