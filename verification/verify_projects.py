
from playwright.sync_api import sync_playwright, expect

def verify_project_cards():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Bypass onboarding & Auth
        context.add_init_script("""
            localStorage.setItem('life-os-onboarding-completed', 'true');
            localStorage.setItem('life-os-onboarding', JSON.stringify({ state: { hasCompletedOnboarding: true }, version: 0 }));
            localStorage.setItem('auth_user', JSON.stringify({ id: 'test-user', email: 'test@example.com' }));
        """)

        page = context.new_page()

        # Mock API responses
        page.route("**/api/auth/verify", lambda route: route.fulfill(
            status=200, content_type="application/json", body='{"id": "test-user", "email": "test@example.com"}'
        ))

        projects_data = [
            {
                "id": "proj-1",
                "title": "Website Redesign",
                "description": "Redesign the corporate website",
                "status": "active",
                "deadline": "2023-12-31T00:00:00.000Z",
                "created_at": "2023-01-01T00:00:00.000Z"
            }
        ]
        page.route("**/api/projects", lambda route: route.fulfill(
            status=200, content_type="application/json", body=str(projects_data).replace("None", "null").replace("'", '"')
        ))

        page.route("**/api/user/profile", lambda route: route.fulfill(status=200, body='{}'))

        try:
            print("Navigating to /projects...")
            page.goto("http://localhost:5173/projects", timeout=60000)

            print("Waiting for content...")
            # Wait for the heading "Projects Portfolio"
            expect(page.get_by_role("heading", name="Projects Portfolio")).to_be_visible(timeout=30000)

            # Wait for project card heading
            expect(page.get_by_role("heading", name="Website Redesign")).to_be_visible(timeout=30000)
            print("Content loaded.")

            # Verify Header Buttons
            search_btn = page.get_by_label("Search projects")
            expect(search_btn).to_be_visible()
            print("Search button verified.")

            bell_btn = page.get_by_label("View notifications")
            expect(bell_btn).to_be_visible()
            print("Bell button verified.")

            # Verify Project Card Delete Button
            delete_btn = page.get_by_label("Delete project: Website Redesign")

            # It might be hidden opacity-0 but present in DOM
            if delete_btn.count() == 0:
                print("Delete button not found in DOM!")
            else:
                print("Delete button found in DOM. Focusing...")
                delete_btn.focus()
                page.wait_for_timeout(500) # Wait for transition

                # Verify opacity is now close to 1
                opacity = delete_btn.evaluate("el => window.getComputedStyle(el).opacity")
                print(f"Delete button opacity: {opacity}")

                if float(opacity) > 0.9:
                    print("SUCCESS: Delete button is visible on focus!")
                else:
                    print("FAILURE: Delete button is NOT visible on focus.")

                page.screenshot(path="verification/projects_focus.png")
                print("Screenshot saved to verification/projects_focus.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error.png")
            raise e

        browser.close()

if __name__ == "__main__":
    verify_project_cards()
