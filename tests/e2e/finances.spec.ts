import { test, expect, _electron as electron } from '@playwright/test'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const DB_PATH = path.resolve(process.cwd(), 'lifeos.db')
const LOCAL_LOGIN_EMAIL = 'qa-local@example.com'
const LOCAL_LOGIN_PASSWORD = 'Password123!'

function runSql(sql: string, params: Array<string | number> = []) {
  const payload = JSON.stringify({ sql, params })
  execFileSync(
    'python3',
    [
      '-c',
      `import json, sqlite3, sys
payload = json.loads(sys.argv[1])
conn = sqlite3.connect(sys.argv[2])
cur = conn.cursor()
cur.execute(payload['sql'], payload['params'])
conn.commit()
conn.close()
`,
      payload,
      DB_PATH,
    ],
    { stdio: 'inherit' },
  )
}

function clearAuthSession() {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)
  runSql('DELETE FROM auth_session')
}

function buildFileUrl(hashPath: string) {
  return 'file://' + path.resolve(process.cwd(), 'dist/index.html') + `#${hashPath}`
}

async function clearBrowserState(page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>) {
  await page.evaluate(async () => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem('life-os-onboarding-completed', 'true')

    if (typeof indexedDB.databases !== 'function') return
    const databases = await indexedDB.databases()
    await Promise.all(
      databases
        .map((d) => d.name)
        .filter((n): n is string => typeof n === 'string' && n.length > 0)
        .map(
          (name) =>
            new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase(name)
              req.onsuccess = () => resolve()
              req.onerror = () => resolve()
              req.onblocked = () => resolve()
            }),
        ),
    )
  })
}

async function launchDesktop() {
  const electronApp = await electron.launch({
    args: ['.'],
    env: { ...process.env, PLAYWRIGHT_TEST: '1' },
  })
  const page = await electronApp.firstWindow()
  await page.waitForLoadState('domcontentloaded')
  return { electronApp, page }
}

async function loginThroughUi(page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>) {
  await page.goto(buildFileUrl('/login'))
  await page.waitForURL(/#\/login$/)
  await expect(page.getByTestId('login-page-container')).toBeVisible()

  await page.evaluate(
    ({ email, password }) => {
      const emailInput = document.querySelector('[data-testid="login-email-input"]') as HTMLInputElement | null
      const passwordInput = document.querySelector('[data-testid="login-password-input"]') as HTMLInputElement | null
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
      if (!emailInput || !passwordInput || !setter) throw new Error('Login inputs not found')

      setter.call(emailInput, email)
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
      emailInput.dispatchEvent(new Event('change', { bubbles: true }))

      setter.call(passwordInput, password)
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
    },
    { email: LOCAL_LOGIN_EMAIL, password: LOCAL_LOGIN_PASSWORD },
  )

  await page.getByTestId('login-submit-button').click()
  await page.waitForURL(/#\/mvp$/)
}

test.describe('Finances', () => {
  test('finances route redirects when hidden MVP route', async () => {
    clearAuthSession()
    const { electronApp, page } = await launchDesktop()

    try {
      await clearBrowserState(page)
      await loginThroughUi(page)
      await expect(page.getByText(/WELCOME BACK|LifeOS MVP/i)).toBeVisible({ timeout: 15000 })

      await page.goto(buildFileUrl('/finances'))
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(2000)

      const url = page.url()
      expect(url).not.toContain('#/finances')
    } finally {
      await electronApp.close()
      clearAuthSession()
    }
  })

  test('app remains stable after navigating to hidden finances route', async () => {
    clearAuthSession()
    const { electronApp, page } = await launchDesktop()

    try {
      await clearBrowserState(page)
      await loginThroughUi(page)
      await expect(page.getByText(/WELCOME BACK|LifeOS MVP/i)).toBeVisible({ timeout: 15000 })

      await page.goto(buildFileUrl('/finances'))
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(2000)

      await expect(page.locator('body')).toBeVisible()
      await expect(page.getByText(/WELCOME BACK|LifeOS MVP/i)).toBeVisible()
    } finally {
      await electronApp.close()
      clearAuthSession()
    }
  })
})
