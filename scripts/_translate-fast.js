/**
 * _translate-fast.js
 * Faster batch translator:
 * - Groups up to BATCH_SIZE values per single API call (joined by |||)
 * - Processes CONCURRENT_LOCALES locale files in parallel
 * - Only translates keys still equal to their English value (new/missing)
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.json');

const BATCH_SIZE = 20;          // keys per API call
const CONCURRENT_LOCALES = 6;   // parallel locale files
const DELAY_BETWEEN_BATCHES = 80; // ms between batches within a locale
const RETRIES = 3;
const SEP = ' ||| ';

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const normalizeTargetLanguage = (code) => {
  if (!code) return 'en';
  if (code.toLowerCase() === 'zh-tw') return 'zh-TW';
  return code.split('-')[0];
};

async function translateBatch(texts, targetLang) {
  const joined = texts.join(SEP);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(joined)}`;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (!Array.isArray(payload?.[0])) return texts;
      const combined = payload[0].map(p => (Array.isArray(p) ? p[0] : '')).join('').trim();
      const parts = combined.split(/\s*\|\|\|\s*/);
      // Pad if Google collapses some separators
      while (parts.length < texts.length) parts.push('');
      return parts.map((p, i) => p.trim() || texts[i]);
    } catch (e) {
      if (attempt === RETRIES) return texts; // fallback
      await sleep(150 * attempt);
    }
  }
  return texts;
}

async function processLocale(localeFile, english, pendingKeys) {
  const localeCode = localeFile.replace(/\.json$/, '');
  if (localeCode === 'en') return;

  const targetLang = normalizeTargetLanguage(localeCode);
  const localePath = path.join(LOCALES_DIR, localeFile);
  const locale = readJson(localePath);

  // Only translate keys that are still equal to English (added by fill-missing-keys)
  const toTranslate = pendingKeys.filter(k => {
    const cur = locale[k];
    const eng = english[k];
    return typeof cur === 'string' && typeof eng === 'string' && cur.trim() === eng.trim();
  });

  if (!toTranslate.length) {
    process.stdout.write(`  skip ${localeFile} (nothing to do)\n`);
    return;
  }

  let changed = 0;
  // Process in batches
  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    const chunk = toTranslate.slice(i, i + BATCH_SIZE);
    const values = chunk.map(k => english[k]);
    const translated = await translateBatch(values, targetLang);
    chunk.forEach((k, idx) => {
      if (translated[idx] && translated[idx] !== english[k]) {
        locale[k] = translated[idx];
        changed++;
      }
    });
    await sleep(DELAY_BETWEEN_BATCHES);
  }

  writeJson(localePath, locale);
  process.stdout.write(`  \u2713 ${localeFile}: translated ${changed}/${toTranslate.length} keys\n`);
}

async function run() {
  const english = readJson(EN_FILE);
  const allFiles = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');

  // Keys that are new (added by batches) — detect by checking which ones are still English in most locales
  // We translate ALL keys that are equal to English in each locale
  const pendingKeys = Object.keys(english);

  console.log(`Translating ${pendingKeys.length} keys across ${allFiles.length} locale files...`);
  console.log(`Batch size: ${BATCH_SIZE}, Concurrent locales: ${CONCURRENT_LOCALES}\n`);

  // Process in chunks of CONCURRENT_LOCALES
  for (let i = 0; i < allFiles.length; i += CONCURRENT_LOCALES) {
    const chunk = allFiles.slice(i, i + CONCURRENT_LOCALES);
    await Promise.all(chunk.map(f => processLocale(f, english, pendingKeys)));
    process.stdout.write(`--- Batch ${Math.floor(i / CONCURRENT_LOCALES) + 1}/${Math.ceil(allFiles.length / CONCURRENT_LOCALES)} done ---\n`);
  }

  console.log('\nAll done!');
}

run().catch(console.error);
