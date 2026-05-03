'use strict';
/**
 * translate-missing.js — Translate missing locale keys in small batches
 *
 * Usage:
 *   node scripts/translate-missing.js --lang=de            # one locale
 *   node scripts/translate-missing.js --lang=de --batch=20 # batch size
 *   node scripts/translate-missing.js --all               # all locales sequentially
 *   node scripts/translate-missing.js --all --prefix=learnSch_mathematics  # only specific keys
 *
 * The script reads locales/en.json as the source, finds all keys missing
 * from the target locale, and translates them in batches using the free
 * Google Translate endpoint (same as fill-locales.js). It saves after
 * each batch so progress is never lost even if interrupted.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ROOT        = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const EN_FILE     = path.join(LOCALES_DIR, 'en.json');

// ── CLI args ─────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const ONLY_LANG  = (args.find(a => a.startsWith('--lang=')) || '').split('=')[1] || null;
const ALL        = args.includes('--all');
const BATCH_SIZE = parseInt((args.find(a => a.startsWith('--batch=')) || '--batch=25').split('=')[1], 10);
const DELAY_MS   = parseInt((args.find(a => a.startsWith('--delay=')) || '--delay=300').split('=')[1], 10);
const PREFIX     = (args.find(a => a.startsWith('--prefix=')) || '').split('=')[1] || null;
const DRY_RUN    = args.includes('--dry-run');

if (!ONLY_LANG && !ALL) {
  console.error('Usage: node scripts/translate-missing.js --lang=de  OR  --all');
  console.error('Options: --batch=25  --delay=300  --prefix=learnSch_mathematics  --dry-run');
  process.exit(1);
}

// ── Locale → Google Translate code ──────────────────────────────────────────
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
  uk:'uk', ur:'ur', uz:'uz', vi:'vi', yo:'yo', 'zh-TW':'zh-TW', zh:'zh',
  zu:'zu',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');

function gtTranslate(text, targetLang) {
  return new Promise((resolve, reject) => {
    if (targetLang === 'en') return resolve(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = (json[0] || []).map(p => p[0] || '').join('').trim();
          resolve(result || text);
        } catch { resolve(text); }
      });
    }).on('error', () => resolve(text));
  });
}

async function processLocale(localeCode, en) {
  const gtLang = LOCALE_TO_GT[localeCode] || localeCode.split('-')[0];
  if (gtLang === 'en') return; // skip English source

  const filePath = path.join(LOCALES_DIR, localeCode + '.json');
  if (!fs.existsSync(filePath)) return;

  const locale = readJson(filePath);

  // Find all missing keys (optionally filtered by prefix)
  let missingKeys = Object.keys(en).filter(k => {
    if (!locale[k]) return true;
    return false;
  });
  if (PREFIX) missingKeys = missingKeys.filter(k => k.startsWith(PREFIX));

  if (missingKeys.length === 0) {
    console.log(`  ${localeCode}: nothing missing${PREFIX ? ' (prefix: '+PREFIX+')' : ''}`);
    return;
  }

  console.log(`\n  ${localeCode} (${gtLang}): ${missingKeys.length} keys to translate, batch size ${BATCH_SIZE}`);

  let totalTranslated = 0;

  // Process in batches
  for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
    const batch = missingKeys.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(missingKeys.length / BATCH_SIZE);

    process.stdout.write(`    Batch ${batchNum}/${totalBatches} (keys ${i+1}–${Math.min(i+BATCH_SIZE, missingKeys.length)})... `);

    let batchTranslated = 0;
    for (const key of batch) {
      const english = en[key];
      if (!english) { locale[key] = ''; continue; }

      if (DRY_RUN) {
        console.log(`    [DRY] Would translate: "${key}" → "${english.slice(0,60)}..."`);
        continue;
      }

      try {
        const translated = await gtTranslate(english, gtLang);
        locale[key] = translated;
        batchTranslated++;
        totalTranslated++;
      } catch {
        locale[key] = english; // fallback to English
      }

      await sleep(DELAY_MS);
    }

    if (!DRY_RUN) {
      writeJson(filePath, locale);
      console.log(`saved (${batchTranslated} translated)`);
    } else {
      console.log('');
    }

    // Small pause between batches to avoid rate limiting
    if (i + BATCH_SIZE < missingKeys.length) {
      await sleep(DELAY_MS * 2);
    }
  }

  console.log(`  ✓ ${localeCode}: ${totalTranslated} keys translated and saved`);
}

async function main() {
  const en = readJson(EN_FILE);

  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .filter(code => code !== 'en');

  let targetLocales = [];
  if (ONLY_LANG) {
    targetLocales = [ONLY_LANG];
  } else if (ALL) {
    targetLocales = localeFiles;
  }

  // Check all target locales exist
  for (const code of targetLocales) {
    const p = path.join(LOCALES_DIR, code + '.json');
    if (!fs.existsSync(p)) {
      console.error(`Locale file not found: ${p}`);
      process.exit(1);
    }
  }

  console.log(`translate-missing.js`);
  console.log(`  Target: ${targetLocales.length} locale(s): ${targetLocales.join(', ')}`);
  console.log(`  Batch size: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms | Prefix filter: ${PREFIX || 'none'}`);
  if (DRY_RUN) console.log('  DRY RUN — no files will be written');
  console.log('');

  for (const code of targetLocales) {
    await processLocale(code, en);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
