#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Generates sitemap.xml for SEO
 * Usage: npm run generate:sitemap
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://life-os.app';
const LANGUAGES = ['pt-BR', 'en', 'es'];

const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/login', priority: 0.5, changefreq: 'monthly' },
  { path: '/register', priority: 0.5, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { path: '/tasks', priority: 0.9, changefreq: 'daily' },
  { path: '/habits', priority: 0.9, changefreq: 'daily' },
  { path: '/journal', priority: 0.8, changefreq: 'weekly' },
  { path: '/health', priority: 0.8, changefreq: 'weekly' },
  { path: '/finances', priority: 0.8, changefreq: 'weekly' },
  { path: '/projects', priority: 0.8, changefreq: 'weekly' },
  { path: '/calendar', priority: 0.7, changefreq: 'weekly' },
  { path: '/university', priority: 0.7, changefreq: 'monthly' },
  { path: '/settings', priority: 0.6, changefreq: 'monthly' },
  { path: '/profile', priority: 0.6, changefreq: 'monthly' },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  routes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    
    // Add hreflang alternates
    LANGUAGES.forEach(lang => {
      const langPath = lang === 'pt-BR' ? '' : `/${lang}`;
      sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${langPath}${route.path}" />\n`;
    });
    
    // Add x-default
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${route.path}" />\n`;
    
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, sitemap);
  console.log('✅ Sitemap generated at public/sitemap.xml');
  console.log(`   Total URLs: ${routes.length}`);
  console.log(`   Languages: ${LANGUAGES.join(', ')}`);
}

generateSitemap();
