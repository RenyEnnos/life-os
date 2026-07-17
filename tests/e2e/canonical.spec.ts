import { expect, test } from '@playwright/test'
import { rm } from 'node:fs/promises'

const apiBase = 'http://127.0.0.1:3001'
const password = 'Canonical123!'
const marker = 'canonical-a'

test('invited weekly loop persists and isolates each user', async ({ browser, playwright, request }) => {
  let registrationContext: Awaited<ReturnType<typeof browser.newContext>> | undefined
  let userContext: Awaited<ReturnType<typeof browser.newContext>> | undefined
  let secondUserContext: Awaited<ReturnType<typeof playwright.request.newContext>> | undefined

  try {
    expect((await request.get(`${apiBase}/api/mvp/workspace`)).status()).toBe(401)

    const stolenInvite = await request.post(`${apiBase}/api/auth/register`, {
      data: {
        email: 'attacker@example.test',
        password,
        name: 'Attacker',
        inviteCode: 'INVITE-A',
      },
    })
    expect(stolenInvite.ok()).toBe(false)

    registrationContext = await browser.newContext({ baseURL: 'http://app.lifeos.test:3001' })
    await registrationContext.addInitScript(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    const registrationPage = await registrationContext.newPage()
    await registrationPage.goto('/register')
    await registrationPage.getByPlaceholder('Nome', { exact: true }).fill('Canonical')
    await registrationPage.getByPlaceholder('Sobrenome').fill('A')
    await registrationPage.getByPlaceholder('seu@email.com').fill('canonical-a@example.test')
    await registrationPage.getByPlaceholder('LIFEOS-INVITE').fill('INVITE-A')
    await registrationPage.getByPlaceholder('••••••••').nth(0).fill(password)
    await registrationPage.getByPlaceholder('••••••••').nth(1).fill(password)
    const registrationResponse = registrationPage.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/auth/register' &&
        response.request().method() === 'POST',
    )
    await registrationPage.getByRole('button', { name: 'CRIAR CONTA' }).click()
    expect((await registrationResponse).status()).toBe(201)
    await registrationPage.waitForURL(/\/mvp$/)
    await registrationContext.close()
    registrationContext = undefined

    userContext = await browser.newContext({ baseURL: 'http://app.lifeos.test:3001' })
    await userContext.addInitScript(() => {
      localStorage.setItem('life-os-onboarding-completed', 'true')
    })
    const page = await userContext.newPage()
    await page.goto('/login')
    await page.getByTestId('login-email-input').fill('canonical-a@example.test')
    await page.getByTestId('login-password-input').fill(password)
    const loginResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/auth/login' &&
        response.request().method() === 'POST',
    )
    await page.getByTestId('login-submit-button').click()
    expect((await loginResponse).status()).toBe(200)
    await page.waitForURL(/\/mvp$/)

    await page.goto('/mvp/onboarding')
    await expect(page).toHaveURL(/\/mvp\/onboarding$/, { timeout: 10_000 })
    await expect
      .poll(() => page.locator('body').innerText(), { timeout: 10_000 })
      .toContain('Onboarding intake')
    await expect(page.getByRole('heading', { name: 'Onboarding intake' })).toBeVisible({
      timeout: 10_000,
    })
    await page.getByPlaceholder('Display name').fill(`${marker}-display`)
    await page.getByPlaceholder('Role').fill(`${marker}-role`)
    await page.getByPlaceholder('Life season').fill(`${marker}-season`)
    await page.getByPlaceholder('Success definition for this season').fill(`${marker}-success`)
    await page
      .getByPlaceholder('What is breaking in the current planning system?')
      .fill(`${marker}-pain`)
    await page.getByPlaceholder('Goals, one per line').fill(`${marker}-goal`)
    await page.getByPlaceholder('Recurring commitments, one per line').fill(`${marker}-commitment`)
    await page.getByPlaceholder('Constraints or realities, one per line').fill(`${marker}-constraint`)
    const onboardingResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/mvp/onboarding' &&
        response.request().method() === 'PUT',
    )
    await page.getByRole('button', { name: 'Save intake' }).click()
    expect((await onboardingResponse).ok()).toBe(true)

    await page.goto('/mvp/weekly-review')
    await page.getByPlaceholder('Primary focus area').fill(`${marker}-focus`)
    await page.getByPlaceholder('Energy level 1-5').fill('4')
    await page.getByPlaceholder('Wins from the previous cycle, one per line').fill(`${marker}-win`)
    await page
      .getByPlaceholder('Unfinished work still pulling attention, one per line')
      .fill(`${marker}-unfinished`)
    await page.getByPlaceholder('Constraints for this week, one per line').fill(`${marker}-week-constraint`)
    await page.getByPlaceholder('Notes that should shape the plan').fill(`${marker}-plan-note`)
    const generatedResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/mvp/weekly-plans/generate' &&
        response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Generate weekly plan' }).click()
    const generated = await generatedResponse
    expect(generated.ok()).toBe(true)
    const generatedBody = await generated.json()
    const actionId = generatedBody.data.plan.priorities[0].actions[0].id as string
    const planId = generatedBody.data.plan.id as string

    const confirmResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === `/api/mvp/weekly-plans/${planId}/confirm` &&
        response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Confirm weekly plan' }).click()
    expect((await confirmResponse).ok()).toBe(true)

    await page.goto('/mvp/today')
    const actionResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === `/api/mvp/action-items/${actionId}` &&
        response.request().method() === 'PATCH',
    )
    await page.getByRole('button', { name: 'Complete' }).first().click()
    expect((await actionResponse).ok()).toBe(true)
    await page.getByPlaceholder('Blockers').fill(`${marker}-blockers`)
    await page.getByPlaceholder('Execution note').fill(`${marker}-execution-note`)
    const checkInResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/mvp/daily-checkins' &&
        response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Save daily check-in' }).click()
    expect((await checkInResponse).ok()).toBe(true)

    await page.goto('/mvp/reflection')
    await page.getByPlaceholder('Daily reflection').fill(`${marker}-reflection`)
    const reflectionResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/mvp/reflections' &&
        response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Save daily reflection' }).click()
    expect((await reflectionResponse).ok()).toBe(true)
    await page.getByPlaceholder('What created clarity or friction?').fill(`${marker}-feedback`)
    const feedbackResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/api/mvp/feedback' &&
        response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Submit feedback' }).click()
    expect((await feedbackResponse).ok()).toBe(true)

    const firstWorkspaceResponse = await page.evaluate(async () => {
      const response = await fetch('/api/mvp/workspace', { credentials: 'include' })
      return { status: response.status, body: await response.json() }
    })
    expect(firstWorkspaceResponse.status).toBe(200)
    const firstWorkspace = firstWorkspaceResponse.body.data
    expect(firstWorkspace.onboarding.displayName).toBe(`${marker}-display`)
    expect(firstWorkspace.plan.confirmedAt).toBeTruthy()
    expect(firstWorkspace.plan.priorities[0].actions[0]).toMatchObject({ id: actionId, status: 'done' })
    expect(firstWorkspace.dailyCheckIns[0].note).toBe(`${marker}-execution-note`)
    expect(JSON.stringify(firstWorkspace)).toContain(`${marker}-reflection`)
    expect(JSON.stringify(firstWorkspace)).toContain(`${marker}-feedback`)

    secondUserContext = await playwright.request.newContext({ baseURL: apiBase })
    const secondRegistration = await secondUserContext.post('/api/auth/register', {
      data: {
        email: 'canonical-b@example.test',
        password,
        name: 'Canonical B',
        inviteCode: 'INVITE-B',
      },
    })
    expect(secondRegistration.status()).toBe(201)
    const secondWorkspaceResponse = await secondUserContext.get('/api/mvp/workspace')
    expect(secondWorkspaceResponse.ok()).toBe(true)
    const secondWorkspace = (await secondWorkspaceResponse.json()).data
    expect(secondWorkspace.plan.priorities).toEqual([])
    expect(JSON.stringify(secondWorkspace)).not.toContain(marker)

    const foreignActionAttempt = await secondUserContext.patch(
      `/api/mvp/action-items/${actionId}`,
      { data: { status: 'deferred' } },
    )
    expect(foreignActionAttempt.status()).toBe(200)
    const secondWorkspaceAfterAttempt = (await foreignActionAttempt.json()).data
    expect(secondWorkspaceAfterAttempt.plan.priorities).toEqual([])
    expect(JSON.stringify(secondWorkspaceAfterAttempt)).not.toContain(marker)

    const unchangedFirstResponse = await page.evaluate(async () => {
      const response = await fetch('/api/mvp/workspace', { credentials: 'include' })
      return { status: response.status, body: await response.json() }
    })
    expect(unchangedFirstResponse.status).toBe(200)
    const unchangedFirst = unchangedFirstResponse.body.data
    expect(unchangedFirst.plan.priorities[0].actions[0]).toMatchObject({ id: actionId, status: 'done' })
    expect(JSON.stringify(unchangedFirst)).toContain(`${marker}-reflection`)
    expect(JSON.stringify(unchangedFirst)).toContain(`${marker}-feedback`)
  } finally {
    await Promise.allSettled([
      secondUserContext?.dispose(),
      userContext?.close(),
      registrationContext?.close(),
    ])
    await Promise.all([
      rm('test-results/canonical/auth-state.json', { force: true }),
      rm('test-results/canonical/mvp-workspace.json', { force: true }),
    ])
  }
})
