import { test, expect } from '@playwright/test';

test.describe.skip('Quarantined browser placeholder: Finances Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Basic login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('finances page loads with categories', async ({ page }) => {
    await page.goto('/finances');
    await expect(page.locator('text=Financial Overview')).toBeVisible();
    
    // Check if categories are visible (e.g., in a dropdown or list)
    await expect(page.locator('text=Alimentação')).toBeVisible();
    await expect(page.locator('text=Salário')).toBeVisible();
  });
});
