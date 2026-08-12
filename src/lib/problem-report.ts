import { HELPDESK_INTAKE_URL } from '../config/helpdesk';

export const PROBLEM_REPORT_CATEGORIES = [
  'billing',
  'crash',
  'library',
  'viewer',
  'feature_request',
  'other',
] as const;

export const MAX_PROBLEM_REPORT_LENGTH = 8_000;
export const PRIVACY_NOTICE_VERSION = '2026-07-26';

export type ProblemReportCategory = (typeof PROBLEM_REPORT_CATEGORIES)[number];

export type ProblemReportInput = {
  category: string;
  message: string;
};

export type ProblemReportValidationErrors = Partial<
  Record<'category', 'required' | 'invalid'> &
    Record<'message', 'required' | 'too_long'>
>;

export type ProblemReportPayload = {
  application_id: 'owlaria';
  client_request_id: string;
  category: ProblemReportCategory;
  message: string;
  consent: {
    privacy_notice_version: typeof PRIVACY_NOTICE_VERSION;
    diagnostics_approved: false;
    confirmed_at: string;
  };
};

export type ProblemReportAttempt = Readonly<{
  payload: Readonly<ProblemReportPayload>;
}>;

export type ProblemReportErrorKind =
  | 'validation'
  | 'suspended'
  | 'payload_too_large'
  | 'rate_limited'
  | 'server'
  | 'timeout'
  | 'offline';

export type ProblemReportResult =
  | {
      ok: true;
      referenceNumber: string;
      receivedAt: string;
    }
  | {
      ok: false;
      kind: ProblemReportErrorKind;
      retryAfterMs?: number;
    };

type AttemptDependencies = {
  createRequestId?: () => string;
  now?: () => Date;
};

type SubmitOptions = {
  fetchImpl?: typeof fetch;
  intakeUrl?: string;
  timeoutMs?: number;
  now?: () => Date;
};

export function validateProblemReport(
  input: ProblemReportInput,
): ProblemReportValidationErrors {
  const errors: ProblemReportValidationErrors = {};

  if (input.category.length === 0) {
    errors.category = 'required';
  } else if (!PROBLEM_REPORT_CATEGORIES.includes(input.category as never)) {
    errors.category = 'invalid';
  }

  if (input.message.trim().length === 0) {
    errors.message = 'required';
  } else if (input.message.length > MAX_PROBLEM_REPORT_LENGTH) {
    errors.message = 'too_long';
  }

  return errors;
}

export function createProblemReportAttempt(
  input: ProblemReportInput,
  dependencies: AttemptDependencies = {},
): ProblemReportAttempt {
  const errors = validateProblemReport(input);
  if (Object.keys(errors).length > 0) {
    throw new TypeError('Cannot create an attempt from invalid input');
  }

  const createRequestId =
    dependencies.createRequestId ?? (() => crypto.randomUUID());
  const now = dependencies.now ?? (() => new Date());

  return {
    payload: {
      application_id: 'owlaria',
      client_request_id: createRequestId(),
      category: input.category as ProblemReportCategory,
      message: input.message,
      consent: {
        privacy_notice_version: PRIVACY_NOTICE_VERSION,
        diagnostics_approved: false,
        confirmed_at: now().toISOString(),
      },
    },
  };
}

export function parseRetryAfter(value: string | null, now = new Date()) {
  if (value === null) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1_000;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;

  return Math.max(0, timestamp - now.getTime());
}

function errorKindForStatus(status: number): ProblemReportErrorKind {
  if (status === 400) return 'validation';
  if (status === 403 || status === 404) return 'suspended';
  if (status === 413) return 'payload_too_large';
  if (status === 429) return 'rate_limited';
  return 'server';
}

export async function submitProblemReport(
  attempt: ProblemReportAttempt,
  options: SubmitOptions = {},
): Promise<ProblemReportResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 12_000;
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(options.intakeUrl ?? HELPDESK_INTAKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt.payload),
      signal: controller.signal,
    });

    if (response.status !== 200 && response.status !== 201) {
      const kind = errorKindForStatus(response.status);
      if (kind === 'rate_limited') {
        const retryAfterMs = parseRetryAfter(
          response.headers.get('Retry-After'),
          options.now?.() ?? new Date(),
        );
        return {
          ok: false,
          kind,
          ...(retryAfterMs === null ? {} : { retryAfterMs }),
        };
      }
      return { ok: false, kind };
    }

    const body: unknown = await response.json().catch(() => null);
    if (
      !body ||
      typeof body !== 'object' ||
      !('reference_number' in body) ||
      typeof body.reference_number !== 'string' ||
      !('received_at' in body) ||
      typeof body.received_at !== 'string'
    ) {
      return { ok: false, kind: 'server' };
    }

    return {
      ok: true,
      referenceNumber: body.reference_number,
      receivedAt: body.received_at,
    };
  } catch {
    return { ok: false, kind: timedOut ? 'timeout' : 'offline' };
  } finally {
    clearTimeout(timeout);
  }
}
