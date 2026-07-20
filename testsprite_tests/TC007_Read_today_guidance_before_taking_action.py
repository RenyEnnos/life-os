import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173/mvp/onboarding")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # -> Fill the Email and Senha fields with the synthetic credentials and click the 'ENTRAR' button to sign in.
        # seu@email.com email field
        elem = page.get_by_test_id('login-email-input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("audit151@example.test")

        # -> Fill the Email and Senha fields with the synthetic credentials and click the 'ENTRAR' button to sign in.
        # •••••••• password field
        elem = page.get_by_test_id('login-password-input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Audit151Pass!")

        # -> Fill the Email and Senha fields with the synthetic credentials and click the 'ENTRAR' button to sign in.
        # ENTRAR button
        elem = page.get_by_test_id('login-submit-button')
        await elem.click(timeout=10000)

        # -> Click the 'Today' navigation pill in the week navigation to open the Today surface.
        # Today
        elem = page.get_by_text('Today', exact=True)
        await elem.click(timeout=10000)

        # -> Click the 'Today' navigation pill to open the Today surface.
        # Today
        elem = page.get_by_text('Today', exact=True)
        await elem.click(timeout=10000)

        # -> Open the 'Today' surface (navigate to the Today page) and verify the current action and the unlocked outcome are displayed.
        await page.goto("http://localhost:5173/mvp/today")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass

        # --> Test passed — verified by AI agent
        await expect(page.get_by_role("heading", name="Work from today's next actions")).to_be_visible()
        await expect(page.get_by_text("Completing the work makes Reflection the next useful step.")).to_be_visible()
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
