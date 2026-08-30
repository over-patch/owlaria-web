import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
      ]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /webkit-smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit-desktop',
      testMatch: /webkit-smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'webkit-iphone',
      testMatch: /webkit-smoke\.spec\.ts/,
      use: { ...devices['iPhone 16'] },
    },
  ],
  webServer: {
    command:
      'pnpm build && env OWLARIA_RELEASE_NOTES_FIXTURES=1 pnpm build && env OWLARIA_RELEASE_NOTES_FIXTURES=1 pnpm preview --host 127.0.0.1 --port 4322',
    port: 4322,
    reuseExistingServer: false,
  },
});
