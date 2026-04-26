const fs = require('fs');
const src_file = 'i18n.js';
let src = fs.readFileSync(src_file, 'utf8');

const newCountry = `, ab: 'Аҳәынҭқарра', be: 'Краіна', bs: 'Zemlja', ca: 'País', da: 'Land', 'es-US': 'País', et: 'Riik', eu: 'Herrialdea', gl: 'País', ky: 'Өлкө', lt: 'Šalis', lv: 'Valsts', mt: 'Pajjiż', os: 'Бæстæ', sl: 'Država', tg: 'Кишвар', tk: 'Ýurt', uz: 'Mamlakat'`;

const newSchool = `, ab: 'Ашкол аамҭа', be: 'Працягласць школы', bs: 'Trajanje škole', ca: 'Durada escolar', da: 'Skolens varighed', 'es-US': 'Duración escolar', et: 'Kooli kestus', eu: 'Eskola-iraupena', gl: 'Duración escolar', ky: 'Мектептин узактыгы', lt: 'Mokyklos trukmė', lv: 'Skolas ilgums', mt: 'Tul tal-iskola', os: 'Скъолайы рæстæг', sl: 'Trajanje šole', tg: 'Давомнокии мактаб', tk: 'Mekdep dowamlylygы', uz: 'Maktab davomiyligi'`;

// Append to country block (ends with gn: 'Tetã'\n  },\n  schoolDuration:)
const countryOld = `gn: 'Tetã'\n  },\n  schoolDuration:`;
const countryNew = `gn: 'Tetã'` + newCountry + `\n  },\n  schoolDuration:`;

if (!src.includes(countryOld)) {
  console.error('ERROR: country marker not found');
  process.exit(1);
}
src = src.replace(countryOld, countryNew);

// Append to schoolDuration block (ends with gn: 'Yvyra'\n  }\n};)
const schoolOld = `gn: 'Yvyra'\n  }\n};`;
const schoolNew = `gn: 'Yvyra'` + newSchool + `\n  }\n};`;

if (!src.includes(schoolOld)) {
  console.error('ERROR: schoolDuration marker not found');
  process.exit(1);
}
src = src.replace(schoolOld, schoolNew);

fs.writeFileSync(src_file, src, 'utf8');
console.log('STATIC_LABELS updated successfully');
