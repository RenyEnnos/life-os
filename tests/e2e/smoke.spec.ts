import { test, expect, _electron as electron } from '@playwright/test'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const DB_PATH = path.resolve(process.cwd(), 'lifeos.db')
const SEEDED_USER_ID = 'smoke-user'
const SEEDED_SESSION_ID = 'smoke-session'
const DESKTOP_SMOKE_EMAIL = 'desktop-smoke@example.com'
const DESKTOP_SMOKE_PASSWORD = 'DesktopSmoke123!'
const DESKTOP_SMOKE_USER_ID = 'desktop-smoke-user'

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

function queryScalar(sql: string, params: Array<string | number> = []) {
  const payload = JSON.stringify({ sql, params })
  return execFileSync(
    'python3',
    [
      '-c',
      `import json, sqlite3, sys
p=json.loads(sys.argv[1])
conn=sqlite3.connect(sys.argv[2])
cur=conn.cursor()
cur.execute(p['sql'], p['params'])
row=cur.fetchone()
conn.close()
print(row[0] if row else '')
`,
      payload,
      DB_PATH,
    ],
    { encoding: 'utf8' },
  ).trim()
}

test('desktop smoke: Life OS main window', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    env: { ...process.env, PLAYWRIGHT_TEST: '1' },
  })
  const page = await electronApp.firstWindow()
  await page.waitForLoadState('domcontentloaded')
  await expect(page).toHaveTitle(/Life\s?OS/i)
  await electronApp.close()
})

test('desktop smoke: authenticated state via auth check', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })

    const authState = await page.evaluate(async () => {
      const desktopWindow = window as unknown as Window & {
        api: { auth: { check: () => Promise<unknown> } }
      }
      return desktopWindow.api.auth.check()
    }) as {
      session: { user?: { id?: string } } | null
      profile: { id?: string } | null
    }

    await expect.soft(page).toHaveTitle(/Life\s?OS/i)
    expect(authState.session).toBeTruthy()
    expect(authState.session?.user?.id).toBe(SEEDED_USER_ID)
    expect(authState.profile?.id).toBe(SEEDED_USER_ID)
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/')
    await expect(page.getByText(/WELCOME BACK/i)).toBeVisible()
    await expect(page.getByTestId('login-page-container')).toHaveCount(0)
  } finally {
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: authenticated user can navigate to tasks', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/')

    await expect(page.getByText(/WELCOME BACK/i)).toBeVisible()

    await page.locator('a[aria-label="Tarefas"]:visible').first().click()

    await expect(page).toHaveURL(/#\/tasks$/)
    await expect(page.getByTestId('login-page-container')).toHaveCount(0)
  } finally {
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: login UI authenticates user', async () => {
  runSql('DELETE FROM auth_session WHERE user_id = ?', [DESKTOP_SMOKE_USER_ID])

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/login')

    await page.getByTestId('login-email-input').fill(DESKTOP_SMOKE_EMAIL)
    await page.getByTestId('login-password-input').fill(DESKTOP_SMOKE_PASSWORD)
    await page.getByTestId('login-submit-button').click()

    await expect
      .poll(
        async () => {
          const authState = await page.evaluate(async () => {
            const desktopWindow = window as unknown as Window & {
              api: { auth: { check: () => Promise<unknown> } }
            }
            return desktopWindow.api.auth.check()
          }) as {
            session: { user?: { id?: string } } | null
            profile: { id?: string } | null
          }
          return authState.session?.user?.id ?? null
        },
        { timeout: 15000 },
      )
      .toBe(DESKTOP_SMOKE_USER_ID)

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/')
    await page.waitForURL(/#\/$/)
    await expect(page.getByText(/WELCOME BACK/i)).toBeVisible({ timeout: 15000 })

    const authState = await page.evaluate(async () => {
      const desktopWindow = window as unknown as Window & {
        api: { auth: { check: () => Promise<unknown> } }
      }
      return desktopWindow.api.auth.check()
    }) as {
      session: { user?: { id?: string } } | null
      profile: { id?: string } | null
    }

    expect(authState.session?.user?.id).toBe(DESKTOP_SMOKE_USER_ID)
    expect(authState.profile?.id).toBe(DESKTOP_SMOKE_USER_ID)
  } finally {
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [DESKTOP_SMOKE_USER_ID])
  }
})

