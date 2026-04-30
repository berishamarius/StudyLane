/**
 * build-web.js  –  Copies web assets into www/ for Capacitor / PWA deployment
 * Usage: node scripts/build-web.js
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT  = path.join(ROOT, 'www');

const WEB_FILES = [
  'index.html',
  'style.css',
  'i18n.js',
  'sw.js',
  'manifest.json',
];

const WEB_DIRS = [
  'assets',
];

// ── clean + recreate www/ ──────────────────────────────────────────
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// ── copy flat files ────────────────────────────────────────────────
for (const file of WEB_FILES) {
  fs.copyFileSync(path.join(ROOT, file), path.join(OUT, file));
  console.log(`  copied  ${file}`);
}

// ── copy directories ───────────────────────────────────────────────
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
      console.log(`  copied  ${path.relative(ROOT, s)}`);
    }
  }
}

for (const dir of WEB_DIRS) {
  const src  = path.join(ROOT, dir);
  const dest = path.join(OUT, dir);
  if (fs.existsSync(src)) {
    copyDir(src, dest);
  } else {
    console.warn(`  warn    ${dir}/ not found, skipped`);
  }
}

// ── patch sw.js: fix asset paths relative to www/ ─────────────────
// (no patch needed – paths are already relative ./ which works from www/)

console.log(`\n✓ Web build ready → www/`);
console.log(`  Next steps:`);
console.log(`    npx cap sync android`);
console.log(`    npx cap open android`);
