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
            await page.locator('input#email').fill('test@example.com');
            await page.locator('input#password').fill('password123');
            await page.getByRole('button', { name: 'ENTRAR' }).click();
            // Wait for dashboard
            await page.waitForURL('**/', { timeout: 10000 });
        }

        // Now on dashboard
        // Verify Zone 1 (Focus/Now)
        await expect(page.getByText(/ready to focus|deep focusing/i)).toBeVisible();
        await expect(page.getByLabel(/iniciar foco/i)).toBeVisible();

        // Verify other sections if possible (AgoraSection etc)
        // We don't have exact text for others yet, but let's check for "Focus" title in BentoCard
        await expect(page.getByText('Focus').first()).toBeVisible();
    });
});
