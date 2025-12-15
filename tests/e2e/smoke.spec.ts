import { test, expect } from '@playwright/test'

test('app loads root route', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Life OS/i)
})
