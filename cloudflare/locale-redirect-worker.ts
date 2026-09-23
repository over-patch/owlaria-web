import {
  readLocalePreference,
  serializeLocalePreference,
} from '../src/i18n/locale-preference';

export type CloudflareRequest = Request & {
  readonly cf?: {
    readonly country?: string | null;
  };
};

type OriginFetch = (request: Request) => Promise<Response>;

export function localeRedirectResponse(
  request: CloudflareRequest,
): Response | null {
  const requestUrl = new URL(request.url);

  if (requestUrl.protocol === 'http:') {
    requestUrl.protocol = 'https:';
    return Response.redirect(requestUrl, 308);
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  if (requestUrl.pathname !== '/') return null;
  if (request.cf?.country !== 'JP') return null;
  if (readLocalePreference(request.headers.get('cookie'))) return null;

  requestUrl.pathname = '/ja/';

  return new Response(null, {
    status: 307,
    headers: {
      location: requestUrl.href,
      'set-cookie': serializeLocalePreference('ja'),
    },
  });
}

export async function handleLocaleRedirectRequest(
  request: CloudflareRequest,
  originFetch: OriginFetch = fetch,
): Promise<Response> {
  return localeRedirectResponse(request) ?? originFetch(request);
}

export default {
  fetch(request: CloudflareRequest): Promise<Response> {
    return handleLocaleRedirectRequest(request);
  },
};
