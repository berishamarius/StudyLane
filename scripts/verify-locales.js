const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const basePath = path.join(localesDir, 'en.json');

const NON_TRANSLATABLE_KEYS = new Set(['appTitle']);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

function run() {
  const english = readJson(basePath);
  const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));

  const unresolved = [];

  for (const file of files) {
    const code = file.replace(/\.json$/i, '');
    if (code === 'en') continue;

    const locale = readJson(path.join(localesDir, file));

    for (const [key, englishValue] of Object.entries(english)) {
      if (NON_TRANSLATABLE_KEYS.has(key)) continue;
      if (typeof englishValue !== 'string' || !englishValue.trim()) continue;

      const value = locale[key];
      if (typeof value !== 'string') {
        unresolved.push(`${file}:${key} (missing/non-string)`);
        continue;
      }

      if (value.trim() === englishValue.trim()) {
        unresolved.push(`${file}:${key} (still English)`);
      }
    }
  }

  if (!unresolved.length) {
    process.stdout.write('Verification passed: no English placeholders in non-English locales.\n');
    return;
  }

  process.stderr.write('Verification failed. Remaining entries:\n');
  for (const item of unresolved) {
    process.stderr.write(`- ${item}\n`);
  }
  process.exit(2);
}

run();
