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

        print("Navigating to Dashboard...")
        try:
            page.goto("http://localhost:5173/dashboard", timeout=30000)
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
            print("No onboarding modal detected or skip link not found.")

        print("Waiting for TaskWidget...")

        # Check for 'Missão do Dia' text which is in TaskWidget
        try:
            page.wait_for_selector("text=Missão do Dia", timeout=10000)
            print("TaskWidget found.")
        except:
            print("TaskWidget not found within timeout. Taking screenshot...")
            page.screenshot(path="verification/failed_load_2.png")
            browser.close()
            return

        # 1. Verify "Add Task" button ARIA label
        print("Verifying 'Add Task' button...")
        add_btn = page.locator('button[aria-label="Add new task"]')

        # Wait for the button to be visible
        try:
            add_btn.wait_for(state="visible", timeout=5000)
            print("✅ 'Add new task' button found.")
        except:
            print("❌ 'Add new task' button NOT found.")
            # Debug: print all buttons
            print("Buttons found on page:")
            for btn in page.locator("button").all():
                print(f"- Button: {btn.inner_text()} | ARIA: {btn.get_attribute('aria-label')}")

        # 2. Click "Add Task" to reveal input
        print("Clicking 'Add new task' button...")
        try:
            add_btn.click()
        except:
             print("Could not click add button")

        # 3. Verify Input ARIA label
        print("Verifying 'New task title' input...")
        input_field = page.locator('input[aria-label="New task title"]')
        try:
            input_field.wait_for(state="visible", timeout=2000)
            print("✅ 'New task title' input found.")
        except:
             print("❌ 'New task title' input NOT found.")

        # 4. Verify "Confirm Add Task" button ARIA label
        print("Verifying 'Confirm add task' button...")
        confirm_btn = page.locator('button[aria-label="Confirm add task"]')
        if confirm_btn.count() > 0:
            print("✅ 'Confirm add task' button found.")
        else:
            print("❌ 'Confirm add task' button NOT found.")

        # Take screenshot of the "Add Task" state
        page.screenshot(path="verification/task_widget_add_state.png")
        print("Screenshot saved to verification/task_widget_add_state.png")

        browser.close()

if __name__ == "__main__":
    verify_ux()
