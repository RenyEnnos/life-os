import os

from playwright.async_api import Page, expect


BASE_URL = os.getenv("LIFEOS_TEST_BASE_URL", "http://localhost:5173")
TEST_EMAIL = os.getenv("LIFEOS_TEST_EMAIL", "audit151@example.test")
TEST_PASSWORD = os.getenv("LIFEOS_TEST_PASSWORD", "Audit151Pass!")


async def open_authenticated_surface(page: Page, path: str) -> None:
    await page.goto(f"{BASE_URL}/mvp/onboarding")
    await page.get_by_test_id("login-email-input").fill(TEST_EMAIL)
    await page.get_by_test_id("login-password-input").fill(TEST_PASSWORD)
    await page.get_by_test_id("login-submit-button").click()
    await page.goto(f"{BASE_URL}{path}")
    await expect(page.locator("body")).not_to_contain_text("Next build steps")
