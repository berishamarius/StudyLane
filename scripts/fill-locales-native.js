const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const baseFile = 'en.json';
const basePath = path.join(localesDir, baseFile);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJson = (filePath, data) => fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const toTargetLang = (localeCode) => {
  if (localeCode === 'zh-TW') return 'zh-TW';
  return localeCode.split('-')[0];
};

async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translate API failed (${response.status})`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.[0])) return text;
  return payload[0]
    .map((part) => (Array.isArray(part) ? (part[0] || '') : ''))
    .join('')
    .trim() || text;
}

async function run() {
  const base = readJson(basePath);
  const files = fs.readdirSync(localesDir).filter((name) => name.endsWith('.json'));

  let translatedFiles = 0;
  let translatedKeys = 0;

  for (const fileName of files) {
    const localeCode = fileName.replace(/\.json$/i, '');
    if (localeCode === 'en') continue;

    const filePath = path.join(localesDir, fileName);
    const locale = readJson(filePath);
    const targetLang = toTargetLang(localeCode);

    let changed = false;
    for (const [key, value] of Object.entries(base)) {
      if (locale[key]) continue;

      try {
        locale[key] = await translateText(value, targetLang);
        translatedKeys += 1;
      } catch {
        locale[key] = value;
      }
      changed = true;

      // Small delay to avoid rate limiting.
      await sleep(40);
    }

    if (changed) {
      writeJson(filePath, locale);
      translatedFiles += 1;
      process.stdout.write(`Updated ${fileName}\n`);
    }
  }

  process.stdout.write(`Done. Updated ${translatedFiles} file(s), filled ${translatedKeys} key(s).\n`);
}

run().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
