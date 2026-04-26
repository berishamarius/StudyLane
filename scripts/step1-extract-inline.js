/**
 * Step 1: Extract inline TRANSLATIONS from i18n.js and save as locale JSON files.
 * Only creates files that don't already exist.
 */
const fs   = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const localesDir = path.join(projectDir, 'locales');
const src        = fs.readFileSync(path.join(projectDir, 'i18n.js'), 'utf8');

// Wrap src in a function so `const` declarations are local and can be returned.
// Stub out browser globals that would cause a ReferenceError at function-definition time.
const wrapper = `
  var window = {}, document = {
    getElementById: function(){return null;},
    querySelector: function(){return null;},
    querySelectorAll: function(){return [];},
    addEventListener: function(){},
    createElement: function(){return {style:{},classList:{add:function(){},remove:function(){}}};},
    body: {appendChild:function(){},classList:{toggle:function(){}}},
  }, navigator = {language:'en'},
  localStorage = {getItem:function(){return null;},setItem:function(){}},
  fetch = function(){return Promise.resolve({ok:true,json:function(){return Promise.resolve({});}});},
  setTimeout = function(){}, clearTimeout = function(){},
  requestAnimationFrame = function(){},
  location = {search:'',href:''};

${src}

return typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : null;
`;

let TRANSLATIONS;
try {
  // eslint-disable-next-line no-new-func
  TRANSLATIONS = new Function(wrapper)();
} catch (e) {
  console.error('Failed to extract TRANSLATIONS:', e.message);
  process.exit(1);
}

if (!TRANSLATIONS) {
  console.error('TRANSLATIONS is null/undefined after execution.');
  process.exit(1);
}
const langs = Object.keys(TRANSLATIONS);
console.log('Inline languages found:', langs.join(', '));

let created = 0, skipped = 0;

for (const lang of langs) {
  const file = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    console.log(`  SKIP  (exists): locales/${lang}.json`);
    skipped++;
  } else {
    fs.writeFileSync(file, JSON.stringify(TRANSLATIONS[lang], null, 2) + '\n', 'utf8');
    console.log(`  CREATE        : locales/${lang}.json`);
    created++;
  }
}

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
