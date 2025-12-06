const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Capture console logs
    page.on('console', msg => {
        const text = msg.text();
        // Filter out boring logs if needed, but keeping all is safer for debug
        console.log('BROWSER LOG:', text);
    });
    page.on('pageerror', exception => {
        console.log('BROWSER ERROR:', exception);
    });

    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    const baseUrl = 'http://localhost:5173';

    console.log('Navigating to register page...');
    await page.goto(baseUrl + '/register');

    // Register new user
    const randomId = Math.floor(Math.random() * 100000);
    const email = `testuser${randomId}@example.com`;
    const password = 'Password123!';

    console.log(`Registering with ${email}...`);

    // Wait for inputs to be available
    await page.waitForSelector('input[placeholder="Seu nome completo"]');

    await page.fill('input[placeholder="Seu nome completo"]', 'Test User');
    await page.fill('input[placeholder="seu@email.com"]', email);

    // Fill password fields
    const inputs = page.locator('input[type="password"]');
    // Playwright needs to wait for elements
    await inputs.nth(0).waitFor();
    await inputs.nth(0).fill(password);
    await inputs.nth(1).fill(password);

    console.log('Submitting registration...');
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation to dashboard...');
    try {
        // Wait for URL change OR a success message OR the dashboard specific element
        await page.waitForURL('**/', { timeout: 15000 });
        console.log('Registration successful, logged in.');
    } catch (e) {
        console.log('Navigation timeout or error. Checking state...');
        console.log('Current URL:', page.url());

        // Check for error message
        const errorEl = await page.locator('.bg-destructive\\/10'); // Based on class in RegisterPage
        if (await errorEl.count() > 0) {
            console.log('Visible Error:', await errorEl.textContent());
        }
    }

    const routes = [
        { name: 'dashboard', path: '/' },
        { name: 'tasks', path: '/tasks' },
        { name: 'habits', path: '/habits' },
        { name: 'journal', path: '/journal' },
        { name: 'health', path: '/health' },
        { name: 'finances', path: '/finances' },
        { name: 'projects', path: '/projects' },
        { name: 'rewards', path: '/rewards' },
        { name: 'settings', path: '/settings' }
    ];

    for (const route of routes) {
        console.log(`Capturing ${route.name}...`);
        try {
            await page.goto(baseUrl + route.path);
            await page.waitForTimeout(3000); // 3s wait
            await page.screenshot({ path: path.join(screenshotsDir, `${route.name}.png`), fullPage: true });
        } catch (err) {
            console.log(`Failed to capture ${route.name}:`, err.message);
        }
    }

    await browser.close();
    console.log('Screenshots captured in /screenshots');
}

captureScreenshots().catch(console.error);
