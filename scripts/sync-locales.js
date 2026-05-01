#!/usr/bin/env node
/**
 * sync-locales.js
 *
 * For every locale file except en.json:
 *  1. Removes duplicate keys – keeps FIRST occurrence (the good translation)
 *  2. Adds any key missing in that locale, using the English value as fallback
 *  3. Fixes appTitle if it still reads "Paideon" or "StudyLane" → "Lyceon"
 *
 * Usage:  node scripts/sync-locales.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_PATH     = path.join(LOCALES_DIR, 'en.json');

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Parse a flat JSON object keeping only the FIRST occurrence of every key.
 * Standard JSON.parse (V8) keeps the LAST occurrence — wrong for files where
 * a good translated block appears first and an older/ASCII block is appended.
 */
function parseFirstWins(text) {
  const result = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*"((?:[^"\\]|\\.)*)"\s*:\s*("(?:[^"\\]|\\.)*")/);
    if (!m) continue;
    try {
      const key = JSON.parse('"' + m[1] + '"');
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = JSON.parse(m[2]);
      }
    } catch (_) { /* skip malformed line */ }
  }
  return result;
}

/** True if the raw JSON text contains duplicate top-level string keys. */
function hasDuplicateKeys(text) {
  const seen = new Set();
  const re   = /^\s*"((?:[^"\\]|\\.)*)"\s*:/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (seen.has(m[1])) return true;
    seen.add(m[1]);
  }
  return false;
}

// ─── main ────────────────────────────────────────────────────────────────────

const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

const files = fs
  .readdirSync(LOCALES_DIR)
  .filter(f => f.endsWith('.json') && f !== 'en.json')
  .sort();

let updated = 0, skipped = 0, errors = 0;

for (const file of files) {
  const filePath = path.join(LOCALES_DIR, file);
  try {
    const raw      = fs.readFileSync(filePath, 'utf8');
    const dupFound = hasDuplicateKeys(raw);

    let data = dupFound ? parseFirstWins(raw) : JSON.parse(raw);

    // Fix legacy app title
    if (data.appTitle === 'Paideon' || data.appTitle === 'StudyLane') {
      data.appTitle = 'Lyceon';
    }

    // Add missing keys with English fallback
    let added = 0;
    for (const [key, val] of Object.entries(en)) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = val;
        added++;
      }
    }

    const changed = dupFound || added > 0;
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      const info = [];
      if (dupFound) info.push('duplicates removed');
      if (added)    info.push(`${added} keys added`);
      console.log(`✓ ${file}  (${info.join(', ')})`);
      updated++;
    } else {
      console.log(`  ${file}  (up to date)`);
      skipped++;
    }
  } catch (err) {
    console.error(`✗ ${file}  ERROR: ${err.message}`);
    errors++;
  }
}

console.log(`\n──────────────────────────────────────────`);
console.log(`  Updated : ${updated}`);
console.log(`  Skipped : ${skipped}`);
console.log(`  Errors  : ${errors}`);
console.log(`──────────────────────────────────────────`);
