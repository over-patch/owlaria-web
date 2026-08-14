import { expect, test, type Page } from '@playwright/test';

const locales = [
  {
    path: '/support/',
    lang: 'en',
    title: 'Send a problem report',
    category: 'Category',
    message: 'Problem description',
    submit: 'Send problem report',
    privacy: 'Privacy Policy',
    privacyPath: '/privacy/',
    appRoute: 'Settings > Information > Report a problem',
    noScript: 'JavaScript is required to send this Web form',
  },
  {
    path: '/ja/support/',
    lang: 'ja',
    title: '問題を報告する',
    category: 'カテゴリー',
    message: '問題の説明',
    submit: '問題報告を送信',
    privacy: 'プライバシーポリシー',
    privacyPath: '/ja/privacy/',
    appRoute: 'Settings > Information > Report a problem',
    noScript: 'このWebフォームの送信にはJavaScriptが必要です',
  },
] as const;

const categoryValues = [
  '',
  'billing',
  'crash',
  'library',
  'viewer',
  'feature_request',
  'other',
];

async function fillValidReport(page: Page) {
  await page.getByLabel('Category').selectOption('viewer');
  await page.getByLabel('Problem description').fill('Pages do not advance.');
}

for (const locale of locales) {
  test(`${locale.path} renders an accessible localized Web form`, async ({
    page,
  }) => {
    await page.goto(locale.path);

    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(
      page.getByRole('heading', { level: 2, name: locale.title }),
    ).toBeVisible();
    const category = page.getByLabel(locale.category);
    await expect(category).toHaveAccessibleName(locale.category);
    await expect(category.locator('option')).toHaveCount(categoryValues.length);
    expect(
      await category
        .locator('option')
        .evaluateAll((options) =>
          options.map((option) => (option as HTMLOptionElement).value),
        ),
    ).toEqual(categoryValues);
    const message = page.getByLabel(locale.message);
    await expect(message).toHaveAttribute('maxlength', '8000');
    await expect(
      page.getByRole('link', { name: locale.privacy }),
    ).toHaveAttribute('href', locale.privacyPath);
    await expect(
      page
        .locator('.problem-report-boundaries')
        .getByText(locale.appRoute, { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: locale.submit }),
    ).toBeEnabled();

    const form = page.locator('[data-problem-report-form]');
    await expect(form.locator('input')).toHaveCount(0);
    await expect(form.locator('[name="subject"]')).toHaveCount(0);
    await expect(form.locator('[name^="contact"]')).toHaveCount(0);
    await expect(form.locator('[name^="diagnostics"]')).toHaveCount(0);
    await expect(form.locator('[name="support_identity"]')).toHaveCount(0);
  });
}

test('validates required fields and the 8,000-character boundary with focus', async ({
  page,
}) => {
  await page.goto('/support/');
  const category = page.getByLabel('Category');
  const message = page.getByLabel('Problem description');

  await page.getByRole('button', { name: 'Send problem report' }).click();
  await expect(category).toBeFocused();
  await expect(category).toHaveAttribute('aria-invalid', 'true');
  await expect(message).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Choose a category.')).toBeVisible();
  await expect(page.getByText('Enter a problem description.')).toBeVisible();

  await category.selectOption('other');
  await message.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    textarea.value = 'a'.repeat(8_001);
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Send problem report' }).click();
  await expect(message).toBeFocused();
  await expect(
    page.getByText('Keep the description to 8,000 characters or fewer.'),
  ).toBeVisible();

  await message.fill('a'.repeat(8_000));
  await expect(page.locator('[data-character-count]')).toContainText(
    '8,000 / 8,000',
  );
});

test('sends only approved fields, retries with the same ID, and copies a 200 receipt', async ({
  context,
  page,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests: Record<string, unknown>[] = [];
  await page.route('**/v1/inquiries', async (route) => {
    requests.push(route.request().postDataJSON());
    if (requests.length === 1) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error_code: 'INTERNAL',
          message: 'raw API detail must stay hidden',
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reference_number: 'OWL-2026-7QK4-2M9',
        received_at: '2026-08-13T00:00:00Z',
      }),
    });
  });

  await page.goto('/support/');
  await fillValidReport(page);
  const submit = page.getByRole('button', { name: 'Send problem report' });
  await submit.dblclick();
  await expect(
    page.getByText(
      'The report could not be sent because the service is unavailable.',
    ),
  ).toBeVisible();
  await expect(page.getByText('raw API detail must stay hidden')).toHaveCount(
    0,
  );
  expect(requests).toHaveLength(1);

  await submit.click();
  await expect(
    page.getByRole('heading', { name: 'Problem report received' }),
  ).toBeFocused();
  await expect(page.locator('[data-reference-number]')).toHaveText(
    'OWL-2026-7QK4-2M9',
  );
  expect(requests).toHaveLength(2);
  expect(requests[0]).toEqual(requests[1]);
  expect(requests[1]).toMatchObject({
    application_id: 'owlaria',
    category: 'viewer',
    message: 'Pages do not advance.',
    consent: {
      privacy_notice_version: '2026-08-15',
      diagnostics_approved: false,
    },
    client: {
      consumer_type: 'web',
      platform: 'web',
    },
  });
  expect(Object.keys(requests[1])).toEqual([
    'application_id',
    'client_request_id',
    'category',
    'message',
    'consent',
    'client',
  ]);

  await page.getByRole('button', { name: 'Copy reference number' }).click();
  await expect(page.getByText('Reference number copied.')).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('OWL-2026-7QK4-2M9');
  await expect(page.locator('[data-problem-report-form]')).toBeHidden();
  await expect(page.getByLabel('Problem description')).toHaveValue('');
});

