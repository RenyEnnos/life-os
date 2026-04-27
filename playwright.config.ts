import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173/',
    trace: 'on-first-retry',
    headless: true
  },
  webServer: {
    // Advisory browser coverage still exercises the web client only.
    command: 'npm run client:dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: 'advisory-chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/smoke.spec.ts'],
    },
    {
      name: 'advisory-firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/smoke.spec.ts'],
    },
    {
      name: 'advisory-webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/smoke.spec.ts'],
    },
  ],
})
