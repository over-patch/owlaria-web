import {
  MAX_PROBLEM_REPORT_LENGTH,
  createProblemReportAttempt,
  submitProblemReport,
  validateProblemReport,
  type ProblemReportAttempt,
  type ProblemReportErrorKind,
} from '../lib/problem-report';

const requireElement = <T extends Element>(
  root: ParentNode,
  selector: string,
) => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing problem-report element: ${selector}`);
  return element;
};

for (const form of document.querySelectorAll<HTMLFormElement>(
  '[data-problem-report-form]',
)) {
  const root = form.closest<HTMLElement>('[data-problem-report-root]');
  if (!root) continue;

  const category = requireElement<HTMLSelectElement>(form, '[data-category]');
  const message = requireElement<HTMLTextAreaElement>(form, '[data-message]');
  const categoryError = requireElement<HTMLElement>(
    form,
    '[data-category-error]',
  );
  const messageError = requireElement<HTMLElement>(
    form,
    '[data-message-error]',
  );
  const count = requireElement<HTMLElement>(form, '[data-character-count]');
  const status = requireElement<HTMLElement>(form, '[data-report-status]');
  const submit = requireElement<HTMLButtonElement>(form, '[data-submit]');
  const success = requireElement<HTMLElement>(root, '[data-report-success]');
  const successHeading = requireElement<HTMLElement>(
    success,
    '[data-success-heading]',
  );
  const reference = requireElement<HTMLElement>(
    success,
    '[data-reference-number]',
  );
  const copyButton = requireElement<HTMLButtonElement>(
    success,
    '[data-copy-reference]',
  );
  const copyStatus = requireElement<HTMLElement>(success, '[data-copy-status]');
  const sendAnother = requireElement<HTMLButtonElement>(
    success,
    '[data-send-another]',
  );
  const copiedMessage = requireElement<HTMLElement>(
    success,
    '[data-copied-message]',
  ).dataset.copiedMessage;
  const copyFailedMessage = requireElement<HTMLElement>(
    success,
    '[data-copy-failed-message]',
  ).dataset.copyFailedMessage;

  let attempt: ProblemReportAttempt | null = null;
  let composing = false;
  let sending = false;
  let retryTimer: number | undefined;

  const updateCount = () => {
    count.textContent = `${message.value.length.toLocaleString()} / ${MAX_PROBLEM_REPORT_LENGTH.toLocaleString()}`;
  };

  const hideFieldError = (field: HTMLElement, error: HTMLElement) => {
    field.removeAttribute('aria-invalid');
    error.hidden = true;
    error.textContent = '';
  };

  const resetErrors = () => {
    hideFieldError(category, categoryError);
    hideFieldError(message, messageError);
    status.hidden = true;
    status.textContent = '';
  };

  const showFieldError = (
    field: HTMLElement,
    error: HTMLElement,
    text: string | undefined,
  ) => {
    field.setAttribute('aria-invalid', 'true');
    error.textContent = text ?? '';
    error.hidden = false;
  };

  const setSending = (value: boolean) => {
    sending = value;
    category.disabled = value;
    message.disabled = value;
    submit.disabled = value;
    submit.setAttribute('aria-busy', String(value));
    submit.textContent = value
      ? (form.dataset.submittingLabel ?? submit.dataset.label ?? '')
      : (submit.dataset.label ?? '');
  };

  const errorMessage = (kind: ProblemReportErrorKind) =>
    root.getAttribute(`data-error-${kind.replaceAll('_', '-')}`) ?? '';

  const showStatus = (text: string) => {
    status.textContent = text;
    status.hidden = false;
    status.focus();
  };

  const invalidateAttempt = () => {
    if (!sending) attempt = null;
  };

  category.addEventListener('change', invalidateAttempt);
  message.addEventListener('input', () => {
    invalidateAttempt();
    updateCount();
  });
  message.addEventListener('compositionstart', () => {
    composing = true;
  });
  message.addEventListener('compositionend', () => {
    composing = false;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || composing) return;

    resetErrors();
    const errors = validateProblemReport({
      category: category.value,
      message: message.value,
    });

    if (errors.category) {
      showFieldError(
        category,
        categoryError,
        errors.category === 'invalid'
          ? categoryError.dataset.invalid
          : categoryError.dataset.required,
      );
    }
    if (errors.message) {
      showFieldError(
        message,
        messageError,
        errors.message === 'too_long'
          ? messageError.dataset.tooLong
          : messageError.dataset.required,
      );
    }
    if (Object.keys(errors).length > 0) {
      status.textContent = root.dataset.validationSummary ?? '';
      status.hidden = false;
      (errors.category ? category : message).focus();
      return;
    }

    attempt ??= createProblemReportAttempt({
      category: category.value,
      message: message.value,
    });
    setSending(true);
    const result = await submitProblemReport(attempt, {
      intakeUrl: form.dataset.intakeUrl,
      timeoutMs: Number(form.dataset.timeoutMs) || undefined,
    });
    setSending(false);

    if (!result.ok) {
      showStatus(errorMessage(result.kind));
      if (
        result.kind === 'rate_limited' &&
        result.retryAfterMs !== undefined &&
        result.retryAfterMs > 0
      ) {
        submit.disabled = true;
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(() => {
          submit.disabled = false;
        }, result.retryAfterMs);
      }
      return;
    }

    reference.textContent = result.referenceNumber;
    form.reset();
    message.value = '';
    updateCount();
    attempt = null;
    form.hidden = true;
    success.hidden = false;
    successHeading.focus();
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(reference.textContent ?? '');
      copyStatus.textContent = copiedMessage ?? '';
    } catch {
      copyStatus.textContent = copyFailedMessage ?? '';
    }
  });

  sendAnother.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    copyStatus.textContent = '';
    reference.textContent = '';
    resetErrors();
    submit.disabled = false;
    category.focus();
  });

  window.addEventListener('pagehide', () => {
    form.reset();
    message.value = '';
    attempt = null;
    updateCount();
  });

  updateCount();
  submit.disabled = false;
}
