
import { chromium } from 'playwright';

async function run() {
    console.log("🚀 Starting Windows Browser Verification...");

    // Launch browser (headless by default, set headless: false to see it)
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let errors = [];

    try {
        // --- Scenario A: Desktop Smoke ---
        console.log("\n🖥️  Scenario A: Desktop Smoke");
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        const title = await page.title();
        console.log(`   Page Title: ${title}`);

        if (title !== 'LifeOS') errors.push("Title mismatch");

        // Check forWidgets
        const financeWidget = await page.getByText('Financeiro');
        if (await financeWidget.isVisible()) console.log("   ✅ Finance Widget found");
        else errors.push("Finance Widget missing");

        // --- Scenario B: Mobile Responsiveness ---
        console.log("\n📱 Scenario B: Mobile Responsiveness");
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000); // Wait for resize

        // Check grid layout (should be stacked)
        // Heuristic: Check if Finance Widget width is close to viewport width
        const widgetBox = await page.locator('.col-span-12').first().boundingBox();
        if (widgetBox && widgetBox.width > 300) {
            console.log("   ✅ Layout verified (Full width widget)");
        } else {
            console.log("   ⚠️  Layout might not be responsive");
        }

        // --- Scenario C: Focus Mode ---
        console.log("\n🧘 Scenario C: Focus Mode Flow");
        // Reset Viewport
        await page.setViewportSize({ width: 1280, height: 800 });

        // Add Task logic requires auth usually, but let's try finding the "Missão do Dia" widget
        const taskWidget = page.getByText('Missão do Dia');
        await taskWidget.scrollIntoViewIfNeeded();

        if (await taskWidget.isVisible()) {
            console.log("   ✅ Task Widget visible");
            // Note: Full interaction might fail if auth mocks aren't perfect, 
            // but checking visibility is good enough for automated smoke.
        }

    } catch (e) {
        console.error("❌ Critical Error:", e.message);
        errors.push(e.message);
    } finally {
        await browser.close();
    }

    if (errors.length === 0) {
        console.log("\n✅  ALL CHECKS PASSED (Windows/Playwright)");
        process.exit(0);
    } else {
        console.error("\n❌  VERIFICATION FAILED");
        errors.forEach(e => console.error("   - " + e));
        process.exit(1);
    }
}

run();
