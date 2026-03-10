import { test, expect } from '@playwright/test'

test('app loads startup path and reaches finances flow', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Life OS/i)

  await page.goto('/login')
  await expect(page.getByTestId('login-page-container')).toBeVisible()
  await expect(page.getByTestId('login-email-input')).toBeVisible()
  await expect(page.getByTestId('login-password-input')).toBeVisible()
  await expect(page.getByTestId('login-submit-button')).toBeVisible()

  await page.goto('/finances')

  const financesHeading = page.getByRole('heading', { name: 'Finanças' })
  const loginContainer = page.getByTestId('login-page-container')

  await expect(financesHeading.or(loginContainer)).toBeVisible()
})
