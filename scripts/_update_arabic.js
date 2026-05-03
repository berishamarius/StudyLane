const fs = require('fs'), path = require('path');
const enPath = path.join(__dirname, '..', 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en['learnSch_arabic_language_f0_desc'] = 'Arabic is written right-to-left (RTL) using 28 letters. Letter shapes change depending on position in a word (initial, medial, final, isolated). Arabic uses Eastern Arabic-Indic numerals (\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669) \u2014 the Western digits 0\u20139 are historically derived from these.';

en['learnSch_arabic_language_f0_kp3'] = 'Arabic uses Eastern Arabic-Indic numerals: \u0660 \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 (0\u20139). The Western digits 0-9 evolved from these via medieval Islamic mathematics \u2014 the term "Arabic numerals" in the West actually refers to these Eastern originals.';

en['learnSch_arabic_language_f0_task'] = 'Write the numbers 1\u201310 in Eastern Arabic-Indic numerals (\u0661 \u0662 \u0663 ...). Compare each with its Western counterpart. Then write the Arabic word for "number" (\u0631\u0642\u0645 \u2013 raqm).';

en['learnSch_arabic_language_f0_tp2'] = 'Eastern Arabic-Indic Numerals';

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('Arabic numeral note updated. Total keys:', Object.keys(en).length);
