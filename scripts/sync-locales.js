const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const baseLocale = 'en.json';
const basePath = path.join(localesDir, baseLocale);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const base = readJson(basePath);
const files = fs.readdirSync(localesDir).filter((file) => file.endsWith('.json'));

let updatedCount = 0;
for (const file of files) {
  const filePath = path.join(localesDir, file);
  const current = readJson(filePath);

  let changed = false;
  for (const [key, value] of Object.entries(base)) {
    if (!(key in current)) {
      current[key] = value;
      changed = true;
    }
  }

  if (changed) {
    writeJson(filePath, current);
    updatedCount += 1;
  }
}

console.log(`Locale sync complete. Updated ${updatedCount} file(s).`);
