import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // Clear any existing auth state
        await page.context().clearCookies()
    })

    test('login page loads correctly', async ({ page }) => {
        await page.goto('/login')

        // Should have login form elements
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
        await expect(page.locator('button:has-text("ENTRAR")')).toBeVisible()
    })

    test('register page loads correctly', async ({ page }) => {
        await page.goto('/register')

        // Should have register form elements
        await expect(page.locator('input[name="name"], input[placeholder*="Nome"]').first()).toBeVisible()
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]').first()).toBeVisible()
        await expect(page.locator('button:has-text("CRIAR CONTA")')).toBeVisible()
    })

    test('unauthenticated user is redirected to login', async ({ page }) => {
        await page.goto('/habits')

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/)
    })

    test('login with invalid credentials shows error', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[type="email"]', 'invalid@test.com')
        await page.fill('input[type="password"]', 'wrongpassword')
        await page.click('button:has-text("ENTRAR")')

        // Should show error message
        await expect(page.locator('text=/erro|User not found/i')).toBeVisible({ timeout: 10000 })
    })

    test('user can register and access dashboard', async ({ page }) => {
        const uniqueEmail = `test-${Date.now()}@lifeos.test`

        await page.goto('/register')

        // Fill registration form
        await page.locator('input[name="name"], input[placeholder*="Nome"]').first().fill('Test')
        await page.locator('input[placeholder*="Sobrenome"], input[name="lastName"]').first().fill('User')
        await page.fill('input[type="email"]', uniqueEmail)
        await page.locator('input[type="password"]').first().fill('Test123!')
        await page.locator('input[type="password"]').last().fill('Test123!')

        // Submit
        await page.click('button:has-text("CRIAR CONTA")')

        // Should redirect to dashboard
        await expect(page).toHaveURL('/', { timeout: 15000 })
    })
})
