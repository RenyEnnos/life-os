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
    // Start the browser web client, not Electron
    command: 'npm run client:dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: ['**/smoke.spec.ts'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: ['**/smoke.spec.ts'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: ['**/smoke.spec.ts'] },
    { name: 'smoke', testMatch: '**/smoke.spec.ts', use: { browserName: 'chromium' } },
  ],
})
