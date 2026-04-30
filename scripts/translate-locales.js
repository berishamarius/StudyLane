const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const baseLocaleFile = 'en.json';
const baseLocalePath = path.join(localesDir, baseLocaleFile);

const REQUEST_DELAY_MS = 45;
const RETRIES = 3;
const RETRY_BACKOFF_MS = 350;

const NON_TRANSLATABLE_KEYS = new Set([
  'appTitle',
]);

const SHARED_TERMS = new Set([
  'IServ',
  'Moodle',
  'WebUntis',
  'Logineo NRW',
  'HPI School Cloud',
  'Microsoft Teams',
  'ECTS',
  'Dashboard',
  'Semester',
]);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJson = (filePath, data) => fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeTargetLanguage = (localeCode) => {
  if (!localeCode) return 'en';
  if (localeCode.toLowerCase() === 'zh-tw') return 'zh-TW';
  const [base] = localeCode.split('-');
  return base || 'en';
};

const shouldTranslateValue = ({ key, englishValue, currentValue }) => {
  if (NON_TRANSLATABLE_KEYS.has(key)) return false;
  if (typeof englishValue !== 'string') return false;
  if (!englishValue.trim()) return false;

  if (currentValue === undefined || currentValue === null) return true;
  if (typeof currentValue !== 'string') return false;

  const normalizedCurrent = currentValue.trim();
  const normalizedEnglish = englishValue.trim();

  // Translate if the locale still has English fallback text.
  if (!normalizedCurrent) return true;
  if (normalizedCurrent === key) return true;
  if (normalizedCurrent === normalizedEnglish) return true;

  return false;
};

const isLikelyEnglishPlaceholder = (value, englishValue) => {
  if (typeof value !== 'string' || typeof englishValue !== 'string') return false;
  const v = value.trim();
  const e = englishValue.trim();
  if (!v || !e) return false;
  return v === e;
};

const isAllowedSharedTerm = (value) => {
  if (typeof value !== 'string') return false;
  const normalized = value.trim();
  if (!normalized) return false;
  if (SHARED_TERMS.has(normalized)) return true;
  if (/^https?:\/\//i.test(normalized)) return true;
  if (/^[A-Z0-9+.-]{2,8}$/.test(normalized)) return true;
  return false;
};

const shouldStrictlyEnforceTranslation = (englishValue) => {
  if (typeof englishValue !== 'string') return false;
  const value = englishValue.trim();
  if (!value) return false;
  return /\s/.test(value);
};

async function translateText(text, targetLang) {
  if (!text) return text;
  if (targetLang === 'en') return text;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Translate request failed with status ${response.status}`);
      }

      const payload = await response.json();
      if (!Array.isArray(payload?.[0])) return text;

      const translated = payload[0]
        .map((part) => (Array.isArray(part) ? (part[0] || '') : ''))
        .join('')
        .trim();

      return translated || text;
    } catch (error) {
      if (attempt === RETRIES) {
        throw error;
      }
      await sleep(RETRY_BACKOFF_MS * attempt);
    }
  }

  return text;
}

async function run() {
  const english = readJson(baseLocalePath);
  const localeFiles = fs.readdirSync(localesDir).filter((name) => name.endsWith('.json'));

  let touchedFiles = 0;
  let translatedCount = 0;
  let insertedWithoutTranslation = 0;
  const unresolved = [];

  for (const localeFile of localeFiles) {
    const localeCode = localeFile.replace(/\.json$/i, '');
    if (localeCode === 'en') continue;

    const localePath = path.join(localesDir, localeFile);
    const locale = readJson(localePath);
    const targetLang = normalizeTargetLanguage(localeCode);

    let changed = false;

    for (const [key, englishValue] of Object.entries(english)) {
      const currentValue = locale[key];
      const needsTranslation = shouldTranslateValue({ key, englishValue, currentValue });
      if (!needsTranslation) continue;

      if (typeof englishValue !== 'string') {
        locale[key] = englishValue;
        changed = true;
        insertedWithoutTranslation += 1;
        continue;
      }

      try {
        locale[key] = await translateText(englishValue, targetLang);
        translatedCount += 1;
      } catch {
        // Fallback keeps app usable when translation endpoint rate-limits.
        locale[key] = englishValue;
        insertedWithoutTranslation += 1;
      }

      changed = true;
      await sleep(REQUEST_DELAY_MS);
    }

    if (changed) {
      writeJson(localePath, locale);
      touchedFiles += 1;
      process.stdout.write(`Updated ${localeFile}\n`);
    }

    // Strict validation: no English placeholders for keys from en.json.
    for (const [key, englishValue] of Object.entries(english)) {
      if (NON_TRANSLATABLE_KEYS.has(key)) continue;
      if (typeof englishValue !== 'string' || !englishValue.trim()) continue;
      if (!isLikelyEnglishPlaceholder(locale[key], englishValue)) continue;

      try {
        locale[key] = await translateText(englishValue, targetLang);
        translatedCount += 1;
      } catch {
        // Keep unresolved key in report.
      }

      if (
        shouldStrictlyEnforceTranslation(englishValue)
        && isLikelyEnglishPlaceholder(locale[key], englishValue)
        && !isAllowedSharedTerm(locale[key])
      ) {
        unresolved.push(`${localeFile}:${key}`);
      }

      await sleep(REQUEST_DELAY_MS);
    }

    if (unresolved.some((entry) => entry.startsWith(`${localeFile}:`))) {
      writeJson(localePath, locale);
    }
  }

  process.stdout.write(
    [
      'Locale translation sync complete.',
      `Locales scanned: ${localeFiles.length}.`,
      `Locales updated: ${touchedFiles}.`,
      `Translated values: ${translatedCount}.`,
      `Fallback values used: ${insertedWithoutTranslation}.`,
    ].join(' '),
  );
  process.stdout.write('\n');

  if (unresolved.length) {
    process.stderr.write('Unresolved English placeholders found:\n');
    for (const entry of unresolved) {
      process.stderr.write(`- ${entry}\n`);
    }
    process.exit(2);
  }
}

run().catch((error) => {
  process.stderr.write(`Locale translation sync failed: ${error.message}\n`);
  process.exit(1);
});
