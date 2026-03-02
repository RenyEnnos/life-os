import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePng() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const publicDir = path.join(__dirname, '../public');
  const svgPath = path.join(publicDir, 'icon-512.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Set viewport to the size of the icon
  await page.setViewportSize({ width: 512, height: 512 });
  
  // Load SVG content in the page
  await page.setContent(`
    <html>
      <body style="margin: 0; padding: 0;">
        ${svgContent}
      </body>
    </html>
  `);
  
  // Generate apple-touch-icon.png (180x180 is typical)
  await page.setViewportSize({ width: 180, height: 180 });
  // Scale the SVG content to fit 180x180
  await page.addStyleTag({ content: 'svg { width: 100%; height: 100%; }' });
  await page.screenshot({ path: path.join(publicDir, 'apple-touch-icon.png'), omitBackground: true });
  console.log('Generated apple-touch-icon.png');

  // Also generate standard PNG icons for better compatibility
  await page.setViewportSize({ width: 192, height: 192 });
  await page.screenshot({ path: path.join(publicDir, 'icon-192.png'), omitBackground: true });
  console.log('Generated icon-192.png');

  await page.setViewportSize({ width: 512, height: 512 });
  await page.screenshot({ path: path.join(publicDir, 'icon-512.png'), omitBackground: true });
  console.log('Generated icon-512.png');

  await browser.close();
}

generatePng().catch(console.error);
