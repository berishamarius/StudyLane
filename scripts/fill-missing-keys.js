/**
 * fill-missing-keys.js
 * 
 * Adds any keys present in en.json that are missing from every other locale file.
 * Existing translations are preserved. Missing keys are added with the English value
 * as a fallback (so the app stays functional even for untranslated locales).
 * 
 * Usage:  node scripts/fill-missing-keys.js
 */

const fs   = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_FILE     = path.join(LOCALES_DIR, 'en.json');

const stripBom = (str) => str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;

const enKeys = JSON.parse(stripBom(fs.readFileSync(EN_FILE, 'utf8')));
const enKeyList = Object.keys(enKeys);

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');

let totalAdded = 0;

for (const file of files) {
  const filePath = path.join(LOCALES_DIR, file);
  let locale;
  try {
    locale = JSON.parse(stripBom(fs.readFileSync(filePath, 'utf8')));
  } catch (e) {
    console.warn(`⚠  Could not parse ${file}: ${e.message}`);
    continue;
  }

  let added = 0;
  for (const key of enKeyList) {
    if (!(key in locale)) {
      locale[key] = enKeys[key]; // fallback to English value
      added++;
    }
  }

  if (added > 0) {
    fs.writeFileSync(filePath, JSON.stringify(locale, null, 2), 'utf8');
    console.log(`✓  ${file}: added ${added} missing key(s)`);
    totalAdded += added;
  }
}

if (totalAdded === 0) {
  console.log('✓  All locale files are up to date. No missing keys found.');
} else {
  console.log(`\nDone. Added ${totalAdded} key(s) across ${files.length} locale files.`);
}