for (const scenario of [
  {
    status: 400,
    expected: 'The report could not be validated.',
  },
  {
    status: 403,
    expected: 'Problem reporting is temporarily unavailable.',
  },
  { status: 413, expected: 'The report is too large to send.' },
  {
    status: 500,
    expected:
      'The report could not be sent because the service is unavailable.',
  },
] as const) {
  test(`maps HTTP ${scenario.status} to safe localized UI`, async ({
    page,
  }) => {
    await page.route('**/v1/inquiries', async (route) => {
      await route.fulfill({
        status: scenario.status,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'raw API message' }),
      });
    });
    await page.goto('/support/');
    await fillValidReport(page);
    await page.getByRole('button', { name: 'Send problem report' }).click();

    await expect(
      page.getByText(scenario.expected, { exact: false }),
    ).toBeFocused();
    await expect(page.getByText('raw API message')).toHaveCount(0);
  });
}

test('respects Retry-After before allowing a rate-limited retry', async ({
  page,
}) => {
  await page.route('**/v1/inquiries', async (route) => {
    await route.fulfill({
      status: 429,
      headers: {
        'Retry-After': '6',
        'Access-Control-Allow-Origin': 'http://127.0.0.1:4322',
        'Access-Control-Expose-Headers': 'Retry-After',
      },
      contentType: 'application/json',
      body: '{}',
    });
  });
  await page.goto('/support/');
  await fillValidReport(page);
  const submit = page.getByRole('button', { name: 'Send problem report' });
  await submit.click();

  await expect(
    page.getByText('Too many reports were sent recently.'),
  ).toBeFocused();
  await expect(submit).toBeDisabled();
  await expect(submit).toBeEnabled({ timeout: 7_000 });
});

test('maps an offline fetch failure without losing the report', async ({
  page,
}) => {
  await page.route('**/v1/inquiries', (route) =>
    route.abort('internetdisconnected'),
  );
  await page.goto('/support/');
  await fillValidReport(page);
  await page.getByRole('button', { name: 'Send problem report' }).click();

  await expect(page.getByText('You appear to be offline.')).toBeFocused();
  await expect(page.getByLabel('Problem description')).toHaveValue(
    'Pages do not advance.',
  );
});

test('maps a timeout, retains the report, and retries with the same request ID', async ({
  page,
}) => {
  const requests: Record<string, unknown>[] = [];
  await page.route('**/v1/inquiries', async (route) => {
    requests.push(route.request().postDataJSON());
    if (requests.length === 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.fulfill({ status: 504, body: '{}' });
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        reference_number: 'OWL-2026-TIME-OUT1',
        received_at: '2026-08-13T00:00:00Z',
      }),
    });
  });
  await page.goto('/support/');
  await page
    .locator('[data-problem-report-form]')
    .evaluate((form) => form.setAttribute('data-timeout-ms', '50'));
  await fillValidReport(page);
  const submit = page.getByRole('button', { name: 'Send problem report' });
  await submit.click();

  await expect(page.getByText('The request timed out.')).toBeFocused();
  await expect(page.getByLabel('Problem description')).toHaveValue(
    'Pages do not advance.',
  );
  await submit.click();
  await expect(
    page.getByRole('heading', { name: 'Problem report received' }),
  ).toBeFocused();
  expect(requests).toHaveLength(2);
  expect(requests[0]).toEqual(requests[1]);
});

test('does not submit when Enter is pressed during IME composition', async ({
  page,
}) => {
  let requestCount = 0;
  await page.route('**/v1/inquiries', async (route) => {
    requestCount += 1;
    await route.abort();
  });
  await page.goto('/support/');
  await fillValidReport(page);
  const message = page.getByLabel('Problem description');
  await message.dispatchEvent('compositionstart');
  await message.press('Enter');
  await message.dispatchEvent('compositionend');

  expect(requestCount).toBe(0);
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`fits the form at ${viewport.width}px without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/support/');
    await expect(page.locator('[data-problem-report-form]')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
    await expect(page.getByLabel('Problem description')).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of locales) {
    test(`${locale.path} explains that Web submission is unavailable`, async ({
      page,
    }) => {
      await page.goto(locale.path);
      await expect(page.locator('.problem-report-noscript')).toContainText(
        locale.noScript,
      );
      await expect(
        page.getByRole('button', { name: locale.submit }),
      ).toBeDisabled();
      await expect(
        page
          .locator('.problem-report-boundaries')
          .getByText(locale.appRoute, { exact: false }),
      ).toBeVisible();
    });
  }
});
