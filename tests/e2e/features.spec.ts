import { test, expect } from '@playwright/test'

test.describe('Finances', () => {
    // Note: These tests require authenticated user
    // In a real setup, you'd use fixtures to handle auth state

    test.beforeEach(async ({ page }) => {
        // Navigate to finances page (will redirect to login if not authenticated)
        await page.goto('/finances')
    })

    test('finances page loads for authenticated users', async ({ page }) => {
        // If redirected to login, skip this test
        if (page.url().includes('/login')) {
            test.skip()
            return
        }

        // Should show financial content
        await expect(page.locator('text=/Financial|Finanças|Finance/i').first()).toBeVisible()
    })

    test('finances page shows key components', async ({ page }) => {
        if (page.url().includes('/login')) {
            test.skip()
            return
        }

        // Should have main finance sections
        await expect(page.locator('text=/Balance|Saldo|Overview/i').first()).toBeVisible({ timeout: 10000 })
    })
})

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('dashboard loads for authenticated users', async ({ page }) => {
        if (page.url().includes('/login')) {
            test.skip()
            return
        }

        // Should show dashboard content
        await expect(page.locator('text=/Dashboard|Nexus|Terminal/i').first()).toBeVisible()
    })
})

test.describe('Habits', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/habits')
    })

    test('habits page loads for authenticated users', async ({ page }) => {
        if (page.url().includes('/login')) {
            test.skip()
            return
        }

        // Should show habits content
        await expect(page.locator('text=/Habits|Hábitos|Consistency/i').first()).toBeVisible()
    })
})

test.describe('Tasks', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/tasks')
    })

    test('tasks page loads for authenticated users', async ({ page }) => {
        if (page.url().includes('/login')) {
            test.skip()
            return
        }

        // Should show tasks content
        await expect(page.locator('text=/Tasks|Tarefas|Workflow/i').first()).toBeVisible()
    })
})
