const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');

const COUNTRY = {
  'af':    'Land',
  'am':    'አገር',
  'ar-PS': 'دولة',
  'az':    'Ölkə',
  'bg':    'Държава',
  'bn':    'দেশ',
  'cs':    'Země',
  'el':    'Χώρα',
  'es-AR': 'País',
  'es-MX': 'País',
  'es-UY': 'País',
  'fa':    'کشور',
  'fi':    'Maa',
  'gn':    'Tetã',
  'gu':    'દેશ',
  'ha':    'Ƙasa',
  'he':    'מדינה',
  'hr':    'Država',
  'ht':    'Peyi',
  'hu':    'Ország',
  'hy':    'Երկիր',
  'id':    'Negara',
  'ig':    'Mba',
  'ka':    'ქვეყანა',
  'kk':    'Ел',
  'ku':    'Welat',
  'mk':    'Држава',
  'mr':    'देश',
  'ms':    'Negara',
  'ne':    'देश',
  'nl':    'Land',
  'no':    'Land',
  'om':    'Biyya',
  'ps':    'هېواد',
  'qu':    'Runa simi',
  'ro':    'Țară',
  'rw':    'Igihugu',
  'si':    'රට',
  'sk':    'Krajina',
  'so':    'Dalka',
  'sr':    'Земља',
  'sw':    'Nchi',
  'ta':    'நாடு',
  'te':    'దేశం',
  'th':    'ประเทศ',
  'tl':    'Bansa',
  'ur':    'ملک',
  'vi':    'Quốc gia',
  'yo':    "Orílẹ̀-èdè",
  'zu':    'Izwe',
};

const SCHOOL_DURATION = {
  'af':    'Skoolduur',
  'am':    'የትምህርት ጊዜ',
  'ar-PS': 'مدة المدرسة',
  'az':    'Məktəb müddəti',
  'bg':    'Продължителност на училището',
  'bn':    'বিদ্যালয়ের দৈর্ঘ্য',
  'cs':    'Délka školy',
  'el':    'Διάρκεια σχολείου',
  'es-AR': 'Duración escolar',
  'es-MX': 'Duración escolar',
  'es-UY': 'Duración escolar',
  'fa':    'مدت مدرسه',
  'fi':    'Koulun kesto',
  'gn':    'Yvyra pe mba\'e',
  'gu':    'શાળાની આગવી સમયગાળો',
  'ha':    'Tsawon makaranta',
  'he':    'משך בית הספר',
  'hr':    'Trajanje škole',
  'ht':    'Dire lekòl la',
  'hu':    'Az iskola időtartama',
  'hy':    'Սկզբում մանկավարժական ժամկետ',
  'id':    'Lama sekolah',
  'ig':    'Oge ụlọ akwụkwọ',
  'ka':    'სკოლის ხანგრძლივობა',
  'kk':    'Мектеп ұзақтығы',
  'ku':    'Dema dibistana',
  'mk':    'Траење на училиштето',
  'mr':    'शाळेचा कालावधी',
  'ms':    'Tempoh sekolah',
  'ne':    'विद्यालय अवधिः',
  'nl':    'Schoolduur',
  'no':    'Skolevarighet',
  'om':    'Yeroo mana barumsaa',
  'ps':    'د ښوونځي موده',
  'qu':    'Yachay wasipi pachakuna',
  'ro':    'Durata școlii',
  'rw':    "Igihe cy'ishuri",
  'si':    'පාසලේ කාලය',
  'sk':    'Dĺžka školy',
  'so':    'Muddada iskuulka',
  'sr':    'Трајање школе',
  'sw':    'Muda wa shule',
  'ta':    'பள்ளி காலம்',
  'te':    'పాఠశాల వ్యవధి',
  'th':    'ระยะเวลาโรงเรียน',
  'tl':    'Haba ng paaralan',
  'ur':    'اسکول کی مدت',
  'vi':    'Thời lượng học',
  'yo':    'Akoko ile-iwe',
  'zu':    'Ubude besikole',
};

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
let updated = 0, skipped = 0;

for (const file of files) {
  const code = file.replace('.json', '');
  const filePath = path.join(LOCALES_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let changed = false;
  if (!data.country && COUNTRY[code]) {
    data.country = COUNTRY[code];
    changed = true;
  }
  if (!data.schoolDuration && SCHOOL_DURATION[code]) {
    data.schoolDuration = SCHOOL_DURATION[code];
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✓ ${file}  country="${data.country}"  schoolDuration="${data.schoolDuration}"`);
    updated++;
  } else {
    console.log(`- ${file} already has keys or no mapping`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
