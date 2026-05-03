#!/usr/bin/env node
/**
 * generate-vocab-locales.js — StudyLane  (v2 – inline translations)
 *
 * Adds locale-translated meanings DIRECTLY into each vocab JSON file.
 *
 * For each entry in locales/vocab/{lang}.json the script translates the
 * English meaning (field "en") into every applicable locale language and
 * stores the result under the locale's base language code key, e.g.:
 *
 *   german.json entry before:
 *     { "de": "Hallo", "en": "Hello", "ex_de": "...", "ex_en": "..." }
 *
 *   german.json entry after:
 *     { "de": "Hallo", "en": "Hello", "fr": "Bonjour", "ja": "こんにちは",
 *       "it": "Ciao", "ru": "Привет", ... (all non-de locales) ... }
 *
 * The app then resolves: entry[currentLang] || entry[baseLang] || entry.en
 *
 * Exclusion rules (native speakers don't need that vocab tab at all):
 *   german.json   → skip: de
 *   french.json   → skip: fr
 *   spanish.json  → skip: es, es-AR, es-MX, es-US, es-UY
 *   arabic.json   → skip: ar, ar-PS
 *   chinese.json  → skip: zh, zh-TW
 *   latin.json    → skip: nobody (dead language, all locales get it)
 *   english.json  → skip: en  (de key already present in the file)
 *
 * Usage:
 *   node scripts/generate-vocab-locales.js                  # all 7 vocab files
 *   node scripts/generate-vocab-locales.js --lang=german    # one vocab file
 *   node scripts/generate-vocab-locales.js --gtlang=ja      # one target GT lang only
 *   node scripts/generate-vocab-locales.js --force          # re-translate existing keys
 *   node scripts/generate-vocab-locales.js --dry-run        # preview only
 *   node scripts/generate-vocab-locales.js --delay=80       # ms between requests (default 60)
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT      = path.join(__dirname, '..');
const VOCAB_DIR = path.join(ROOT, 'locales', 'vocab');

// ── CLI flags ─────────────────────────────────────────────────────────────────
const argv        = process.argv.slice(2);
const FORCE       = argv.includes('--force');
const DRY_RUN     = argv.includes('--dry-run');
const ONLY_LANG   = (argv.find(a => a.startsWith('--lang='))   || '').split('=')[1] || null;
const ONLY_GTLANG = (argv.find(a => a.startsWith('--gtlang=')) || '').split('=')[1] || null;
const DELAY       = parseInt((argv.find(a => a.startsWith('--delay=')) || '--delay=60').split('=')[1], 10);

// ── Locale code → Google Translate code ───────────────────────────────────────
// Dialect variants sharing a GT code are deduplicated at translation time.
// The storage key written into each vocab entry = canonical base locale code.
const LOCALE_TO_GT = {
  ab:'ab', af:'af', am:'am', 'ar-PS':'ar', ar:'ar', az:'az', be:'be',
  bg:'bg', bn:'bn', bs:'bs', ca:'ca', cs:'cs', da:'da', de:'de', el:'el',
  'es-AR':'es', 'es-MX':'es', 'es-US':'es', 'es-UY':'es', es:'es',
  et:'et', eu:'eu', fa:'fa', fi:'fi', fr:'fr', gl:'gl', gn:'gn', gu:'gu',
  ha:'ha', he:'iw', hi:'hi', hr:'hr', ht:'ht', hu:'hu', hy:'hy', id:'id',
  ig:'ig', it:'it', ja:'ja', ka:'ka', kk:'kk', ko:'ko', ku:'ku', ky:'ky',
  lt:'lt', lv:'lv', mk:'mk', mr:'mr', ms:'ms', mt:'mt', ne:'ne', nl:'nl',
  no:'no', om:'om', os:'os', pl:'pl', ps:'ps', pt:'pt', qu:'qu', ro:'ro',
  ru:'ru', rw:'rw', si:'si', sk:'sk', sl:'sl', so:'so', sq:'sq', sr:'sr',
  sw:'sw', ta:'ta', te:'te', tg:'tg', th:'th', tk:'tk', tl:'tl', tr:'tr',
  uk:'uk', ur:'ur', uz:'uz', vi:'vi', yo:'yo', 'zh-TW':'zh-TW', zh:'zh', zu:'zu',
};

// Maps a locale to the storage key used inside the vocab entry.
// Dialect variants map to their base code (app falls back: 'es-AR' → 'es').
// Special: 'he' stored as 'he' (GT uses 'iw' but we keep the locale code).
function storageKey(locale) {
  const dialectBases = { 'es-AR':'es','es-MX':'es','es-US':'es','es-UY':'es','ar-PS':'ar' };
  return dialectBases[locale] || locale;
}

// ── Vocab configs ─────────────────────────────────────────────────────────────
const VOCAB_CONFIGS = [
  { file: 'german',  skip: new Set(['de']) },
  { file: 'french',  skip: new Set(['fr']) },
  { file: 'spanish', skip: new Set(['es', 'es-AR', 'es-MX', 'es-US', 'es-UY']) },
  { file: 'arabic',  skip: new Set(['ar', 'ar-PS']) },
  { file: 'chinese', skip: new Set(['zh', 'zh-TW']) },
  { file: 'latin',   skip: new Set([]) },
  { file: 'english', skip: new Set(['en']) },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);
  } catch { return null; }
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function translateText(text, gtLang) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve(text); return; }
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=en&tl=${encodeURIComponent(gtLang)}` +
      `&dt=t&q=${encodeURIComponent(text)}`;
    const req = https.get(url, { timeout: 6000 }, (res) => {
      let raw = '';
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          const translated = (parsed[0] || []).map(p => p[0] || '').join('');
          resolve(translated || text);
        } catch { resolve(text); }
      });
    });
    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  StudyLane — Vocab Inline Translation Generator  (v2)   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (DRY_RUN)     console.log('  ⚠  --dry-run: no files will be written');
  if (FORCE)       console.log('  ⚠  --force: re-translating existing keys');
  if (ONLY_LANG)   console.log(`  →  --lang=${ONLY_LANG}: only that vocab file`);
  if (ONLY_GTLANG) console.log(`  →  --gtlang=${ONLY_GTLANG}: only that GT language`);
  console.log(`  ⏱  delay between requests: ${DELAY} ms\n`);

  // All locale codes from locales/*.json
  const allLocales = fs.readdirSync(path.join(ROOT, 'locales'))
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => f.replace(/\.json$/, ''))
    .filter(l => LOCALE_TO_GT[l]);

  // Build deduplicated (gtCode, storageKey) targets for a given vocab skip-set.
  function buildTargets(skipSet) {
    const seen = new Set();
    const targets = [];
    for (const locale of allLocales) {
      if (skipSet.has(locale)) continue;
      const gtCode = LOCALE_TO_GT[locale];
      const sKey   = storageKey(locale);
      if (seen.has(sKey)) continue;          // same GT code already scheduled
      if (gtCode === 'en') continue;         // English is the source, not a target
      if (ONLY_GTLANG && gtCode !== ONLY_GTLANG) continue;
      seen.add(sKey);
      targets.push({ gtCode, sKey });
    }
    return targets;
  }

  const configs = ONLY_LANG
    ? VOCAB_CONFIGS.filter(c => c.file === ONLY_LANG)
    : VOCAB_CONFIGS;

  if (!configs.length) {
    console.error(`  ✗  No config for --lang=${ONLY_LANG}. Valid: ${VOCAB_CONFIGS.map(c => c.file).join(', ')}`);
    process.exit(1);
  }

  for (const config of configs) {
    const vocabFile = path.join(VOCAB_DIR, `${config.file}.json`);
    if (!fs.existsSync(vocabFile)) { console.warn(`  ⚠  ${config.file}.json not found.`); continue; }

    const vocabData = loadJson(vocabFile);
    if (!vocabData)  { console.warn(`  ⚠  ${config.file}.json parse error.`);            continue; }

    const cats       = Object.entries(vocabData.categories || {});
    const entryCount = cats.reduce((n, [, c]) => n + (c.entries || []).length, 0);
    const targets    = buildTargets(config.skip);

    console.log(`\n  📚  ${config.file}.json  (${cats.length} cats, ${entryCount} entries)`);
    console.log(`      Skip native: [${[...config.skip].join(', ') || 'none'}]`);
    console.log(`      Targets (${targets.length}): ${targets.map(t => t.sKey).slice(0,14).join(', ')}${targets.length > 14 ? ' …' : ''}\n`);

    let totalNew = 0;

    for (const { gtCode, sKey } of targets) {
      const allPresent = !FORCE && cats.every(([, cat]) =>
        (cat.entries || []).every(e => sKey in e));

      if (allPresent) {
        console.log(`    ✓  ${sKey}: all ${entryCount} entries present — skipped.`);
        continue;
      }

      if (DRY_RUN) {
        console.log(`    →  ${sKey} (${gtCode}): [dry-run] ${entryCount} entries`);
        continue;
      }

      let done = 0;
      for (const [, cat] of cats) {
        for (const entry of cat.entries || []) {
          if (!FORCE && sKey in entry) { done++; continue; }
          const src = entry.en || '';
          entry[sKey] = src ? await translateText(src, gtCode) : '';
          done++; totalNew++;
          if (done % 50 === 0) process.stdout.write(`    ${sKey}: ${done}/${entryCount}…\r`);
          await sleep(DELAY);
        }
      }
      console.log(`    ✓  ${sKey} (${gtCode}): ${done} entries.`);
    }

    if (!DRY_RUN) {
      writeJson(vocabFile, vocabData);
      console.log(`  ✅  ${config.file}.json saved (+${totalNew} new translations).`);
    }
  }

  console.log('\n  ✅  All done.\n');
}

main().catch(err => {
  console.error('\n  ✗  Fatal:', err.message);
  process.exit(1);
});

const FORCE    = argv.includes('--force');
const DRY_RUN  = argv.includes('--dry-run');
const ONLY_LANG   = (argv.find(a => a.startsWith('--lang='))   || '').split('=')[1] || null;
const ONLY_LOCALE = (argv.find(a => a.startsWith('--locale=')) || '').split('=')[1] || null;
const DELAY    = parseInt((argv.find(a => a.startsWith('--delay=')) || '--delay=60').split('=')[1], 10);

// ── Locale → Google Translate code ───────────────────────────────────────────
const LOCALE_TO_GT = {
  ab:'ab', af:'af', am:'am', 'ar-PS':'ar', ar:'ar', az:'az', be:'be',
  bg:'bg', bn:'bn', bs:'bs', ca:'ca', cs:'cs', da:'da', de:'de', el:'el',
  'es-AR':'es', 'es-MX':'es', 'es-US':'es', 'es-UY':'es', es:'es',
  et:'et', eu:'eu', fa:'fa', fi:'fi', fr:'fr', gl:'gl', gn:'gn', gu:'gu',
  ha:'ha', he:'iw', hi:'hi', hr:'hr', ht:'ht', hu:'hu', hy:'hy', id:'id',
  ig:'ig', it:'it', ja:'ja', ka:'ka', kk:'kk', ko:'ko', ku:'ku', ky:'ky',
  lt:'lt', lv:'lv', mk:'mk', mr:'mr', ms:'ms', mt:'mt', ne:'ne', nl:'nl',
  no:'no', om:'om', os:'os', pl:'pl', ps:'ps', pt:'pt', qu:'qu', ro:'ro',
  ru:'ru', rw:'rw', si:'si', sk:'sk', sl:'sl', so:'so', sq:'sq', sr:'sr',
  sw:'sw', ta:'ta', te:'te', tg:'tg', th:'th', tk:'tk', tl:'tl', tr:'tr',
  uk:'uk', ur:'ur', uz:'uz', vi:'vi', yo:'yo', 'zh-TW':'zh-TW', zh:'zh', zu:'zu',
};

// ── Vocab configs ─────────────────────────────────────────────────────────────
// transKey: the English field used as translation source
// exKey:    the English example field (for translating the example sentence)
const VOCAB_CONFIGS = [
  { file: 'german',  transKey: 'en', exKey: 'ex_en', skip: new Set(['de']) },
  { file: 'french',  transKey: 'en', exKey: 'ex_en', skip: new Set(['fr']) },
  { file: 'spanish', transKey: 'en', exKey: 'ex_en', skip: new Set(['es', 'es-AR', 'es-MX', 'es-US', 'es-UY']) },
  { file: 'arabic',  transKey: 'en', exKey: 'ex_en', skip: new Set(['ar', 'ar-PS']) },
  { file: 'chinese', transKey: 'en', exKey: 'ex_en', skip: new Set(['zh', 'zh-TW']) },
  { file: 'latin',   transKey: 'en', exKey: 'ex_en', skip: new Set([]) },          // all get Latin
  { file: 'english', transKey: 'en', exKey: 'ex_en', skip: new Set(['en']) },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function loadJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);
  } catch {
    return null;
  }
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function translateText(text, gtLang) {
  return new Promise((resolve) => {
    if (!text || !text.trim() || gtLang === 'en') { resolve(text); return; }

    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=en&tl=${encodeURIComponent(gtLang)}` +
      `&dt=t&q=${encodeURIComponent(text)}`;

    const req = https.get(url, { timeout: 5000 }, (res) => {
      let raw = '';
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          const translated = (parsed[0] || []).map(p => p[0] || '').join('');
          resolve(translated || text);
        } catch { resolve(text); }
      });
    });
    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
  });
}

// ── Per-locale generator ──────────────────────────────────────────────────────
async function generateOverlay(vocabData, config, locale) {
  const gtLang = LOCALE_TO_GT[locale];
  if (!gtLang) {
    console.log(`    ⚠  ${locale}: no Google Translate mapping — skipped.`);
    return;
  }
  if (gtLang === 'en') {
    // Target IS English → no overlay needed (base file already has English)
    console.log(`    ✓  ${locale}: base file is English — no overlay needed.`);
    return;
  }

  const outFile = path.join(VOCAB_DIR, config.file, `${locale}.json`);

  if (!FORCE && fs.existsSync(outFile)) {
    console.log(`    ✓  ${locale}: already exists — skipped. (--force to redo)`);
    return;
  }

  if (DRY_RUN) {
    console.log(`    →  ${locale} (${gtLang}): [dry-run] would generate ${outFile.split(path.sep).slice(-3).join('/')}`);
    return;
  }

  const overlay = { categories: {} };
  const categories = Object.entries(vocabData.categories || {});

  for (const [catKey, cat] of categories) {
    const entries = cat.entries || [];
    const overlayEntries = [];

    for (const entry of entries) {
      const transSource = entry[config.transKey] || '';
      const exSource    = entry[config.exKey]    || '';

      const trans    = await translateText(transSource, gtLang);
      await sleep(DELAY);
      const ex_trans = exSource ? await translateText(exSource, gtLang) : '';
      if (exSource) await sleep(DELAY);

      overlayEntries.push({ trans, ex_trans });
    }

    overlay.categories[catKey] = { entries: overlayEntries };
  }

  writeJson(outFile, overlay);
  const total = categories.reduce((n, [, c]) => n + (c.entries || []).length, 0);
  console.log(`    ✓  ${locale} (${gtLang}): wrote ${total} entries → ${path.relative(ROOT, outFile)}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  StudyLane — Vocab Locale Generator                  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (DRY_RUN)     console.log('  ⚠  --dry-run: no files will be written');
  if (FORCE)       console.log('  ⚠  --force: re-translating existing overlays');
  if (ONLY_LANG)   console.log(`  →  --lang=${ONLY_LANG}: only processing that language`);
  if (ONLY_LOCALE) console.log(`  →  --locale=${ONLY_LOCALE}: only processing that locale`);
  console.log(`  ⏱  delay between requests: ${DELAY} ms\n`);

  // Discover all locale codes from locales/*.json
  const allLocales = fs.readdirSync(path.join(ROOT, 'locales'))
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => f.replace(/\.json$/, ''))
    .filter(l => LOCALE_TO_GT[l]); // only known locales

  const configs = ONLY_LANG
    ? VOCAB_CONFIGS.filter(c => c.file === ONLY_LANG)
    : VOCAB_CONFIGS;

  if (configs.length === 0) {
    console.error(`  ✗  No config found for --lang=${ONLY_LANG}`);
    console.error(`     Valid values: ${VOCAB_CONFIGS.map(c => c.file).join(', ')}`);
    process.exit(1);
  }

  for (const config of configs) {
    const vocabFile = path.join(VOCAB_DIR, `${config.file}.json`);
    if (!fs.existsSync(vocabFile)) {
      console.warn(`  ⚠  ${config.file}.json not found — skipped.`);
      continue;
    }

    const vocabData = loadJson(vocabFile);
    if (!vocabData) {
      console.warn(`  ⚠  ${config.file}.json could not be parsed — skipped.`);
      continue;
    }

    const targets = ONLY_LOCALE
      ? [ONLY_LOCALE]
      : allLocales.filter(l => !config.skip.has(l));

    const catCount = Object.keys(vocabData.categories || {}).length;
    const entryCount = Object.values(vocabData.categories || {})
      .reduce((n, c) => n + (c.entries || []).length, 0);

    console.log(`\n  📚  ${config.file}.json  (${catCount} categories, ${entryCount} entries)`);
    console.log(`      Skipping native: [${[...config.skip].join(', ') || 'none'}]`);
    console.log(`      Target locales (${targets.length}): ${targets.slice(0,10).join(', ')}${targets.length > 10 ? ` … +${targets.length - 10} more` : ''}\n`);

    for (const locale of targets) {
      await generateOverlay(vocabData, config, locale);
    }
  }

  console.log('\n  ✅  All done.\n');
}

main().catch(err => {
  console.error('\n  ✗  Fatal error:', err.message);
  process.exit(1);
});
