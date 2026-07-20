import asyncio

from playwright import async_api
from playwright.async_api import expect

from testsprite_test_support import open_authenticated_surface


async def run_test() -> None:
    async with async_api.async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await open_authenticated_surface(page, "/mvp/reflection")
            await expect(page.get_by_role("heading", name="Close the loop")).to_be_visible()
            await expect(page.get_by_text("Your reflections become context for the next Weekly Review.")).to_be_visible()
        finally:
            await browser.close()


asyncio.run(run_test())
