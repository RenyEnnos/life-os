import { test, expect } from '@playwright/test';

test.describe('Dashboard Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC003: Should verify dashboard elements', async ({ page }) => {
        // Check if we get redirected to login. If so, perform login first.
        // Quick check for login page elements
        const loginHeading = page.getByText(/acesso ao sistema|life os/i).first();
        if (await loginHeading.isVisible()) {
            await page.locator('input#email').fill('test@life-os.app');
            await page.locator('input#password').fill('TestPass123!');
            await page.getByRole('button', { name: 'ENTRAR' }).click();
            // Wait for dashboard
            await page.waitForURL('**/', { timeout: 10000 });
        }

        // Now on dashboard
        // Verify Zone 1 (Focus/Now)
        await expect(page.getByText(/focus session|pomodoro/i).first()).toBeVisible();
        
        // Verify other sections
        await expect(page.getByText(/habit tracker/i).first()).toBeVisible();
    });
});
