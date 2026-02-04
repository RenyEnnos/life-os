import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('TC001: Should login successfully with valid credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login');

        // Check if we are on the login page
        // Using loose match for "Acesso ao Sistema" or "Login"
        await expect(page.getByText(/acesso ao sistema|life os/i).first()).toBeVisible();

        // Fill in credentials using IDs found in source
        await page.locator('input#email').fill('test@life-os.app');
        await page.locator('input#password').fill('TestPass123!');

        // Submit
        await page.getByRole('button', { name: 'ENTRAR' }).click();

        // Expect successful navigation to Dashboard
        await expect(page).toHaveURL(/\/$/);
    });

    test('TC002: Should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.locator('input#email').fill('wrong@example.com');
        await page.locator('input#password').fill('wrongpass');
        await page.getByRole('button', { name: 'ENTRAR' }).click();

        // Expect an error toast or message
        await expect(page.getByText(/credenciais incorretas|não encontrada|erro/i)).toBeVisible();
    });
});
