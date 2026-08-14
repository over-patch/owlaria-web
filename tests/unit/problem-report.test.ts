import { describe, expect, it, vi } from 'vitest';

import {
  MAX_PROBLEM_REPORT_LENGTH,
  PROBLEM_REPORT_CATEGORIES,
  createProblemReportAttempt,
  parseRetryAfter,
  submitProblemReport,
  validateProblemReport,
} from '../../src/lib/problem-report';

const requestId = '67aac729-5957-486a-8f99-f9783c206a92';
const confirmedAt = '2026-08-13T00:00:00.000Z';

function createAttempt() {
  return createProblemReportAttempt(
    { category: 'viewer', message: 'Pages do not advance.' },
    {
      createRequestId: () => requestId,
      now: () => new Date(confirmedAt),
    },
  );
}

describe('problem-report validation', () => {
  it('publishes the six stable Owlaria categories', () => {
    expect(PROBLEM_REPORT_CATEGORIES).toEqual([
      'billing',
      'crash',
      'library',
      'viewer',
      'feature_request',
      'other',
    ]);
  });

  it('requires a stable category and a non-blank message', () => {
    expect(validateProblemReport({ category: '', message: '   ' })).toEqual({
      category: 'required',
      message: 'required',
    });
    expect(
      validateProblemReport({ category: 'not-a-category', message: 'Help' }),
    ).toEqual({ category: 'invalid' });
  });

  it('accepts exactly 8,000 characters and rejects 8,001', () => {
    expect(
      validateProblemReport({
        category: 'other',
        message: 'a'.repeat(MAX_PROBLEM_REPORT_LENGTH),
      }),
    ).toEqual({});
    expect(
      validateProblemReport({
        category: 'other',
        message: 'a'.repeat(MAX_PROBLEM_REPORT_LENGTH + 1),
      }),
    ).toEqual({ message: 'too_long' });
  });
});

describe('problem-report payload', () => {
  it('contains only the approved Web fields and preserves the message', () => {
    const attempt = createAttempt();

    expect(attempt.payload).toEqual({
      application_id: 'owlaria',
      client_request_id: requestId,
      category: 'viewer',
      message: 'Pages do not advance.',
      consent: {
        privacy_notice_version: '2026-08-15',
        diagnostics_approved: false,
        confirmed_at: confirmedAt,
      },
      client: {
        consumer_type: 'web',
        platform: 'web',
      },
    });
    expect(Object.keys(attempt.payload)).toEqual([
      'application_id',
      'client_request_id',
      'category',
      'message',
      'consent',
      'client',
    ]);
    for (const forbidden of [
      'support_identity',
      'diagnostics',
      'subject',
      'contact',
    ]) {
      expect(attempt.payload).not.toHaveProperty(forbidden);
    }
    expect(Object.keys(attempt.payload.client)).toEqual([
      'consumer_type',
      'platform',
    ]);
    expect(attempt.payload.client).not.toHaveProperty('locale');
    expect(attempt.payload.client).not.toHaveProperty('os_version');
    expect(attempt.payload.client).not.toHaveProperty('app_version');
    expect(attempt.payload.client).not.toHaveProperty('is_paid');
  });

  it('keeps one request ID when the same logical attempt is retried', async () => {
    const attempt = createAttempt();
    const bodies: unknown[] = [];
    const fetchImpl = vi.fn(async (_input, init) => {
      bodies.push(JSON.parse(String(init?.body)));
      return new Response(
        JSON.stringify({
          reference_number: 'OWL-2026-ABCD-123',
          received_at: confirmedAt,
        }),
        { status: bodies.length === 1 ? 500 : 200 },
      );
    });

    await submitProblemReport(attempt, { fetchImpl });
    await submitProblemReport(attempt, { fetchImpl });

    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toMatchObject({ client_request_id: requestId });
    expect(bodies[1]).toMatchObject({ client_request_id: requestId });
  });
});

describe('problem-report transport', () => {
  it.each([201, 200])(
    'accepts HTTP %i and returns the receipt',
    async (status) => {
      const fetchImpl = vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              reference_number: 'OWL-2026-7QK4-2M9',
              received_at: confirmedAt,
            }),
            { status, headers: { 'Content-Type': 'application/json' } },
          ),
      );

      await expect(
        submitProblemReport(createAttempt(), { fetchImpl }),
      ).resolves.toEqual({
        ok: true,
        referenceNumber: 'OWL-2026-7QK4-2M9',
        receivedAt: confirmedAt,
      });
      expect(fetchImpl).toHaveBeenCalledWith(
        expect.stringMatching(/\/v1\/inquiries$/),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    },
  );

  it.each([
    [400, 'validation'],
    [403, 'suspended'],
    [413, 'payload_too_large'],
    [500, 'server'],
    [503, 'server'],
  ] as const)(
    'maps HTTP %i to %s without exposing raw API text',
    async (status, kind) => {
      const fetchImpl = vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              error_code: 'INTERNAL',
              message: 'sensitive raw server detail',
            }),
            { status },
          ),
      );

      const result = await submitProblemReport(createAttempt(), { fetchImpl });

      expect(result).toEqual({ ok: false, kind });
      expect(JSON.stringify(result)).not.toContain(
        'sensitive raw server detail',
      );
    },
  );

  it('maps malformed success JSON to a server error', async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ received_at: confirmedAt }), {
          status: 201,
        }),
    );

    await expect(
      submitProblemReport(createAttempt(), { fetchImpl }),
    ).resolves.toEqual({ ok: false, kind: 'server' });
  });

  it('honors Retry-After for rate limits', async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response('{}', {
          status: 429,
          headers: { 'Retry-After': '12' },
        }),
    );

    await expect(
      submitProblemReport(createAttempt(), { fetchImpl }),
    ).resolves.toEqual({
      ok: false,
      kind: 'rate_limited',
      retryAfterMs: 12_000,
    });
  });

  it('distinguishes timeout from an offline/network failure', async () => {
    const timeoutFetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );
    const offlineFetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });

    await expect(
      submitProblemReport(createAttempt(), {
        fetchImpl: timeoutFetch,
        timeoutMs: 1,
      }),
    ).resolves.toEqual({ ok: false, kind: 'timeout' });
    await expect(
      submitProblemReport(createAttempt(), { fetchImpl: offlineFetch }),
    ).resolves.toEqual({ ok: false, kind: 'offline' });
  });
});

describe('Retry-After parsing', () => {
  it('parses seconds and HTTP dates and clamps elapsed dates to zero', () => {
    const now = new Date('2026-08-13T00:00:00.000Z');

    expect(parseRetryAfter('3', now)).toBe(3_000);
    expect(parseRetryAfter('Thu, 13 Aug 2026 00:00:05 GMT', now)).toBe(5_000);
    expect(parseRetryAfter('Wed, 12 Aug 2026 23:59:00 GMT', now)).toBe(0);
    expect(parseRetryAfter('invalid', now)).toBeNull();
    expect(parseRetryAfter(null, now)).toBeNull();
  });
});
