const { chromium } = require('playwright');
const fs = require('fs');
const { spawn } = require('child_process');

(async () => {
  console.log('🥒 Pickle Rick Diagnostic Probe 3.0...');
  
  const server = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 8000)); // 8s boot time

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture Console Logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  try {
    console.log('Navigating to Login...');
    await page.goto('http://localhost:5173/login');
    
    console.log('Filling Credentials...');
    await page.fill('input#email', 'test@example.com');
    await page.fill('input#password', 'password123'); // Assuming seed user password is correct
    
    console.log('Clicking Submit...');
    await page.click('button:has-text("ENTRAR")');

    // Wait a bit for async action
    await page.waitForTimeout(3000);

    console.log('Checking URL...');
    console.log('Current URL:', page.url());

    // Dump HTML immediately to see if there is an error message
    const content = await page.content();
    fs.writeFileSync('post_login_snapshot.html', content);
    console.log('Snapshot saved.');

    // Check for error message
    const errorMsg = await page.locator('[data-testid="login-error-message"]').textContent().catch(() => null);
    if (errorMsg) {
        console.log('LOGIN FAILED WITH MESSAGE:', errorMsg);
    } else {
        console.log('No error message found on screen.');
    }

  } catch (error) {
    console.error('Probe Failed:', error);
  } finally {
    await browser.close();
    try {
        if (process.platform === 'win32') {
            require('child_process').execSync(`taskkill /pid ${server.pid} /T /F`);
        } else {
            server.kill();
        }
    } catch (e) {}
  }
})();
