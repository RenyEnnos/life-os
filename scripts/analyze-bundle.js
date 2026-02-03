#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Run this after building to see bundle sizes
 * Usage: npm run analyze
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'assets', 'js');

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function analyzeBundle() {
  if (!fs.existsSync(distPath)) {
    console.error('❌ Build directory not found. Please run npm run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  const fileStats = jsFiles.map(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
    };
  });

  // Sort by size (largest first)
  fileStats.sort((a, b) => b.size - a.size);

  console.log('\n📦 Bundle Analysis\n');
  console.log('='.repeat(60));
  
  let totalSize = 0;
  fileStats.forEach(file => {
    totalSize += file.size;
    const sizeStr = file.sizeFormatted.padStart(10);
    const nameStr = file.name.padEnd(40);
    
    // Color coding by size
    let color = '\x1b[32m'; // Green
    if (file.size > 500000) color = '\x1b[33m'; // Yellow
    if (file.size > 1000000) color = '\x1b[31m'; // Red
    
    console.log(`${color}${sizeStr}\x1b[0m | ${nameStr}`);
  });
  
  console.log('='.repeat(60));
  console.log(`Total: ${formatBytes(totalSize)}\n`);
  
  // Performance recommendations
  console.log('💡 Recommendations:');
  const largeFiles = fileStats.filter(f => f.size > 500000);
  if (largeFiles.length > 0) {
    console.log(`  ⚠️  ${largeFiles.length} chunks are over 500KB`);
    console.log('     Consider further splitting these chunks');
  } else {
    console.log('  ✓ All chunks are under 500KB');
  }
  
  const totalMB = totalSize / (1024 * 1024);
  if (totalMB > 2) {
    console.log(`  ⚠️  Total bundle size is ${totalMB.toFixed(2)}MB`);
    console.log('     Consider code-splitting or lazy loading more routes');
  } else {
    console.log('  ✓ Total bundle size is optimal');
  }
  
  console.log('');
}

analyzeBundle();
