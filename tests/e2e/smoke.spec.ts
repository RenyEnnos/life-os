import { test, expect, _electron as electron } from '@playwright/test'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const DB_PATH = path.resolve(process.cwd(), 'lifeos.db')
const LOCAL_LOGIN_EMAIL = 'qa-local@example.com'
const LOCAL_LOGIN_PASSWORD = 'Password123!'
const LOCAL_USER_ID = `local-${createHash('sha256')
  .update(LOCAL_LOGIN_EMAIL)
  .digest('hex')
  .slice(0, 24)}`

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

function makeMvpDataPath() {
  return path.join(os.tmpdir(), `lifeos-mvp-smoke-${Date.now()}-${Math.random().toString(36).slice(2)}.json`)
}

function readUserWorkspace(mvpDataPath: string) {
  if (!fs.existsSync(mvpDataPath)) {
    return null
  }

  const raw = JSON.parse(fs.readFileSync(mvpDataPath, 'utf8')) as {
    users?: Record<string, unknown>
  }

  return raw.users?.[LOCAL_USER_ID] as Record<string, unknown> | null
}

async function clearBrowserState(page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>) {
  await page.evaluate(async () => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem('life-os-onboarding-completed', 'true')

    if (typeof indexedDB.databases !== 'function') {
      return
    }

    const databases = await indexedDB.databases()
    await Promise.all(
      databases
        .map((database) => database.name)
        .filter((name): name is string => typeof name === 'string' && name.length > 0)
        .map(
          (name) =>
            new Promise<void>((resolve) => {
              const request = indexedDB.deleteDatabase(name)
              request.onsuccess = () => resolve()
              request.onerror = () => resolve()
              request.onblocked = () => resolve()
            }),
        ),
    )
  })
}

async function launchDesktop(mvpDataPath?: string) {
  const electronApp = await electron.launch({
    args: ['.'],
    env: {
      ...process.env,
      PLAYWRIGHT_TEST: '1',
      ...(mvpDataPath ? { LIFEOS_DESKTOP_MVP_DATA_FILE: mvpDataPath } : {}),
    },
  })

  const page = await electronApp.firstWindow()
  await page.waitForLoadState('domcontentloaded')

  return { electronApp, page }
}

