#!/usr/bin/env node
/**
 * fill-locales.js — StudyLane locale auto-fill script
 *
 * Reads locales/en.json as the master key source.
 * For every other locale file it finds missing/untranslated keys,
 * calls the Google Translate free endpoint to translate them into the
 * target language's own script (including Arabic, Persian, CJK, RTL, etc.),
 * and writes the result back — preserving the original key order.
 *
 * Usage:
 *   node scripts/fill-locales.js              # fill only missing keys in all locales
 *   node scripts/fill-locales.js --force      # re-translate ALL keys in all locales
 *   node scripts/fill-locales.js --lang=de    # only process one locale
 *   node scripts/fill-locales.js --lang=ar --force
 *
 * Flags:
 *   --force         Re-translate even keys that already have a value (not equal to English)
 *   --lang=CODE     Only process the locale with this filename (e.g. ar, de, zh-TW)
 *   --dry-run       Print what would be translated but do not write files
 *   --delay=MS      Delay between individual key requests in ms (default: 150)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT        = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const EN_FILE     = path.join(LOCALES_DIR, 'en.json');

// ── CLI args ─────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const FORCE   = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');
const ONLY    = (args.find(a => a.startsWith('--lang=')) || '').split('=')[1] || null;
const DELAY   = parseInt((args.find(a => a.startsWith('--delay=')) || '--delay=150').split('=')[1], 10);

// ── Locale → Google Translate target language code ────────────────────────────
// Google Translate uses ISO 639-1 codes; Hebrew maps to 'iw', Chinese Traditional to 'zh-TW'
const LOCALE_TO_GT = {
  ab:    'ab',     // Abkhazian
  af:    'af',     // Afrikaans
  am:    'am',     // Amharic
  'ar-PS': 'ar',  // Arabic (Palestinian Standard) — translate to Arabic
  ar:    'ar',     // Arabic
  az:    'az',     // Azerbaijani
  be:    'be',     // Belarusian
  bg:    'bg',     // Bulgarian
  bn:    'bn',     // Bengali
  bs:    'bs',     // Bosnian
  ca:    'ca',     // Catalan
  cs:    'cs',     // Czech
  da:    'da',     // Danish
  de:    'de',     // German
  el:    'el',     // Greek
  'es-AR': 'es',  // Spanish (Argentina)
  'es-MX': 'es',  // Spanish (Mexico)
  'es-US': 'es',  // Spanish (US)
  'es-UY': 'es',  // Spanish (Uruguay)
  es:    'es',     // Spanish
  et:    'et',     // Estonian
  eu:    'eu',     // Basque
  fa:    'fa',     // Persian / Farsi
  fi:    'fi',     // Finnish
  fr:    'fr',     // French
  gl:    'gl',     // Galician
  gn:    'gn',     // Guarani
  gu:    'gu',     // Gujarati
  ha:    'ha',     // Hausa
  he:    'iw',     // Hebrew (Google uses 'iw')
  hi:    'hi',     // Hindi
  hr:    'hr',     // Croatian
  ht:    'ht',     // Haitian Creole
  hu:    'hu',     // Hungarian
  hy:    'hy',     // Armenian
  id:    'id',     // Indonesian
  ig:    'ig',     // Igbo
  it:    'it',     // Italian
  ja:    'ja',     // Japanese
  ka:    'ka',     // Georgian
  kk:    'kk',     // Kazakh
  ko:    'ko',     // Korean
  ku:    'ku',     // Kurdish (Kurmanji)
  ky:    'ky',     // Kyrgyz
  lt:    'lt',     // Lithuanian
  lv:    'lv',     // Latvian
  mk:    'mk',     // Macedonian
  mr:    'mr',     // Marathi
  ms:    'ms',     // Malay
  mt:    'mt',     // Maltese
  ne:    'ne',     // Nepali
  nl:    'nl',     // Dutch
  no:    'no',     // Norwegian
  om:    'om',     // Oromo
  os:    'os',     // Ossetian
  pl:    'pl',     // Polish
  ps:    'ps',     // Pashto
  pt:    'pt',     // Portuguese
  qu:    'qu',     // Quechua
  ro:    'ro',     // Romanian
  ru:    'ru',     // Russian
  rw:    'rw',     // Kinyarwanda
  si:    'si',     // Sinhala
  sk:    'sk',     // Slovak
  sl:    'sl',     // Slovenian
  so:    'so',     // Somali
  sq:    'sq',     // Albanian
  sr:    'sr',     // Serbian
  sw:    'sw',     // Swahili
  ta:    'ta',     // Tamil
  te:    'te',     // Telugu
  tg:    'tg',     // Tajik
  th:    'th',     // Thai
  tk:    'tk',     // Turkmen
  tl:    'tl',     // Filipino / Tagalog
  tr:    'tr',     // Turkish
  uk:    'uk',     // Ukrainian
  ur:    'ur',     // Urdu
  uz:    'uz',     // Uzbek
  vi:    'vi',     // Vietnamese
  yo:    'yo',     // Yoruba
  'zh-TW': 'zh-TW', // Chinese Traditional
  zh:    'zh',     // Chinese Simplified
  zu:    'zu',     // Zulu
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Translate `text` from English to `targetLang` using Google Translate's
 * public endpoint. Returns the original text on any network/parse error.
 */
