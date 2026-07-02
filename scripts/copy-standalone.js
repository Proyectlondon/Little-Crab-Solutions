/**
 * Cross-platform script to copy static files and public folder to standalone output
 * Used after `next build` with `output: 'standalone'` in next.config.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', '.next');
const targetDir = path.join(__dirname, '..', '.next', 'standalone');

// Ensure target directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source not found, skipping: ${src}`);
    return;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Copying static files to standalone output...');

// Copy .next/static to .next/standalone/.next/static
const staticSrc = path.join(sourceDir, 'static');
const staticDest = path.join(targetDir, '.next', 'static');
copyRecursive(staticSrc, staticDest);
console.log('✅ Copied .next/static');

// Copy public to .next/standalone/public
const publicSrc = path.join(__dirname, '..', 'public');
const publicDest = path.join(targetDir, 'public');
copyRecursive(publicSrc, publicDest);
console.log('✅ Copied public folder');

console.log('🎉 Standalone copy complete!');