async function loginThroughUi(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>,
) {
  await page.goto(buildFileUrl('/login'))
  await page.waitForURL(/#\/login$/)
  await expect(page.getByTestId('login-page-container')).toBeVisible()

  await page.evaluate(
    ({ email, password }) => {
      const emailInput = document.querySelector('[data-testid="login-email-input"]') as HTMLInputElement | null
      const passwordInput = document.querySelector('[data-testid="login-password-input"]') as HTMLInputElement | null
      const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set

      if (!emailInput || !passwordInput || !inputValueSetter) {
        throw new Error('Expected login form inputs to be available.')
      }

      inputValueSetter.call(emailInput, email)
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
      emailInput.dispatchEvent(new Event('change', { bubbles: true }))

      inputValueSetter.call(passwordInput, password)
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
    },
    { email: LOCAL_LOGIN_EMAIL, password: LOCAL_LOGIN_PASSWORD },
  )

  await page.getByTestId('login-submit-button').click()
  await page.waitForURL(/#\/mvp$/)
}

async function saveOnboardingViaBridge(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>,
) {
  return page.evaluate(async () => {
    return window.api.mvp.saveOnboarding({
      displayName: 'QA Local',
      role: 'QA Automation Engineer',
      lifeSeason: 'Release hardening',
      planningPain: 'Legacy release assumptions create false confidence.',
      successDefinition: 'Validate the MVP loop without legacy drift',
      goals: ['Ship MVP release evidence', 'Protect regression coverage'],
      commitments: ['Daily verification'],
      constraints: ['No legacy route claims'],
    })
  })
}

async function generateAndConfirmPlanViaBridge(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>,
) {
  return page.evaluate(async () => {
    const generated = await window.api.mvp.generateWeeklyPlan({
      wins: ['Defined the MVP boundary'],
      unfinishedWork: ['Retire stale smoke evidence'],
      constraints: ['Only canonical MVP routes count'],
      focusArea: 'Release confidence',
      energyLevel: 4,
      notes: 'Bias for deterministic coverage.',
    })

    if (generated.plan.id) {
      return window.api.mvp.confirmPlan(generated.plan.id)
    }

    return generated
  })
}

async function completeActionAndSaveCheckInViaBridge(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>,
) {
  return page.evaluate(async () => {
    const workspace = await window.api.mvp.getWorkspace()
    const firstActionId = workspace.plan.priorities[0]?.actions[0]?.id

    if (!firstActionId) {
      throw new Error('Expected at least one MVP action item in the generated plan.')
    }

    await window.api.mvp.updateActionStatus(firstActionId, { status: 'done', note: 'Completed via smoke bridge.' })

    const today = new Date().toISOString().slice(0, 10)
    return window.api.mvp.saveDailyCheckIn({
      date: today,
      energy: 4,
      focus: 5,
      blockers: 'None',
      note: 'Completed the highest-signal action first.',
    })
  })
}

async function saveReflectionAndFeedbackViaBridge(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof electron.launch>>['firstWindow']>>,
) {
  return page.evaluate(async () => {
    await window.api.mvp.addReflection({
      period: 'daily',
      body: 'The loop stayed honest and compact.',
    })

    return window.api.mvp.submitFeedback({
      rating: 5,
      message: 'MVP-only release evidence removed ambiguity.',
    })
  })
}

test('desktop smoke: Life OS main window', async () => {
  const { electronApp, page } = await launchDesktop()

  try {
    await expect(page).toHaveTitle(/Life\s?OS/i)
  } finally {
    await electronApp.close()
  }
})

test('desktop smoke: MVP loop persists onboarding, planning, execution, and reflection', async () => {
  clearAuthSession()
  const mvpDataPath = makeMvpDataPath()
  fs.rmSync(mvpDataPath, { force: true })

  const { electronApp, page } = await launchDesktop(mvpDataPath)

  try {
    await clearBrowserState(page)
    await loginThroughUi(page)
    await expect(page.getByText('LifeOS MVP')).toBeVisible({ timeout: 15000 })

    const authState = (await page.evaluate(async () => {
      const desktopWindow = window as unknown as Window & {
        api: { auth: { check: () => Promise<unknown> } }
      }
      return desktopWindow.api.auth.check()
    })) as {
      session: { user?: { id?: string } } | null
      profile: { id?: string } | null
    }

    expect(authState.session?.user?.id).toBe(LOCAL_USER_ID)
    expect(authState.profile?.id).toBe(LOCAL_USER_ID)

    await page.goto(buildFileUrl('/mvp/onboarding'))
    await expect(page.getByRole('heading', { name: 'Onboarding intake' })).toBeVisible()
    await expect(page.getByText(/Workspace sync failed:/i)).toHaveCount(0)
    await saveOnboardingViaBridge(page)
    await page.reload()

    await expect.poll(() => readUserWorkspace(mvpDataPath)?.onboarding).toMatchObject({
      displayName: 'QA Local',
      role: 'QA Automation Engineer',
      goals: ['Ship MVP release evidence', 'Protect regression coverage'],
    })
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.onboarding?.completedAt).toBeTruthy()

    await page.goto(buildFileUrl('/mvp/weekly-review'))
    await expect(page.getByRole('heading', { name: 'Weekly review draft' })).toBeVisible()
    await generateAndConfirmPlanViaBridge(page)
    await page.reload()

    await expect(page.getByRole('heading', { name: 'Generated weekly plan' })).toBeVisible()
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.plan?.priorities?.length ?? 0).toBeGreaterThan(0)
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.plan?.confirmedAt).toBeTruthy()
    await expect(page.getByRole('button', { name: 'Plan confirmed' })).toBeVisible()

    await page.goto(buildFileUrl('/mvp/today'))
    await expect(page.getByRole('heading', { name: 'Daily execution board' })).toBeVisible()
    await completeActionAndSaveCheckInViaBridge(page)
    await page.reload()

    await expect.poll(() => {
      const workspace = readUserWorkspace(mvpDataPath)
      const priorities = Array.isArray(workspace?.plan?.priorities) ? workspace.plan.priorities : []
      return priorities
        .flatMap((priority: { actions?: Array<{ status?: string }> }) => priority.actions ?? [])
        .some((action: { status?: string }) => action.status === 'done')
    }).toBe(true)
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.dailyCheckIns?.length ?? 0).toBe(1)
    await expect(page.getByText(/^1 \/ /)).toBeVisible()

    await page.goto(buildFileUrl('/mvp/reflection'))
    await expect(page.getByRole('heading', { name: 'Reflection capture' })).toBeVisible()
    await saveReflectionAndFeedbackViaBridge(page)
    await page.reload()

    await expect.poll(() => readUserWorkspace(mvpDataPath)?.reflections?.length ?? 0).toBe(1)
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.feedback?.length ?? 0).toBe(1)
    await expect.poll(() => readUserWorkspace(mvpDataPath)?.analytics).toMatchObject({
      onboardingCompleted: true,
      weeklyPlanConfirmed: true,
      dailyCheckIns: 1,
      reflections: 1,
      feedbackEntries: 1,
    })
  } finally {
    await electronApp.close()
    clearAuthSession()
    fs.rmSync(mvpDataPath, { force: true })
  }
})