function translateText(text, targetLang) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve(text); return; }

    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}` +
      `&dt=t&q=${encodeURIComponent(text)}`;

    const req = https.get(url, { timeout: 4000 }, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          // parsed[0] is an array of [translated, original, ...] pairs
          const translated = (parsed[0] || []).map(part => part[0] || '').join('');
          resolve(translated || text);
        } catch {
          resolve(text);
        }
      });
    });

    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
  });
}

/**
 * Load a locale JSON file. Returns {} if the file doesn't exist or is invalid.
 */
function loadLocale(filePath) {
  try {
    let raw = fs.readFileSync(filePath, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Check if a value is "untranslated" (still English).
 * A value is considered untranslated if it exactly matches the English value.
 * This may produce false positives for short strings like "OK", but is good enough.
 */
function isUntranslated(value, enValue) {
  return value === enValue;
}

// ── Main per-locale processing ────────────────────────────────────────────────
async function fillLocale(localeName, enData, allKeys) {
  const gtLang = LOCALE_TO_GT[localeName];
  if (!gtLang) {
    console.log(`  ⚠  ${localeName}: no Google Translate code mapped — skipped.`);
    return;
  }

  const filePath = path.join(LOCALES_DIR, `${localeName}.json`);
  const existing = loadLocale(filePath);

  // Determine which keys need translation
  const toTranslate = allKeys.filter(key => {
    if (FORCE) return true;
    if (!(key in existing)) return true;            // missing
    if (isUntranslated(existing[key], enData[key])) return true; // still English
    return false;
  });

  if (toTranslate.length === 0) {
    console.log(`  ✓  ${localeName} (${gtLang}): all ${allKeys.length} keys present.`);
    return;
  }

  console.log(`  →  ${localeName} (${gtLang}): translating ${toTranslate.length} / ${allKeys.length} keys...`);

  if (DRY_RUN) {
    console.log(`     [dry-run] would translate: ${toTranslate.slice(0, 5).join(', ')}${toTranslate.length > 5 ? ` … +${toTranslate.length - 5} more` : ''}`);
    return;
  }

  let done = 0;
  let errors = 0;

  for (const key of toTranslate) {
    const enValue = enData[key];
    try {
      const result = await translateText(enValue, gtLang);
      existing[key] = result;
      done++;
    } catch (err) {
      console.error(`     ✗ error translating key "${key}": ${err.message}`);
      existing[key] = enValue; // fallback to English
      errors++;
    }

    if (done % 25 === 0) {
      process.stdout.write(`     ${done}/${toTranslate.length} done...\r`);
    }

    await sleep(DELAY);
  }

  // Write back: output preserves the exact key order of en.json, adding
  // any leftover keys from the locale that aren't in en.json at the end.
  const output = {};
  for (const key of allKeys) {
    output[key] = existing[key] !== undefined ? existing[key] : enData[key];
  }
  // Preserve locale-specific extra keys (shouldn't happen in practice)
  for (const key of Object.keys(existing)) {
    if (!(key in output)) output[key] = existing[key];
  }

  fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`  ✓  ${localeName}: wrote ${done} translations${errors ? ` (${errors} errors → English fallback)` : ''}.`);
}

// ── Entry point ──────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║  StudyLane — Locale Fill Script            ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  if (FORCE)   console.log('  ⚠  --force: re-translating ALL keys');
  if (DRY_RUN) console.log('  ⚠  --dry-run: no files will be written');
  if (ONLY)    console.log(`  →  --lang=${ONLY}: processing single locale only`);
  console.log(`  ⏱  delay between requests: ${DELAY} ms`);
  console.log('');

  // Load master
  let enData;
  try {
    let raw = fs.readFileSync(EN_FILE, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // strip BOM
    enData = JSON.parse(raw);
  } catch (err) {
    console.error(`✗ Cannot read en.json: ${err.message}`);
    process.exit(1);
  }
  const allKeys = Object.keys(enData);
  console.log(`  Master: en.json — ${allKeys.length} keys`);
  console.log('');

  // Collect locales to process
  const allLocaleFiles = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json') && f !== 'en.json')
    .map(f => f.replace('.json', ''))
    .sort();

  const toProcess = ONLY ? [ONLY] : allLocaleFiles;

  // Validate --lang target
  if (ONLY && !allLocaleFiles.includes(ONLY) && !fs.existsSync(path.join(LOCALES_DIR, `${ONLY}.json`))) {
    console.error(`✗ Locale "${ONLY}" not found in ${LOCALES_DIR}`);
    process.exit(1);
  }

  console.log(`  Processing ${toProcess.length} locale(s)…`);
  console.log('');

  let localesDone = 0;
  for (const locale of toProcess) {
    await fillLocale(locale, enData, allKeys);
    localesDone++;
  }

  console.log('');
  console.log(`✅  Done — processed ${localesDone} locale(s).`);
  if (DRY_RUN) console.log('   (dry-run: no files were written)');
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
