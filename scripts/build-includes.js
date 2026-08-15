#!/usr/bin/env node
/**
 * build-includes.js
 * Simple Node.js script to inject shared nav and footer partials into HTML files.
 * Run before deploy: node scripts/build-includes.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const TARGET_DIRS = [
  '.',  // root level HTML files
  'learning-path-ia',
  'learning-path-ia/modulo-01',
  'learning-path-ia/modulo-02',
  'learning-path-ia/modulo-03',
  'learning-path-ia/modulo-04',
  'learning-path-ia/modulo-05',
  'learning-path-ia/modulo-06',
  'learning-path-ia/modulo-07',
];

function readPartial(name) {
  const filePath = path.join(PARTIALS_DIR, name);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Partial not found: ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function injectIncludes(html, navContent, footerContent) {
  // Replace <nav>...</nav> with the shared nav
  let result = html.replace(
    /<nav[\s\S]*?<\/nav>/,
    navContent
  );

  // Replace <footer>...</footer> with the shared footer
  result = result.replace(
    /<footer[\s\S]*?<\/footer>/,
    footerContent
  );

  return result;
}

function processFile(filePath, navContent, footerContent) {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Skip if no nav or footer to replace (might be a partial or already processed)
  if (!html.includes('<nav') || !html.includes('<footer')) {
    console.log(`⏭  Skipping (no nav/footer): ${filePath}`);
    return;
  }

  const updated = injectIncludes(html, navContent, footerContent);
  
  if (updated !== html) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⏭  No changes: ${filePath}`);
  }
}

function main() {
  console.log('🔧 Building shared includes...\n');

  const navContent = readPartial('nav.html');
  const footerContent = readPartial('footer.html');

  let processed = 0;

  for (const dir of TARGET_DIRS) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) {
      console.log(`⚠️  Directory not found (skipping): ${fullDir}`);
      continue;
    }

    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
      const filePath = path.join(fullDir, file);
      processFile(filePath, navContent, footerContent);
      processed++;
    }
  }

  console.log(`\n✨ Done. Processed ${processed} HTML files.`);
}

main();