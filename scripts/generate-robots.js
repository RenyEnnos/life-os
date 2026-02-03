#!/usr/bin/env node

/**
 * Robots.txt Generator Script
 * Generates robots.txt for SEO
 * Usage: npm run generate:robots
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://life-os.app';

function generateRobots(isProduction = true) {
  let robots = '# robots.txt for Life OS\n';
  robots += '# Generated automatically - do not edit manually\n\n';
  
  // Allow all user agents
  robots += 'User-agent: *\n';
  
  if (isProduction) {
    // Production - allow everything except private routes
    robots += 'Allow: /\n\n';
    
    // Disallow private/auth routes
    robots += '# Private routes\n';
    robots += 'Disallow: /api/\n';
    robots += 'Disallow: /settings\n';
    robots += 'Disallow: /profile\n';
    robots += 'Disallow: /design\n\n';
    
    // Sitemap
    robots += '# Sitemap\n';
    robots += `Sitemap: ${BASE_URL}/sitemap.xml\n\n`;
    
    // Crawl delay (be nice to crawlers)
    robots += '# Crawl rate\n';
    robots += 'Crawl-delay: 1\n';
  } else {
    // Development/staging - disallow all
    robots += 'Disallow: /\n';
    robots += '\n# This is a development environment\n';
  }
  
  const outputPath = path.join(__dirname, '..', 'public', 'robots.txt');
  
  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, robots);
  
  const env = isProduction ? 'production' : 'development';
  console.log(`✅ Robots.txt generated for ${env} environment`);
  console.log(`   Location: public/robots.txt`);
  console.log(`   Mode: ${isProduction ? 'Allow all (except private)' : 'Disallow all'}`);
}

// Check environment
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
generateRobots(isProduction);
