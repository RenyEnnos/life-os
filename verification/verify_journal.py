from playwright.sync_api import sync_playwright, expect
import json
import time

def verify_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Inject auth state
        context.add_init_script("""
            localStorage.setItem('auth_user', JSON.stringify({
                id: 'test-user-id',
                email: 'test@example.com',
                user_metadata: { name: 'Test User' }
            }));
            localStorage.setItem('life-os-onboarding', JSON.stringify({
                state: { hasCompletedOnboarding: true },
                version: 0
            }));
        """)

        page = context.new_page()

        print("Navigating to Journal...")
        try:
            page.goto("http://localhost:5173/journal", timeout=30000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        # Check for onboarding modal and skip if present
        try:
            skip_link = page.get_by_text("Pular e ir direto para o app")
            if skip_link.is_visible(timeout=5000):
                print("Onboarding modal detected. Clicking skip...")
                skip_link.click()
        except:
            pass

        print("Waiting for Journal toolbar...")

        # Check for toolbar button
        try:
            page.wait_for_selector("text=format_bold", timeout=10000)
            print("Journal toolbar found.")
        except:
            print("Journal toolbar not found within timeout. Taking screenshot...")
            page.screenshot(path="verification/failed_journal_load.png")
            browser.close()
            return

        # Verify ARIA labels exist
        print("Checking for ARIA labels...")

        labels_to_check = [
            "Search entries",
            "Journal entry title",
            "Bold",
            "Italic",
            "Bullet list",
            "Checklist",
            "Collapse insights sidebar"
        ]

        success = True
        for label in labels_to_check:
            el = page.locator(f'[aria-label="{label}"]')
            if el.count() > 0:
                print(f"✅ '{label}' found.")
            else:
                print(f"❌ '{label}' NOT found.")
                success = False

        # Take screenshot
        page.screenshot(path="verification/journal_after.png")
        print("Screenshot saved to verification/journal_after.png")

        browser.close()

        if success:
            print("VERIFICATION SUCCESSFUL")
        else:
            print("VERIFICATION FAILED")

if __name__ == "__main__":
    verify_ux()
