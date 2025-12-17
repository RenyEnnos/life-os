from playwright.sync_api import sync_playwright, expect
import json
import time

def verify_modal(page):
    user = {
        "id": "test-user-id",
        "email": "test@example.com",
        "name": "Test User",
        "created_at": "2023-01-01T00:00:00Z"
    }

    # Mock Auth Verify
    def handle_auth(route):
        route.fulfill(json=user)
    page.route("**/api/auth/verify", handle_auth)

    # Mock Tasks List
    def handle_tasks(route):
        if route.request.method == "GET":
            route.fulfill(json=[{
                "id": "task-1",
                "title": "Existing Test Task",
                "completed": False,
                "created_at": "2023-01-01T00:00:00Z",
                "priority": "medium"
            }])
        else:
            route.continue_()
    page.route("**/api/tasks", handle_tasks)

    # Mock Delete Task
    page.route("**/api/tasks/task-1", lambda route: route.fulfill(status=200, json={"success": True}))

    # Set LocalStorage
    page.goto("http://localhost:5173")
    page.evaluate(f"""() => {{
        localStorage.setItem('life-os-onboarding-completed', 'true');
        localStorage.setItem('life-os-onboarding', JSON.stringify({{ state: {{ hasCompletedOnboarding: true }}, version: 0 }}));
        localStorage.setItem('auth_user', JSON.stringify({json.dumps(user)}));
    }}""")

    # Navigate
    page.goto("http://localhost:5173/tasks")

    # Remove Onboarding if present
    time.sleep(1) # wait for render
    page.evaluate("""() => {
        const overlays = document.querySelectorAll('.fixed.inset-0.z-50');
        overlays.forEach(el => {
            if (el.textContent && (el.textContent.includes('LIFE OS') || el.textContent.includes('Sistema Operacional'))) {
                el.remove();
            }
        });
    }""")

    # Wait for task
    try:
        page.get_by_text("Existing Test Task").first.wait_for(timeout=10000)
    except:
        print("Task not found. Taking screenshot.")
        page.screenshot(path="verification/failed_load_tasks.png")
        return

    # Hover and click delete
    row = page.locator("div.group", has_text="Existing Test Task").first
    row.hover()
    row.get_by_role("button", name="Excluir tarefa").click()

    # Verify Modal
    expect(page.get_by_role("dialog")).to_be_visible()
    expect(page.get_by_role("button", name="Close modal")).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/verification.png")
    print("Verification successful!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_modal(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
