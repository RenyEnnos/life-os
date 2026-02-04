const { chromium } = require('playwright');
const fs = require('fs');
const { spawn } = require('child_process');

(async () => {
  console.log('🥒 Pickle Rick Diagnostic Probe Initiated...');
  
  // Start Server
  console.log('Starting Dev Server...');
  const server = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'ignore' });
  
  // Give it time to breathe (and boot)
  await new Promise(r => setTimeout(r, 10000));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // 1. Go to Login
    console.log('Navigating to Login...');
    await page.goto('http://localhost:5173/login', { timeout: 60000 });
    
    // 2. Perform Login
    console.log('Attempting Login...');
    await page.fill('input#email', 'test@example.com');
    await page.fill('input#password', 'password123');
    await page.click('button:has-text("ENTRAR")');

    // 3. Wait for Dashboard
    console.log('Waiting for Dashboard redirection...');
    await page.waitForURL('http://localhost:5173/', { timeout: 60000 });
    
    // 4. Wait for Network Idle (App Loaded)
    console.log('Waiting for Network Idle...');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(e => console.log('Network idle timeout (ignoring)'));

    // 5. Dump HTML
    console.log('Stealing DOM Snapshot...');
    const content = await page.content();
    fs.writeFileSync('dashboard_snapshot.html', content);
    console.log('Snapshot saved to dashboard_snapshot.html');

    // 6. Check specific elements
    const bodyText = await page.innerText('body');
    console.log('--- BODY TEXT SAMPLE ---');
    console.log(bodyText.substring(0, 500));
    console.log('------------------------');

  } catch (error) {
    console.error('Probe Failed:', error);
    try {
        const content = await page.content();
        fs.writeFileSync('error_snapshot.html', content);
    } catch (e) { console.log('Could not save error snapshot'); }
  } finally {
    await browser.close();
    console.log('Killing Server...');
    // Kill the process tree (Windows is tricky, using taskkill is safer)
    try {
        if (process.platform === 'win32') {
            require('child_process').execSync(`taskkill /pid ${server.pid} /T /F`);
        } else {
            server.kill();
        }
    } catch (e) { console.log('Server already dead or access denied'); }
  }
})();
