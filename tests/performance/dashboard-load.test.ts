import { test, expect } from '@playwright/test';

/**
 * Performance Test: Dashboard Load Time
 *
 * This test measures dashboard load time performance.
 * For accurate results with large datasets (1000+ tasks, 365+ days of habit data),
 * run the seed script first: npm run test:seed-perf-data
 *
 * Performance Target: Dashboard should load in < 2000ms
 */
test.describe('Dashboard Performance', () => {
  // Use existing test user credentials
  const TEST_USER_EMAIL = 'test@life-os.app';
  const TEST_USER_PASSWORD = 'TestPass123!';

  test('should load dashboard within 2000ms', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // Check if we need to login
    const loginHeading = page.getByText(/acesso ao sistema|life os/i).first();
    const needsLogin = await loginHeading.isVisible().catch(() => false);

    if (needsLogin) {
      // Perform login
      await page.locator('input#email').fill(TEST_USER_EMAIL);
      await page.locator('input#password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'ENTRAR' }).click();

      // Wait for navigation to dashboard
      await page.waitForURL('**/', { timeout: 15000 });
    }

    // Clear any existing cache by reloading once
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Measure dashboard load time
    const startTime = Date.now();

    // Navigate to dashboard
    await page.goto('/');

    // Wait for key dashboard elements to be visible
    await Promise.all([
      // Wait for focus session section
      page.getByText(/focus session|pomodoro/i).first().isVisible(),
      // Wait for habit tracker section
      page.getByText(/habit tracker/i).first().isVisible(),
      // Wait for network to be idle
      page.waitForLoadState('networkidle'),
    ]);

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Log the actual load time for debugging
    console.log(`Dashboard load time: ${loadTime}ms`);

    // Assert that load time is under 2000ms (2 seconds)
    expect(loadTime).toBeLessThan(2000);
  });

  test('should maintain responsiveness when scrolling through task list', async ({ page }) => {
    // Navigate and login if needed
    await page.goto('/');

    const loginHeading = page.getByText(/acesso ao sistema|life os/i).first();
    const needsLogin = await loginHeading.isVisible().catch(() => false);

    if (needsLogin) {
      await page.locator('input#email').fill(TEST_USER_EMAIL);
      await page.locator('input#password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'ENTRAR' }).click();
      await page.waitForURL('**/', { timeout: 15000 });
    }

    // Navigate to tasks page
    await page.goto('/tasks');

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');

    // Measure scroll performance
    const scrollStartTime = Date.now();

    // Scroll through the page (simulating user interaction)
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(50); // Small delay between scrolls
    }

    const scrollEndTime = Date.now();
    const scrollTime = scrollEndTime - scrollStartTime;

    console.log(`Scroll performance: ${scrollTime}ms`);

    // Scrolling should be responsive (< 1500ms for 5 scroll actions)
    expect(scrollTime).toBeLessThan(1500);
  });

  test('should render habit page efficiently', async ({ page }) => {
    // Navigate and login if needed
    await page.goto('/');

    const loginHeading = page.getByText(/acesso ao sistema|life os/i).first();
    const needsLogin = await loginHeading.isVisible().catch(() => false);

    if (needsLogin) {
      await page.locator('input#email').fill(TEST_USER_EMAIL);
      await page.locator('input#password').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'ENTRAR' }).click();
      await page.waitForURL('**/', { timeout: 15000 });
    }

    // Navigate to habits page
    const startTime = Date.now();
    await page.goto('/habits');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`Habits page load time: ${loadTime}ms`);

    // Page should load quickly (< 1500ms)
    expect(loadTime).toBeLessThan(1500);
  });
});
