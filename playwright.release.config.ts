import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  testMatch: '**/canonical.spec.ts',
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://app.lifeos.test:3001',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      'rm -rf test-results/canonical && mkdir -p test-results/canonical && npm run build && npm run build:server && node dist-server/api/server.js',
    url: 'http://127.0.0.1:3001/api/health',
    reuseExistingServer: false,
    timeout: 240_000,
    env: {
      LIFEOS_SESSION_SECRET: 'canonical-e2e-synthetic-secret',
      LIFEOS_MVP_REPOSITORY: 'file',
      LIFEOS_AUTH_DATA_FILE: 'test-results/canonical/auth-state.json',
      MVP_DATA_FILE: 'test-results/canonical/mvp-workspace.json',
      ALLOWED_ORIGIN: 'http://app.lifeos.test:3001',
      LIFEOS_INVITES: JSON.stringify([
        { email: 'canonical-a@example.test', code: 'INVITE-A' },
        { email: 'canonical-b@example.test', code: 'INVITE-B' },
      ]),
    },
  },
  projects: [
    {
      name: 'canonical-chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
            ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
            : {}),
          args: [
            '--host-resolver-rules=MAP app.lifeos.test 127.0.0.1',
            '--no-proxy-server',
          ],
        },
      },
    },
  ],
})
