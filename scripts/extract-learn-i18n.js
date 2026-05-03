#!/usr/bin/env node
/**
 * extract-learn-i18n.js
 *
 * Reads pages/learn/learn-content.js, extracts every translatable string
 * (subject title, folder name, description, keyPoints, miniTask, topics),
 * generates deterministic i18n key names, and:
 *
 *   1. Writes a JSON patch to merge into locales/en.json
 *   2. Writes an updated pages/learn/learn-content.js where every string
 *      value is replaced by its i18n key reference
 *
 * After running this script:
 *   node scripts/fill-locales.js --delay=80
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT        = path.join(__dirname, '..');
const CONTENT_FILE = path.join(ROOT, 'pages', 'learn', 'learn-content.js');
const EN_FILE      = path.join(ROOT, 'locales', 'en.json');

// ── Load learn-content.js via a sandbox ──────────────────────────────────────
function loadContent() {
  const src = fs.readFileSync(CONTENT_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window.LEARN_SOURCES;
}

// ── Key helpers ──────────────────────────────────────────────────────────────
function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);
}

// ── Generate all (key, value) pairs ─────────────────────────────────────────
function extractPairs(sources) {
  const pairs = {};   // key → English value
  const refs  = {};   // path in sources → key name  (for rebuilding the file)

  function registerSection(prefix, subject, sidx, mode) {
    const sp = `${prefix}_${slug(subject.id)}`;

    // Subject title
    const titleKey = `${sp}_title`;
    pairs[titleKey] = subject.title;

    (subject.folders || []).forEach((folder, fi) => {
      const fp = `${sp}_f${fi}`;

      const nameKey  = `${fp}_name`;
      const descKey  = `${fp}_desc`;
      const taskKey  = `${fp}_task`;

      pairs[nameKey] = folder.name;
      if (folder.description) pairs[descKey] = folder.description;
      if (folder.miniTask)    pairs[taskKey] = folder.miniTask;

      (folder.keyPoints || []).forEach((kp, ki) => {
        const kpKey = `${fp}_kp${ki}`;
        pairs[kpKey] = kp;
      });

      (folder.topics || []).forEach((tp, ti) => {
        const tpKey = `${fp}_tp${ti}`;
        pairs[tpKey] = tp;
      });
    });
  }

  (sources.school     || []).forEach((s, i) => registerSection('learnSch', s, i, 'school'));
  (sources.university || []).forEach((s, i) => registerSection('learnUni', s, i, 'university'));

  return pairs;
}

// ── Rebuild learn-content.js with key references ─────────────────────────────
function rebuildContent(sources, pairs) {
  // Reverse map: English value → key  (first key wins for duplicates)
  const valueToKey = {};
  for (const [key, val] of Object.entries(pairs)) {
    if (!(val in valueToKey)) valueToKey[val] = key;
  }

  function processSubjects(subjects, prefix) {
    return subjects.map((subject) => {
      const sp = `${prefix}_${slug(subject.id)}`;

      return {
        id: subject.id,
        title: `${sp}_title`,
        folders: (subject.folders || []).map((folder, fi) => {
          const fp = `${sp}_f${fi}`;
          return {
            name:        `${fp}_name`,
            description: folder.description ? `${fp}_desc` : '',
            keyPoints:   (folder.keyPoints || []).map((_, ki) => `${fp}_kp${ki}`),
            miniTask:    folder.miniTask    ? `${fp}_task` : '',
            topics:      (folder.topics    || []).map((_, ti) => `${fp}_tp${ti}`),
            sourceGroup: folder.sourceGroup,
          };
        }),
      };
    });
  }

  const newSources = {
    core: sources.core,  // leave source URLs as-is
    school:     processSubjects(sources.school     || [], 'learnSch'),
    university: processSubjects(sources.university || [], 'learnUni'),
  };

  const body = JSON.stringify(newSources, null, 2);
  return `(function () {\n  window.LEARN_SOURCES = ${body};\n})();\n`;
}

// ── Patch en.json ─────────────────────────────────────────────────────────────
function patchEnJson(pairs) {
  let raw = fs.readFileSync(EN_FILE, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const en = JSON.parse(raw);

  let added = 0;
  for (const [key, val] of Object.entries(pairs)) {
    if (!(key in en)) {
      en[key] = val;
      added++;
    }
  }

  fs.writeFileSync(EN_FILE, JSON.stringify(en, null, 2) + '\n', 'utf8');
  return added;
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('\n extract-learn-i18n.js\n');

  const sources = loadContent();
  console.log(`  Loaded learn-content.js`);

  const pairs = extractPairs(sources);
  console.log(`  Generated ${Object.keys(pairs).length} i18n keys`);

  // 1. Patch en.json
  const added = patchEnJson(pairs);
  console.log(`  Patched locales/en.json  (+${added} new keys)`);

  // 2. Rewrite learn-content.js
  const newContent = rebuildContent(sources, pairs);
  fs.writeFileSync(CONTENT_FILE, newContent, 'utf8');
  console.log(`  Rewrote pages/learn/learn-content.js with key references`);

  console.log('\n  Done! Now run:\n    node scripts/fill-locales.js --delay=80\n');
}

main();