test('desktop smoke: post-login quick add health metric', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  const metricValue = '250'

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/')

    await expect(page.getByText(/WELCOME BACK/i)).toBeVisible()
    await expect(page.getByText(/Último Água/i)).toBeVisible()

    const input = page.locator('input[placeholder="+ ml"]').first()
    await input.click()
    await input.fill(metricValue)

    const addButton = input.locator('xpath=following-sibling::button[1]')
    await expect(addButton).toBeVisible()
    await addButton.click()

    await expect
      .poll(() =>
        Number(
          queryScalar(
            'SELECT value FROM health_metrics WHERE user_id = ? AND metric_type = ? ORDER BY created_at DESC LIMIT 1',
            [SEEDED_USER_ID, 'water'],
          ),
        ),
      )
      .toBe(Number(metricValue))
  } finally {
    runSql('DELETE FROM health_metrics WHERE user_id = ? AND metric_type = ? AND value = ?', [SEEDED_USER_ID, 'water', Number(metricValue)])
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: post-login create task from tasks page', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  const taskTitle = 'Desktop Smoke Task ' + Date.now()

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/tasks')

    await expect(page).toHaveURL(/#\/tasks$/)

    const input = page.locator('input[aria-label="Create new task"]').first()
    await expect(input).toBeVisible()
    await input.fill(taskTitle)

    await input.press('Enter')

    await expect(page.getByText(taskTitle, { exact: true })).toBeVisible()
    await expect(page.getByText('Tarefa criada.')).toBeVisible()
  } finally {
    runSql('DELETE FROM tasks WHERE user_id = ? AND title = ?', [SEEDED_USER_ID, taskTitle])
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: post-login create habit from habits page', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  const habitTitle = 'Desktop Smoke Habit ' + Date.now()

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/habits')

    await expect(page).toHaveURL(/#\/habits$/)

    await page.getByRole('button', { name: 'New Habit' }).click()
    await page.getByPlaceholder('Ex: Ler 10 páginas').fill(habitTitle)
    await page.getByRole('button', { name: 'CRIAR' }).click()

    await expect(page.getByText(habitTitle, { exact: true })).toBeVisible()
    await expect
      .poll(() =>
        queryScalar(
          'SELECT title FROM habits WHERE user_id = ? AND title = ? ORDER BY created_at DESC LIMIT 1',
          [SEEDED_USER_ID, habitTitle],
        ),
      )
      .toBe(habitTitle)
  } finally {
    runSql('DELETE FROM habits WHERE user_id = ? AND title = ?', [SEEDED_USER_ID, habitTitle])
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: navigation and organization routes render key interactions', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/calendar')
    await expect(page).toHaveURL(/#\/calendar$/)
    await expect(page.getByText('Schedule')).toBeVisible()
    await page.getByText('Month').click()
    await expect(page.getByText('Up Next')).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/journal')
    await expect(page).toHaveURL(/#\/journal$/)
    await expect(page.getByText('Sua Jornada.')).toBeVisible()
    await page.getByRole('button', { name: /NOVA ENTRADA/i }).click()
    await expect(page.locator('textarea').or(page.locator('input[placeholder*="título" i]')).first()).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/projects')
    await expect(page).toHaveURL(/#\/projects$/)
    await expect(page.getByText('Projects').first()).toBeVisible()
    await page.getByRole('button', { name: /List View/i }).click()
    await expect(page.getByText('Archived')).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/university')
    await expect(page).toHaveURL(/#\/university$/)
    await expect(page.getByText('University Dashboard')).toBeVisible()
    await page.getByPlaceholder('Search courses...').fill('math')
    await expect(page.getByPlaceholder('Search courses...')).toHaveValue('math')
  } finally {
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})

test('desktop smoke: special routes render key interactions', async () => {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `)

  runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  runSql(
    `INSERT INTO auth_session (id, access_token, refresh_token, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      SEEDED_SESSION_ID,
      'smoke-access',
      'smoke-refresh',
      SEEDED_USER_ID,
      Math.floor(Date.now() / 1000) + 3600,
    ],
  )

  let electronApp: Awaited<ReturnType<typeof electron.launch>> | null = null

  try {
    electronApp = await electron.launch({
      args: ['.'],
      env: { ...process.env, PLAYWRIGHT_TEST: '1' },
    })

    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/ai-assistant')
    await expect(page).toHaveURL(/#\/ai-assistant$/)
    await expect(page.getByText('AI Assistant').first()).toBeVisible()
    await page.getByPlaceholder('Message LifeOS AI...').fill('hello')
    await expect(page.getByPlaceholder('Message LifeOS AI...')).toHaveValue('hello')

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/focus')
    await expect(page).toHaveURL(/#\/focus$/)
    await page.getByRole('button', { name: /Start/i }).click()
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/gamification')
    await expect(page).toHaveURL(/#\/gamification$/)
    await expect(page.getByRole('heading', { name: 'Quest Board' })).toBeVisible()
    await expect(page.getByRole('button', { name: /New Quest/i })).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/settings')
    await expect(page).toHaveURL(/#\/settings$/)
    await expect(page.getByText('User Hub').first()).toBeVisible()
    await page.getByRole('button', { name: 'Preferences' }).click()
    await expect(page.getByRole('button', { name: 'Preferences' })).toBeVisible()

    await page.goto('file://' + path.resolve(process.cwd(), 'dist/index.html') + '#/design')
    await expect(page).toHaveURL(/#\/design$/)
    await expect(page.getByText('Botões')).toBeVisible()
    await page.getByPlaceholder('Digite seu nome').fill('Teste')
    await expect(page.getByPlaceholder('Digite seu nome')).toHaveValue('Teste')
  } finally {
    if (electronApp) {
      await electronApp.close()
    }
    runSql('DELETE FROM auth_session WHERE user_id = ?', [SEEDED_USER_ID])
  }
})
