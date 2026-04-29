/* ═══════════════════════════════════════════════════════════════
   renderer.js  –  StudyLane
   Workplan + Grades + Portfolio + Settings
   Fully offline, localStorage only, no backend
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────────────────────────────
let schedules   = [];
let current     = null;
let isDirty     = false;
let editingCell = null;
let settings    = {};
let homeworkData = [];
let gradesData   = {};     // { subjectId: { name, color, entries:[] } }
let hwFilter     = 'all';
let editingHwId  = null;
let notesData    = [];   // [{ id, subject, title, content, date, color, createdAt }]
let editingNoteId = null;
let currentCountry = 'DE';

const CELL_COLORS = [
  '#7c6af5','#a855f7','#ec4899','#ef4444',
  '#f59e0b','#22c55e','#3b82f6','#64748b',
  '#14b8a6','#f97316','#0ea5e9','#8b5cf6',
];

const GRADE_COLORS = ['#7c6af5','#ec4899','#22c55e','#f59e0b','#3b82f6','#ef4444','#14b8a6','#f97316','#a855f7','#0ea5e9'];

const COUNTRY_REGIONS = [
  {
    region: 'Europe',
    options: [
      { code: 'AL', label: 'Albania' }, { code: 'AD', label: 'Andorra' }, { code: 'AT', label: 'Austria' },
      { code: 'BY', label: 'Belarus' }, { code: 'BE', label: 'Belgium' }, { code: 'BA', label: 'Bosnia and Herzegovina' },
      { code: 'BG', label: 'Bulgaria' }, { code: 'HR', label: 'Croatia' }, { code: 'CZ', label: 'Czech Republic' },
      { code: 'DK', label: 'Denmark' }, { code: 'EE', label: 'Estonia' }, { code: 'FI', label: 'Finland' },
      { code: 'FR', label: 'France' }, { code: 'DE', label: 'Germany' }, { code: 'GR', label: 'Greece' },
      { code: 'HU', label: 'Hungary' }, { code: 'IS', label: 'Iceland' }, { code: 'IE', label: 'Ireland' },
      { code: 'IT', label: 'Italy' }, { code: 'LV', label: 'Latvia' }, { code: 'LI', label: 'Liechtenstein' },
      { code: 'LT', label: 'Lithuania' }, { code: 'LU', label: 'Luxembourg' }, { code: 'MT', label: 'Malta' },
      { code: 'MD', label: 'Moldova' }, { code: 'MC', label: 'Monaco' }, { code: 'ME', label: 'Montenegro' },
      { code: 'NL', label: 'Netherlands' }, { code: 'MK', label: 'North Macedonia' }, { code: 'NO', label: 'Norway' },
      { code: 'PL', label: 'Poland' }, { code: 'PT', label: 'Portugal' }, { code: 'RO', label: 'Romania' },
      { code: 'SM', label: 'San Marino' }, { code: 'RS', label: 'Serbia' }, { code: 'SK', label: 'Slovakia' },
      { code: 'SI', label: 'Slovenia' }, { code: 'ES', label: 'Spain' }, { code: 'SE', label: 'Sweden' },
      { code: 'CH', label: 'Switzerland' }, { code: 'UA', label: 'Ukraine' }, { code: 'GB', label: 'United Kingdom' }
    ],
  },
  {
    region: 'South Asia',
    options: [
      { code: 'AF', label: 'Afghanistan' }, { code: 'BD', label: 'Bangladesh' }, { code: 'BT', label: 'Bhutan' },
      { code: 'IN', label: 'India' }, { code: 'MV', label: 'Maldives' }, { code: 'NP', label: 'Nepal' },
      { code: 'PK', label: 'Pakistan' }, { code: 'LK', label: 'Sri Lanka' }
    ],
  },
  {
    region: 'East Asia',
    options: [
      { code: 'CN', label: 'China' }, { code: 'JP', label: 'Japan' }, { code: 'KP', label: 'North Korea' },
      { code: 'KR', label: 'South Korea' }, { code: 'MN', label: 'Mongolia' }, { code: 'TW', label: 'Taiwan' },
      { code: 'BN', label: 'Brunei' }, { code: 'KH', label: 'Cambodia' }, { code: 'ID', label: 'Indonesia' },
      { code: 'LA', label: 'Laos' }, { code: 'MY', label: 'Malaysia' }, { code: 'MM', label: 'Myanmar' },
      { code: 'PH', label: 'Philippines' }, { code: 'SG', label: 'Singapore' }, { code: 'TH', label: 'Thailand' },
      { code: 'TL', label: 'Timor-Leste' }, { code: 'VN', label: 'Vietnam' }
    ],
  },
  {
    region: 'Africa',
    options: [
      { code: 'DZ', label: 'Algeria' }, { code: 'AO', label: 'Angola' }, { code: 'BJ', label: 'Benin' }, { code: 'BW', label: 'Botswana' },
      { code: 'BF', label: 'Burkina Faso' }, { code: 'BI', label: 'Burundi' }, { code: 'CM', label: 'Cameroon' },
      { code: 'CV', label: 'Cabo Verde' }, { code: 'CF', label: 'Central African Republic' }, { code: 'TD', label: 'Chad' },
      { code: 'KM', label: 'Comoros' }, { code: 'CG', label: 'Congo' }, { code: 'CD', label: 'Democratic Republic of the Congo' },
      { code: 'CI', label: 'Côte d’Ivoire' }, { code: 'DJ', label: 'Djibouti' }, { code: 'EG', label: 'Egypt' },
      { code: 'GQ', label: 'Equatorial Guinea' }, { code: 'ER', label: 'Eritrea' }, { code: 'SZ', label: 'Eswatini' },
      { code: 'ET', label: 'Ethiopia' }, { code: 'GA', label: 'Gabon' }, { code: 'GM', label: 'Gambia' }, { code: 'GH', label: 'Ghana' },
      { code: 'GN', label: 'Guinea' }, { code: 'GW', label: 'Guinea-Bissau' }, { code: 'KE', label: 'Kenya' },
      { code: 'LS', label: 'Lesotho' }, { code: 'LR', label: 'Liberia' }, { code: 'LY', label: 'Libya' },
      { code: 'MG', label: 'Madagascar' }, { code: 'MW', label: 'Malawi' }, { code: 'ML', label: 'Mali' },
      { code: 'MR', label: 'Mauritania' }, { code: 'MU', label: 'Mauritius' }, { code: 'MA', label: 'Morocco' },
      { code: 'MZ', label: 'Mozambique' }, { code: 'NA', label: 'Namibia' }, { code: 'NE', label: 'Niger' },
      { code: 'NG', label: 'Nigeria' }, { code: 'RW', label: 'Rwanda' }, { code: 'ST', label: 'São Tomé and Príncipe' },
      { code: 'SN', label: 'Senegal' }, { code: 'SC', label: 'Seychelles' }, { code: 'SL', label: 'Sierra Leone' },
      { code: 'SO', label: 'Somalia' }, { code: 'ZA', label: 'South Africa' }, { code: 'SS', label: 'South Sudan' },
      { code: 'SD', label: 'Sudan' }, { code: 'TZ', label: 'Tanzania' }, { code: 'TG', label: 'Togo' },
      { code: 'TN', label: 'Tunisia' }, { code: 'UG', label: 'Uganda' }, { code: 'ZM', label: 'Zambia' },
      { code: 'ZW', label: 'Zimbabwe' }
    ],
  },
  {
    region: 'Americas',
    options: [
      { code: 'AG', label: 'Antigua and Barbuda' }, { code: 'AR', label: 'Argentina' }, { code: 'BS', label: 'Bahamas' },
      { code: 'BB', label: 'Barbados' }, { code: 'BZ', label: 'Belize' }, { code: 'BO', label: 'Bolivia' },
      { code: 'BR', label: 'Brazil' }, { code: 'CA', label: 'Canada' }, { code: 'CL', label: 'Chile' },
      { code: 'CO', label: 'Colombia' }, { code: 'CR', label: 'Costa Rica' }, { code: 'CU', label: 'Cuba' },
      { code: 'DM', label: 'Dominica' }, { code: 'DO', label: 'Dominican Republic' }, { code: 'EC', label: 'Ecuador' },
      { code: 'SV', label: 'El Salvador' }, { code: 'GD', label: 'Grenada' }, { code: 'GT', label: 'Guatemala' },
      { code: 'GY', label: 'Guyana' }, { code: 'HT', label: 'Haiti' }, { code: 'HN', label: 'Honduras' },
      { code: 'JM', label: 'Jamaica' }, { code: 'MX', label: 'Mexico' }, { code: 'NI', label: 'Nicaragua' },
      { code: 'PA', label: 'Panama' }, { code: 'PY', label: 'Paraguay' }, { code: 'PE', label: 'Peru' },
      { code: 'KN', label: 'Saint Kitts and Nevis' }, { code: 'LC', label: 'Saint Lucia' },
      { code: 'VC', label: 'Saint Vincent and the Grenadines' }, { code: 'SR', label: 'Suriname' },
      { code: 'TT', label: 'Trinidad and Tobago' }, { code: 'US', label: 'United States' },
      { code: 'UY', label: 'Uruguay' }, { code: 'VE', label: 'Venezuela' }
    ],
  },
  {
    region: 'Oceania',
    options: [
      { code: 'AU', label: 'Australia' }, { code: 'FJ', label: 'Fiji' }, { code: 'KI', label: 'Kiribati' },
      { code: 'MH', label: 'Marshall Islands' }, { code: 'FM', label: 'Micronesia' }, { code: 'NR', label: 'Nauru' },
      { code: 'NZ', label: 'New Zealand' }, { code: 'PW', label: 'Palau' }, { code: 'PG', label: 'Papua New Guinea' },
      { code: 'SB', label: 'Solomon Islands' }, { code: 'WS', label: 'Samoa' }, { code: 'TO', label: 'Tonga' },
      { code: 'TV', label: 'Tuvalu' }, { code: 'VU', label: 'Vanuatu' }
    ],
  },
];

const COUNTRIES = COUNTRY_REGIONS.flatMap(group => group.options);
const DEFAULT_COUNTRY = 'DE';
const SCHOOL_DURATION = {
  DE: 13, AT: 12, CH: 13, FR: 12, ES: 12, IT: 13, GB: 13, US: 12,
  CA: 13, AU: 13, NZ: 13, JP: 12, KR: 12, CN: 12, IN: 12, BR: 12,
  RU: 11, ZA: 12, NG: 12, EG: 12, KE: 12, AR: 13, MX: 12, SA: 12,
  SE: 12, NO: 13, FI: 13, DK: 13, NL: 12, BE: 12, PL: 12, CZ: 13,
  TR: 12, IR: 12, PK: 10, BD: 10, BT: 12, LK: 13, PH: 12, TH: 12,
  VN: 12, ID: 12, MY: 11, SG: 11, AE: 12, IL: 12, QA: 12, NZ: 13,
  CN: 12, RU: 11, UA: 11, RO: 12, GR: 12, PT: 12, HU: 12, SK: 13,
  SI: 13, HR: 13, BG: 12, RS: 12, ME: 12, AL: 12, MK: 12, BA: 12,
};

// ── Storage ────────────────────────────────────────────────────────
const Storage = {
  load(key, def) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; }
    catch { return def; }
  },
  save(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  loadSchedules()    { return this.load('studylane_schedules', []); },
  saveSchedules(arr) { this.save('studylane_schedules', arr); },
  loadSettings()     { return this.load('studylane_settings', {}); },
  saveSettings(s)    { this.save('studylane_settings', s); },
  loadHomework()     { return this.load('studylane_homework', []); },
  saveHomework(arr)  { this.save('studylane_homework', arr); },
  loadGrades()       { return this.load('studylane_grades', {}); },
  saveGrades(obj)    { this.save('studylane_grades', obj); },
  loadNotes()        { return this.load('studylane_notes', []); },
  saveNotes(arr)     { this.save('studylane_notes', arr); },
};

// ── UUID ───────────────────────────────────────────────────────────
function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── Boot ───────────────────────────────────────────────────────────
async function init() {
  if (window.api && typeof window.api.minimize === 'function') {
    document.body.classList.add('electron');
  }

  settings = Storage.loadSettings();
  if (!settings._v) {
    settings.mode = 'schueler';
    settings.gradeSystem = 'school';
    settings._v = 1;
    Storage.saveSettings(settings);
  }

  const osSuggest = (navigator.language || '').split('-')[0].toLowerCase();
  const supported = LANGUAGES.map(l => l.code);
  const lang = settings.lang || (supported.includes(osSuggest) ? osSuggest : 'en');
  if (!settings.lang) { settings.lang = lang; Storage.saveSettings(settings); }

  await setLanguage(lang);
  renderLangDropdown();
  renderCountryDropdown();
  setCountry(settings.country || DEFAULT_COUNTRY);

  schedules    = Storage.loadSchedules();
  homeworkData = Storage.loadHomework();
  gradesData   = Storage.loadGrades();
  notesData    = Storage.loadNotes();

  populateSettingsForm();
  renderDefaultSlotsList();
  renderScheduleList();
  renderHomeworkList();
  renderGradesList();
  renderSchoolPortal();
  applyMode();
  setupPWA();
  renderHomeDashboard();
  showPage('home');
}

document.addEventListener('DOMContentLoaded', init);

// ══════════════════════════════════════════════════════════════════
//  LANGUAGE
// ══════════════════════════════════════════════════════════════════
function toggleLangMenu() {
  const picker = document.getElementById('langPicker');
  picker.classList.contains('open') ? closeLangMenu() : openLangMenu();
}
function openLangMenu() {
  const picker = document.getElementById('langPicker');
  const dd     = document.getElementById('langDropdown');
  picker.classList.add('open');
  // position below the picker button
  const rect = picker.getBoundingClientRect();
  dd.style.top   = (rect.bottom + 4) + 'px';
  dd.style.right = (window.innerWidth - rect.right) + 'px';
  dd.style.left  = 'auto';
  dd.style.display = 'block';
  // defer so the opening click doesn't immediately consume the listener
  setTimeout(() => document.addEventListener('click', outsideLangClose), 0);
}
function closeLangMenu() {
  document.getElementById('langPicker').classList.remove('open');
  document.getElementById('langDropdown').style.display = 'none';
  document.removeEventListener('click', outsideLangClose);
}
function outsideLangClose(e) {
  const picker = document.getElementById('langPicker');
  const dd     = document.getElementById('langDropdown');
  if (!picker.contains(e.target) && !dd.contains(e.target)) closeLangMenu();
}

function renderLangDropdown() {
  const dd = document.getElementById('langDropdown');
  if (!dd) return;
  dd.innerHTML = LANGUAGE_REGIONS.map(group => `
    <div class="lang-group">
      <div class="lang-group-title">${group.region}</div>
      ${group.options.map(l => `
        <div class="lang-option ${l.code === currentLang ? 'active' : ''}" onclick="switchLang('${l.code}')">
          <span class="lang-flag">${l.flag}</span>
          <span class="lang-name">${l.label}</span>
          ${l.code === currentLang ? '<span class="lang-check">✓</span>' : ''}
        </div>`).join('')}
    </div>`).join('');
}

function renderLangGrid() {
  const grid = document.getElementById('langGrid');
  if (!grid) return;
  grid.innerHTML = LANGUAGE_REGIONS.flatMap(group => group.options).map(l => `
    <button class="lang-grid-btn ${l.code === currentLang ? 'active' : ''}" onclick="switchLang('${l.code}')">
      <span class="lf">${l.flag}</span>
      <span>${l.label}</span>
    </button>`).join('');
}

function renderCountryDropdown() {
  const dd = document.getElementById('countryDropdown');
  if (!dd) return;
  dd.innerHTML = COUNTRY_REGIONS.map(group => `
    <div class="country-group">
      <div class="country-group-title">${group.region}</div>
      ${group.options.map(c => `
        <div class="country-option ${c.code === currentCountry ? 'active' : ''}" onclick="switchCountry('${c.code}')">
          ${c.flag ? `<span class="lang-flag">${c.flag}</span>` : ''}
          <span>${c.label}</span>
          ${c.code === currentCountry ? '<span class="lang-check">✓</span>' : ''}
        </div>`).join('')}
    </div>`).join('');
}

function toggleCountryMenu() {
  const picker = document.getElementById('countryPicker');
  picker.classList.contains('open') ? closeCountryMenu() : openCountryMenu();
}
function openCountryMenu() {
  const picker = document.getElementById('countryPicker');
  const dd     = document.getElementById('countryDropdown');
  picker.classList.add('open');
  const rect = picker.getBoundingClientRect();
  dd.style.top   = (rect.bottom + 4) + 'px';
  dd.style.right = (window.innerWidth - rect.right) + 'px';
  dd.style.left  = 'auto';
  dd.style.display = 'block';
  setTimeout(() => document.addEventListener('click', outsideCountryClose), 0);
}
function closeCountryMenu() {
  const picker = document.getElementById('countryPicker');
  const dd     = document.getElementById('countryDropdown');
  if (picker) picker.classList.remove('open');
  if (dd) dd.style.display = 'none';
  document.removeEventListener('click', outsideCountryClose);
}
function outsideCountryClose(e) {
  const picker = document.getElementById('countryPicker');
  const dd     = document.getElementById('countryDropdown');
  if (!picker.contains(e.target) && !dd.contains(e.target)) closeCountryMenu();
}

function getCountryLabel(code) {
  return COUNTRIES.find(c => c.code === code)?.label || code;
}
function getCustomCountryDuration(code) {
  return settings.customSchoolDurationByCountry?.[code];
}
function getCountryDuration(code) {
  const custom = getCustomCountryDuration(code);
  const years = Number.isInteger(custom) && custom > 0 ? custom : (SCHOOL_DURATION[code] || 12);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}
function updateCountryInfo() {
  const infoEl = document.getElementById('countryInfo');
  if (!infoEl) return;
  const custom = getCustomCountryDuration(currentCountry);
  const durationText = getCountryDuration(currentCountry);
  infoEl.textContent = custom
    ? `${t('schoolDuration')}: ${durationText} (custom)`
    : `${t('schoolDuration')}: ${durationText}`;
  const input = document.getElementById('countryDurationInput');
  if (input) input.value = custom || '';
}
function saveCountryDuration() {
  const input = document.getElementById('countryDurationInput');
  if (!input) return;
  const value = parseInt(input.value, 10);
  if (!Number.isInteger(value) || value < 1 || value > 30) {
    input.value = '';
    return;
  }
  settings.customSchoolDurationByCountry = settings.customSchoolDurationByCountry || {};
  settings.customSchoolDurationByCountry[currentCountry] = value;
  Storage.saveSettings(settings);
  updateCountryInfo();
}
function switchCountry(code) {
  setCountry(code);
}
function setCountry(code) {
  const country = COUNTRIES.find(c => c.code === code) ? code : DEFAULT_COUNTRY;
  currentCountry = country;
  settings.country = currentCountry;
  Storage.saveSettings(settings);
  const labelEl = document.getElementById('countryLabel');
  const nameEl = document.getElementById('countryName');
  if (labelEl) labelEl.textContent = currentCountry;
  if (nameEl) nameEl.textContent = getCountryLabel(currentCountry);
  updateCountryInfo();
  renderCountryDropdown();
  closeCountryMenu();
}

async function switchLang(code) {
  settings.lang = code;
  Storage.saveSettings(settings);
  await setLanguage(code);
  renderLangDropdown();
  closeLangMenu();
  updateCountryInfo();
  renderHomeworkList();
  renderGradesList();
  renderSchoolPortal();
  renderScheduleList();
  if (current) rebuildGrid();
}

// ══════════════════════════════════════════════════════════════════
//  MODE (Schüler / Studierender)
// ══════════════════════════════════════════════════════════════════
function setMode(mode) {
  settings.mode = mode;
  Storage.saveSettings(settings);
  applyMode();
}

function applyMode() {
  const mode = settings.mode || 'schueler';
  ['schueler','student'].forEach(m => {
    const btn = document.getElementById('mode' + cap(m) + 'Btn');
    if (btn) btn.classList.toggle('active', m === mode);
  });
  // Toggle body class for CSS-based nav/button switching
  document.body.classList.toggle('mode-schueler', mode === 'schueler');
  document.body.classList.toggle('mode-student',  mode === 'student');
  // Show/hide ECTS field in grade modal
  const ectsField = document.getElementById('grEctsField');
  if (ectsField) ectsField.style.display = mode === 'student' ? '' : 'none';
  // Show/hide settings sections
  document.querySelectorAll('.schueler-only-section').forEach(el => el.style.display = mode === 'schueler' ? '' : 'none');
  document.querySelectorAll('.student-only-section').forEach(el => el.style.display = mode === 'student'  ? '' : 'none');
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ══════════════════════════════════════════════════════════════════
//  PAGE NAVIGATION
// ══════════════════════════════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });
  if (id === 'grades')   renderGradesList();
  if (id === 'school')   renderSchoolPortal();
  if (id === 'homework') renderHomeworkList();
  if (id === 'home')     renderHomeDashboard();
  if (id === 'student')  renderStudentPage();
  if (id === 'notes')    renderNotesList();
  if (id === 'settings') { populateSettingsForm(); renderSettingsGoals(); renderDefaultSlotsList(); }
}

// Context-sensitive "+" nav button
// ══════════════════════════════════════════════════════════════════
//  HOME DASHBOARD
// ══════════════════════════════════════════════════════════════════
function renderHomeDashboard() {
  // Date greeting
  const dateEl = document.getElementById('homeDate');
  if (dateEl) {
    const now = new Date();
    const opts = { weekday: 'long', day: 'numeric', month: 'long' };
    dateEl.textContent = now.toLocaleDateString(currentLang || 'de', opts);
  }

  // Stats
  const pending = homeworkData.filter(h => !h.done).length;
  const el = document.getElementById('statSchedules');
  if (el) el.textContent = schedules.length;
  const elP = document.getElementById('statPending');
  if (elP) elP.textContent = pending;

  const subjects = Object.values(gradesData || {});
  let totalW = 0, totalS = 0;
  subjects.forEach(subj => {
    const avg = computeAverage(subj.entries || []);
    const w = (subj.entries || []).reduce((a, e) => a + (e.weight || 1), 0);
    if (avg !== null) { totalS += avg * w; totalW += w; }
  });
  const avgEl = document.getElementById('statAvg');
  if (avgEl) avgEl.textContent = totalW > 0 ? (totalS / totalW).toFixed(1) : '–';

  // Upcoming homework (up to 3, open tasks soonest first)
  const wrap = document.getElementById('homeUpcomingWrap');
  const list = document.getElementById('homeUpcomingList');
  if (!wrap || !list) return;

  const open = homeworkData
    .filter(h => !h.done)
    .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
    .slice(0, 3);

  if (open.length === 0) {
    wrap.style.display = 'none';
  } else {
    wrap.style.display = '';
    list.innerHTML = open.map(item => {
      const due = item.dueDate ? fmtDate2(item.dueDate) : '';
      return `<div class="upcoming-item" onclick="showPage('homework')">
        <div class="upcoming-dot" style="background:${prioBg(item.priority)}"></div>
        <div class="upcoming-body">
          <div class="upcoming-title">${esc(item.subject ? item.subject + ' · ' + item.title : item.title || '')}</div>
          ${due ? `<div class="upcoming-due">${due}</div>` : ''}
        </div>
        <span class="hw-prio-badge ${item.priority || 'mittel'}">${getPrioLabel(item.priority)}</span>
      </div>`;
    }).join('');
  }
}

function prioBg(p) {
  if (p === 'hoch')    return '#ef4444';
  if (p === 'niedrig') return '#22c55e';
  return '#f59e0b';
}

// ══════════════════════════════════════════════════════════════════
//  STUDENT PAGE
// ══════════════════════════════════════════════════════════════════
function renderStudentPage() {
  // Stats
  const open = homeworkData.filter(h => !h.done).length;
  const done = homeworkData.filter(h =>  h.done).length;
  const el1 = document.getElementById('stuStatOpen'); if (el1) el1.textContent = open;
  const el2 = document.getElementById('stuStatDone'); if (el2) el2.textContent = done;

  const subjects = Object.values(gradesData || {});
  let totalW = 0, totalS = 0;
  subjects.forEach(subj => {
    const avg = computeAverage(subj.entries || []);
    const w = (subj.entries || []).reduce((a, e) => a + (e.weight || 1), 0);
    if (avg !== null) { totalS += avg * w; totalW += w; }
  });
  const avgEl = document.getElementById('stuStatAvg');
  if (avgEl) avgEl.textContent = totalW > 0 ? (totalS / totalW).toFixed(1) : '–';

  // Upcoming tasks (up to 5)
  const upList = document.getElementById('stuUpcomingList');
  if (upList) {
    const items = homeworkData
      .filter(h => !h.done)
      .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
      .slice(0, 5);
    if (items.length === 0) {
      upList.innerHTML = `<div class="empty-hint">${t('hwNoItems')}</div>`;
    } else {
      upList.innerHTML = items.map(item => {
        const due = item.dueDate ? fmtDate2(item.dueDate) : '';
        return `<div class="upcoming-item" onclick="showPage('homework')">
          <div class="upcoming-dot" style="background:${prioBg(item.priority)}"></div>
          <div class="upcoming-body">
            <div class="upcoming-title">${esc(item.subject ? item.subject + ' · ' + item.title : item.title || '')}</div>
            ${due ? `<div class="upcoming-due">${due}</div>` : ''}
          </div>
          <span class="hw-prio-badge ${item.priority || 'mittel'}">${getPrioLabel(item.priority)}</span>
        </div>`;
      }).join('');
    }
  }

  // Grade bars per subject
  const barsEl = document.getElementById('stuGradesBars');
  if (barsEl) {
    if (subjects.length === 0) {
      barsEl.innerHTML = `<div class="empty-hint">${t('grNoSubjects')}</div>`;
    } else {
      barsEl.innerHTML = subjects.map(subj => {
        const avg = computeAverage(subj.entries || []);
        const pct = avg !== null ? Math.max(0, Math.min(100, (1 - (avg - 1) / 5) * 100)) : 0;
        const col = avg !== null ? gradeColor(avg) : 'var(--text3)';
        return `<div class="stu-grade-bar-row" onclick="showPage('grades')">
          <div class="stu-grade-bar-label">
            <div class="stu-grade-dot" style="background:${subj.color || '#7c6af5'}"></div>
            <span>${esc(subj.name)}</span>
          </div>
          <div class="stu-grade-bar-track">
            <div class="stu-grade-bar-fill" style="width:${pct}%;background:${col}"></div>
          </div>
          <div class="stu-grade-bar-val" style="color:${col}">${avg !== null ? avg.toFixed(1) : '–'}</div>
        </div>`;
      }).join('');
    }
  }

  // Study goals
  renderStudyGoals();
}

// Study goals (stored in settings.studyGoals)
function renderStudyGoals() {
  const goals = settings.studyGoals || [];
  const list  = document.getElementById('stuGoalsList');
  const empty = document.getElementById('stuGoalsEmpty');
  if (!list) return;
  if (goals.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  list.innerHTML = goals.map((g, i) => `
    <div class="goal-item ${g.done ? 'goal-done' : ''}">
      <div class="hw-check ${g.done ? 'checked' : ''}" onclick="toggleGoal(${i})"></div>
      <div class="goal-text">${esc(g.text)}</div>
      <button class="hw-act-btn" onclick="deleteGoal(${i})">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

function renderSettingsGoals() {
  const goals = settings.studyGoals || [];
  const el = document.getElementById('settingsGoalsList');
  if (!el) return;
  if (goals.length === 0) {
    el.innerHTML = `<div class="empty-hint" style="padding:6px 0">${t('stuGoalsEmpty')}</div>`;
    return;
  }
  el.innerHTML = goals.map((g, i) => `
    <div class="goal-item ${g.done ? 'goal-done' : ''}" style="margin-bottom:6px">
      <div class="hw-check ${g.done ? 'checked' : ''}" onclick="toggleGoal(${i});renderSettingsGoals()"></div>
      <div class="goal-text">${esc(g.text)}</div>
      <button class="hw-act-btn" onclick="deleteGoal(${i});renderSettingsGoals()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

function addStudyGoalInline() {
  const input = document.getElementById('newGoalInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (!settings.studyGoals) settings.studyGoals = [];
  settings.studyGoals.push({ text, done: false });
  Storage.saveSettings(settings);
  input.value = '';
  renderStudyGoals();
  renderSettingsGoals();
}

function addStudyGoal() {
  const text = prompt(t('stuGoalsTitle') + ':');
  if (!text || !text.trim()) return;
  if (!settings.studyGoals) settings.studyGoals = [];
  settings.studyGoals.push({ text: text.trim(), done: false });
  Storage.saveSettings(settings);
  renderStudyGoals();
}

function toggleGoal(i) {
  if (!settings.studyGoals || !settings.studyGoals[i]) return;
  settings.studyGoals[i].done = !settings.studyGoals[i].done;
  Storage.saveSettings(settings);
  renderStudyGoals();
}

function deleteGoal(i) {
  if (!settings.studyGoals) return;
  settings.studyGoals.splice(i, 1);
  Storage.saveSettings(settings);
  renderStudyGoals();
}

// ══════════════════════════════════════════════════════════════════
//  NOTES
// ══════════════════════════════════════════════════════════════════
const NOTE_COLORS = ['#818cf8','#a855f7','#ec4899','#f59e0b','#22c55e','#3b82f6','#14b8a6','#ef4444'];
let _selectedNoteColor = NOTE_COLORS[0];

function renderNotesList() {
  const list  = document.getElementById('notesList');
  const empty = document.getElementById('notesEmpty');
  if (!list) return;

  // Always update stats from full dataset
  const totalNotes = notesData.length;
  const subjects   = [...new Set(notesData.map(n => n.subject).filter(Boolean))].length;
  const latest     = notesData.length ? [...notesData].sort((a,b) => (b.date||b.createdAt||'').localeCompare(a.date||a.createdAt||''))[0] : null;
  const elT = document.getElementById('notesStatTotal');    if (elT) elT.textContent = totalNotes;
  const elS = document.getElementById('notesStatSubjects'); if (elS) elS.textContent = subjects;
  const elL = document.getElementById('notesStatLatest');   if (elL) elL.textContent = latest ? fmtDate2(latest.date || latest.createdAt?.slice(0,10)) : '–';

  const q = (document.getElementById('notesSearchInput')?.value || '').toLowerCase();
  const items = [...notesData]
    .filter(n => !q || (n.subject + ' ' + n.title + ' ' + n.content).toLowerCase().includes(q))
    .sort((a, b) => (b.date || b.createdAt || '').localeCompare(a.date || a.createdAt || ''));

  if (items.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  // Group by date
  const groups = {};
  items.forEach(n => {
    const key = n.date || n.createdAt?.slice(0, 10) || '?';
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  list.innerHTML = Object.entries(groups).map(([date, notes]) => `
    <div class="notes-date-group">
      <div class="notes-date-label">${fmtDate2(date)}</div>
      ${notes.map(n => `
        <div class="note-card" style="border-left:3px solid ${n.color || NOTE_COLORS[0]}">
          <div class="note-card-header">
            <div class="note-card-meta">
              ${n.subject ? `<span class="note-subject-tag" style="background:${n.color || NOTE_COLORS[0]}22;color:${n.color || NOTE_COLORS[0]}">${esc(n.subject)}</span>` : ''}
              <span class="note-title">${esc(n.title || t('navNotes'))}</span>
            </div>
            <div class="note-actions">
              <button class="hw-act-btn" onclick="editNote('${n.id}')">
                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="hw-act-btn" onclick="deleteNote('${n.id}')">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          </div>
          <div class="note-content">${esc(n.content || '').replace(/\n/g, '<br>')}</div>
        </div>`).join('')}
    </div>`).join('');

  // Update subject datalist
  const subjectList = [...new Set(notesData.map(n => n.subject).filter(Boolean))];
  const dl = document.getElementById('noteSubjectSuggestions');
  if (dl) dl.innerHTML = subjectList.map(s => `<option value="${esc(s)}">`).join('');
}

function openNoteModal(note) {
  editingNoteId = note ? note.id : null;
  const titleEl = document.getElementById('noteModalTitle');
  if (titleEl) titleEl.textContent = note ? t('noteEdit') : t('noteAdd');
  setValue('noteSubjectInput', note ? (note.subject || '') : '');
  setValue('noteTitleInput',   note ? (note.title   || '') : '');
  setValue('noteContentInput', note ? (note.content || '') : '');
  setValue('noteDateInput',    note ? (note.date    || todayStr()) : todayStr());
  _selectedNoteColor = (note && note.color) ? note.color : NOTE_COLORS[0];
  renderNoteColorPalette();
  document.getElementById('noteModalBg').classList.add('open');
  setTimeout(() => document.getElementById('noteContentInput')?.focus(), 100);
}

function renderNoteColorPalette() {
  const pal = document.getElementById('noteColorPalette');
  if (!pal) return;
  pal.innerHTML = NOTE_COLORS.map(c =>
    `<div class="color-dot ${_selectedNoteColor === c ? 'selected' : ''}" style="background:${c}"
         onclick="selectNoteColor('${c}',this)"></div>`).join('');
}

function selectNoteColor(c, el) {
  _selectedNoteColor = c;
  document.querySelectorAll('#noteColorPalette .color-dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

function closeNoteModal() {
  document.getElementById('noteModalBg').classList.remove('open');
  editingNoteId = null;
}

function saveNote() {
  const subject = document.getElementById('noteSubjectInput')?.value.trim() || '';
  const title   = document.getElementById('noteTitleInput')?.value.trim() || '';
  const content = document.getElementById('noteContentInput')?.value.trim() || '';
  const date    = document.getElementById('noteDateInput')?.value || todayStr();
  if (!content && !title) { toast(t('noteContentRequired')); return; }

  if (editingNoteId) {
    const idx = notesData.findIndex(n => n.id === editingNoteId);
    if (idx !== -1) {
      notesData[idx] = { ...notesData[idx], subject, title, content, date, color: _selectedNoteColor };
    }
  } else {
    notesData.unshift({ id: uuid(), subject, title, content, date, color: _selectedNoteColor, createdAt: new Date().toISOString() });
  }
  Storage.saveNotes(notesData);
  closeNoteModal();
  renderNotesList();
  toast(t('noteSaved'));
}

function editNote(id) {
  const note = notesData.find(n => n.id === id);
  if (note) openNoteModal(note);
}

function deleteNote(id) {
  notesData = notesData.filter(n => n.id !== id);
  Storage.saveNotes(notesData);
  renderNotesList();
}
function populateSettingsForm() {
  // shared / schueler fields
  setValue('settingName',      settings.profileName     || '');
  setValue('settingSchool',    settings.profileSchool   || '');
  setValue('settingClass',     settings.profileClass    || '');
  setValue('settingSemester',  settings.profileSemester || '');
  // student-specific fields
  setValue('settingNameStu',      settings.profileName     || '');
  setValue('settingUni',          settings.profileUni      || '');
  setValue('settingDegree',       settings.profileDegree   || '');
  setValue('settingSemesterStu',  settings.profileSemester || '');
  setValue('settingMatr',         settings.profileMatr     || '');
  // shared
  setValue('settingGradeSystem', settings.gradeSystem   || 'school');
  setValue('settingPortalName', settings.portalName     || '');
  setValue('settingPortalUrl',  settings.portalUrl      || '');
  setValue('settingPortalType', settings.portalType     || 'iserv');
  renderSettingsGoals();
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function saveSettings(showToast) {
  const mode = settings.mode || 'schueler';
  if (mode === 'student') {
    settings.profileName     = getValue('settingNameStu');
    settings.profileUni      = getValue('settingUni');
    settings.profileDegree   = getValue('settingDegree');
    settings.profileSemester = getValue('settingSemesterStu');
    settings.profileMatr     = getValue('settingMatr');
  } else {
    settings.profileName     = getValue('settingName');
    settings.profileSchool   = getValue('settingSchool');
    settings.profileClass    = getValue('settingClass');
    settings.profileSemester = getValue('settingSemester');
  }
  settings.gradeSystem = getValue('settingGradeSystem') || 'school';
  Storage.saveSettings(settings);
  applyMode();
  if (showToast) toast(t('settingsSaved'));
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function savePortalSettings() {
  settings.portalName = getValue('settingPortalName');
  settings.portalUrl  = getValue('settingPortalUrl');
  settings.portalType = getValue('settingPortalType');
  Storage.saveSettings(settings);
  renderSchoolPortal();
  toast(t('schPortalSaved'));
}

function scrollToSchoolSettings() {
  const el = document.getElementById('schoolSettingsSection');
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
}

// ── Default Slots ──────────────────────────────────────────────────
function getDefaultSlots() {
  return settings.defaultSlots || [
    '07:30–08:15', '08:15–09:00', '09:20–10:05',
    '10:05–10:50', '11:10–11:55', '11:55–12:40',
    '13:10–13:55', '13:55–14:40',
  ];
}

function renderDefaultSlotsList() {
  const list = document.getElementById('defaultSlotsList');
  if (!list) return;
  const slots = getDefaultSlots();
  list.innerHTML = slots.map((s, i) => `
    <div class="default-slot-row">
      <input class="input" value="${esc(s)}" oninput="updateDefaultSlot(${i}, this.value)" />
      <button class="default-slot-del" onclick="removeDefaultSlot(${i})">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`).join('');
}

function addDefaultSlot() {
  const slots = getDefaultSlots();
  slots.push('--:--–--:--');
  settings.defaultSlots = slots;
  renderDefaultSlotsList();
}

function removeDefaultSlot(i) {
  const slots = getDefaultSlots();
  slots.splice(i, 1);
  settings.defaultSlots = slots;
  renderDefaultSlotsList();
}

function updateDefaultSlot(i, val) {
  const slots = getDefaultSlots();
  slots[i] = val;
  settings.defaultSlots = slots;
}

// ══════════════════════════════════════════════════════════════════
//  SCHEDULES (HOME LIST)
// ══════════════════════════════════════════════════════════════════
function renderScheduleList() {
  const list  = document.getElementById('scheduleList');
  const empty = document.getElementById('homeEmpty');
  const q     = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filtered = schedules.filter(s => !q || (s.name||'').toLowerCase().includes(q));

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = filtered.map(s => {
    const subjectChips = (s.subjects || []).slice(0, 4).map(sub =>
      `<span class="schedule-chip" style="${sub.color ? 'border-color:'+sub.color+'88;color:'+sub.color : ''}">${esc(sub.name)}</span>`
    ).join('');
    const more = (s.subjects||[]).length > 4 ? `<span class="schedule-chip">+${(s.subjects.length-4)}</span>` : '';
    const slotCount = (s.slots||[]).length;
    return `
    <div class="schedule-card" onclick="openSchedule('${s.id}')">
      <div class="schedule-card-icon">
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div class="schedule-card-info">
        <div class="schedule-card-name">${esc(s.name || t('unnamed'))}</div>
        <div class="schedule-card-meta">
          ${s.from && s.to ? esc(s.from) + ' – ' + esc(s.to) + ' · ' : ''}${slotCount} ${t('lessons')} · ${t('lastChanged')}${fmtDate(s.updatedAt)}
        </div>
        ${subjectChips || more ? `<div class="schedule-card-chips">${subjectChips}${more}</div>` : ''}
      </div>
      <button class="schedule-card-delete" onclick="deleteSchedule(event,'${s.id}')">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`;
  }).join('');
}

function deleteSchedule(e, id) {
  e.stopPropagation();
  if (!confirm(t('deletePlan'))) return;
  schedules = schedules.filter(s => s.id !== id);
  Storage.saveSchedules(schedules);
  renderScheduleList();
  toast(t('deletedToast'));
}

function fmtDate(ts) {
  if (!ts) return '–';
  return new Date(ts).toLocaleDateString();
}

// ══════════════════════════════════════════════════════════════════
//  SCHEDULE EDITOR
// ══════════════════════════════════════════════════════════════════
function newScheduleAndShow() {
  current = {
    id: uuid(),
    name: '',
    from: '',
    to: '',
    subjects: [],
    slots: [...getDefaultSlots()],
    days: getDayNames(),
    grid: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  isDirty = false;
  populateEditor();
  showPage('editor');
}

function openSchedule(id) {
  const s = schedules.find(s => s.id === id);
  if (!s) return;
  current = JSON.parse(JSON.stringify(s));
  if (!current.slots || !current.slots.length) current.slots = [...getDefaultSlots()];
  if (!current.days || !current.days.length)  current.days  = getDayNames();
  populateEditor();
  showPage('editor');
}

function getDayNames() {
  const locale = currentLang || 'de';
  const base = new Date(2024, 0, 1); // Monday 1 Jan 2024
  return [1,2,3,4,5].map(d => {
    const date = new Date(base);
    date.setDate(base.getDate() + d);
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  });
}

function populateEditor() {
  setValue('planNameInput', current.name || '');
  setValue('planFrom',      current.from || '');
  setValue('planTo',        current.to   || '');
  renderSubjectList();
  renderEditorSlots();
  rebuildGrid();
}

function saveCurrentSchedule() {
  current.name      = getValue('planNameInput');
  current.from      = getValue('planFrom');
  current.to        = getValue('planTo');
  current.updatedAt = Date.now();
  const idx = schedules.findIndex(s => s.id === current.id);
  if (idx >= 0) schedules[idx] = current; else schedules.push(current);
  Storage.saveSchedules(schedules);
  renderScheduleList();
  isDirty = false;
  toast(t('saved'));
}

// ── Subjects ───────────────────────────────────────────────────────
function renderSubjectList() {
  const list = document.getElementById('subjectList');
  if (!list || !current) return;
  list.innerHTML = (current.subjects || []).map((s, i) => `
    <div class="subject-row">
      <div class="subject-color" style="background:${s.color || CELL_COLORS[i%CELL_COLORS.length]}"></div>
      <input class="input subject-name" value="${esc(s.name || '')}" oninput="updateSubjectName(${i},this.value)"
             placeholder="${t('lesson')}" style="flex:1;padding:4px 6px" />
      <button class="subject-del" onclick="removeSubject(${i})">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

function addSubject() {
  if (!current) return;
  current.subjects = current.subjects || [];
  current.subjects.push({ id: uuid(), name: '', color: CELL_COLORS[current.subjects.length % CELL_COLORS.length] });
  renderSubjectList();
}

function removeSubject(i) {
  current.subjects.splice(i, 1);
  renderSubjectList();
  rebuildGrid();
}

function updateSubjectName(i, val) {
  if (current && current.subjects[i]) current.subjects[i].name = val;
}

// ── Slots ──────────────────────────────────────────────────────────
function renderEditorSlots() {
  const list = document.getElementById('editorSlots');
  if (!list || !current) return;
  list.innerHTML = (current.slots || []).map((s, i) => `
    <div class="default-slot-row">
      <input class="input" value="${esc(s)}" oninput="updateEditorSlot(${i},this.value)" />
      <button class="default-slot-del" onclick="removeEditorSlot(${i})">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

function addEditorSlot() {
  if (!current) return;
  current.slots = current.slots || [];
  current.slots.push('--:--–--:--');
  renderEditorSlots();
  rebuildGrid();
}

function removeEditorSlot(i) {
  current.slots.splice(i, 1);
  renderEditorSlots();
  rebuildGrid();
}

function updateEditorSlot(i, val) {
  if (current) { current.slots[i] = val; rebuildGrid(); }
}

// ── Grid ──────────────────────────────────────────────────────────
function rebuildGrid() {
  if (!current) return;
  const grid = document.getElementById('timetableGrid');
  if (!grid) return;
  const days  = current.days  || getDayNames();
  const slots = current.slots || getDefaultSlots();

  // Detect today's column index (0=Mon … 4=Fri)
  const todayDow = new Date().getDay(); // 0=Sun,1=Mon…6=Sat
  const todayCol = todayDow >= 1 && todayDow <= 5 ? todayDow - 1 : -1;

  grid.style.gridTemplateColumns = `52px repeat(${days.length}, minmax(86px,1fr))`;

  let html = '<div class="timetable-header" style="background:transparent;border-bottom:1px solid var(--border)"></div>';
  days.forEach((d, di) => {
    const cls = di === todayCol ? ' today-col' : '';
    html += `<div class="timetable-header${cls}">${esc(d)}</div>`;
  });

  slots.forEach((slot, si) => {
    html += `<div class="timetable-slot-label"><span class="slot-num">${si + 1}</span><span style="font-size:9px;color:var(--text3)">${esc(slot)}</span></div>`;
    days.forEach((_, di) => {
      const key  = `${di}-${si}`;
      const cell = (current.grid || {})[key] || {};
      const subj = (current.subjects || []).find(s => s.id === cell.subjectId);
      const bg   = cell.colorOverride || (subj ? subj.color : '');
      const name = subj ? subj.name : '';
      const todayCls = di === todayCol ? ' today-col' : '';
      html += `<div class="timetable-cell ${name ? 'filled' : ''}${todayCls}"
        style="${bg ? 'background:' + bg + '22;border-left:3px solid ' + bg : ''}"
        onclick="openCellModal(${di},${si})">
        ${name ? `<div class="cell-subject" style="${bg?'color:'+bg:''}">${esc(name)}</div>` : ''}
        ${cell.room    ? `<div class="cell-room">${esc(cell.room)}</div>` : ''}
        ${cell.teacher ? `<div class="cell-teacher">${esc(cell.teacher)}</div>` : ''}
      </div>`;
    });
  });

  grid.innerHTML = html;
}

function clearGrid() {
  if (!confirm(t('clearConfirm'))) return;
  current.grid = {};
  rebuildGrid();
}

// ── Cell Modal ────────────────────────────────────────────────────
function openCellModal(di, si) {
  editingCell = { di, si };
  const key  = `${di}-${si}`;
  const cell = (current.grid || {})[key] || {};
  const subjectSel = document.getElementById('cellSubjectSelect');
  const chooseSubjectLabel = t('chooseSubject');
  const subjectPlaceholder = chooseSubjectLabel === 'chooseSubject' ? t('lesson') : chooseSubjectLabel;
  subjectSel.innerHTML = `<option value="">– ${subjectPlaceholder} –</option>` +
    (current.subjects || []).map(s =>
      `<option value="${s.id}" ${s.id === cell.subjectId ? 'selected' : ''}>${esc(s.name)}</option>`
    ).join('');
  setValue('cellRoom',    cell.room    || '');
  setValue('cellTeacher', cell.teacher || '');
  // Color palette
  const pal = document.getElementById('cellColorPalette');
  pal.innerHTML = CELL_COLORS.map(c =>
    `<div class="color-dot ${cell.colorOverride === c ? 'selected' : ''}" style="background:${c}"
         onclick="selectCellColor('${c}',this)"></div>`).join('');
  document.getElementById('cellModalBg').classList.add('open');
}

function selectCellColor(color, el) {
  document.querySelectorAll('#cellColorPalette .color-dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  el.dataset.selected = color;
}

function applyCellModal() {
  if (!editingCell || !current) return;
  const key = `${editingCell.di}-${editingCell.si}`;
  const selectedDot = document.querySelector('#cellColorPalette .color-dot.selected');
  current.grid = current.grid || {};
  current.grid[key] = {
    subjectId:     getValue('cellSubjectSelect'),
    room:          getValue('cellRoom'),
    teacher:       getValue('cellTeacher'),
    colorOverride: selectedDot ? selectedDot.style.background : '',
  };
  closeCellModal();
  rebuildGrid();
}

function clearCell() {
  if (!editingCell || !current) return;
  const key = `${editingCell.di}-${editingCell.si}`;
  current.grid = current.grid || {};
  delete current.grid[key];
  closeCellModal();
  rebuildGrid();
}

function closeCellModal() {
  document.getElementById('cellModalBg').classList.remove('open');
  editingCell = null;
}

// ══════════════════════════════════════════════════════════════════
//  HOMEWORK
// ══════════════════════════════════════════════════════════════════
function setHwFilter(f) {
  hwFilter = f;
  ['all','open','done'].forEach(k => {
    const btn = document.getElementById('hwFilter' + cap(k));
    if (btn) btn.classList.toggle('active', k === f);
  });
  renderHomeworkList();
}

function renderHomeworkList() {
  const list  = document.getElementById('hwList');
  const empty = document.getElementById('hwEmpty');
  if (!list) return;

  // Always compute stats from full dataset
  const today = new Date(); today.setHours(0,0,0,0);
  const allOpen    = homeworkData.filter(h => !h.done).length;
  const allDone    = homeworkData.filter(h =>  h.done).length;
  const allOverdue = homeworkData.filter(h => {
    if (h.done || !h.dueDate) return false;
    const d = new Date(h.dueDate); d.setHours(0,0,0,0); return d < today;
  }).length;
  const total = allOpen + allDone;
  const pct   = total > 0 ? Math.round(allDone / total * 100) : 0;

  const elO = document.getElementById('hwStatOpen');    if (elO) elO.textContent = allOpen;
  const elD = document.getElementById('hwStatDone');    if (elD) elD.textContent = allDone;
  const elV = document.getElementById('hwStatOverdue'); if (elV) { elV.textContent = allOverdue; elV.style.color = allOverdue > 0 ? 'var(--danger)' : ''; }

  const wrap  = document.getElementById('hwProgressWrap');
  const fill  = document.getElementById('hwProgressFill');
  const label = document.getElementById('hwProgressLabel');
  if (wrap && fill && label) {
    if (total > 0) {
      wrap.style.display = '';
      fill.style.width = pct + '%';
      fill.style.background = pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--warn)';
      label.textContent = pct + '% ' + t('hwFilterDone');
    } else {
      wrap.style.display = 'none';
    }
  }

  let items = [...homeworkData].sort((a, b) => {
    if (!a.dueDate) return 1; if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  if (hwFilter === 'open') items = items.filter(i => !i.done);
  if (hwFilter === 'done') items = items.filter(i =>  i.done);

  if (items.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);

  list.innerHTML = items.map(item => {
    let statusClass = '';
    let statusLabel = '';
    if (item.dueDate && !item.done) {
      const due = new Date(item.dueDate); due.setHours(0,0,0,0);
      if (due < today) { statusClass = 'overdue'; statusLabel = `<span class="hw-prio-badge" style="background:rgba(239,68,68,.15);color:#ef4444">${t('hwOverdue')}</span>`; }
      else if (+due === +today)    { statusClass = 'due-today';    statusLabel = `<span class="hw-prio-badge" style="background:rgba(245,158,11,.15);color:#f59e0b">${t('hwDueToday')}</span>`; }
      else if (+due === +tomorrow) { statusClass = 'due-tomorrow'; statusLabel = `<span class="hw-prio-badge" style="background:rgba(59,130,246,.15);color:#3b82f6">${t('hwDueTomorrow')}</span>`; }
    }
    return `
    <div class="hw-item ${item.done ? 'done' : ''} ${statusClass}">
      <div class="hw-check ${item.done ? 'checked' : ''}" onclick="toggleHwDone('${item.id}')"></div>
      <div class="hw-body">
        <div class="hw-subject">${esc(item.subject || '')}</div>
        <div class="hw-title">${esc(item.title || '')}</div>
        <div class="hw-meta">
          ${item.dueDate ? `<span class="hw-due">${fmtDate2(item.dueDate)}</span>` : ''}
          <span class="hw-prio-badge ${item.priority || 'mittel'}">${getPrioLabel(item.priority)}</span>
          ${statusLabel}
        </div>
        ${item.notes ? `<div style="font-size:12px;color:var(--text2);margin-top:4px">${esc(item.notes)}</div>` : ''}
      </div>
      <div class="hw-actions">
        <button class="hw-act-btn" onclick="editHwItem('${item.id}')">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="hw-act-btn" onclick="deleteHwItem('${item.id}')">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  // Update subject datalist
  const subjects = [...new Set(homeworkData.map(h => h.subject).filter(Boolean))];
  const dl = document.getElementById('hwSubjectSuggestions');
  if (dl) dl.innerHTML = subjects.map(s => `<option value="${esc(s)}">`).join('');
}

function getPrioLabel(p) {
  if (p === 'hoch' || p === 'high')      return t('hwPrioHigh');
  if (p === 'niedrig' || p === 'low')    return t('hwPrioLow');
  return t('hwPrioMedium');
}

function fmtDate2(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

function toggleHwDone(id) {
  const item = homeworkData.find(h => h.id === id);
  if (!item) return;
  item.done = !item.done;
  Storage.saveHomework(homeworkData);
  renderHomeworkList();
}

function openHwModal(item) {
  editingHwId = item ? item.id : null;
  const title = document.getElementById('hwModalTitle');
  if (title) title.textContent = item ? t('hwTaskTitle') : t('hwAdd');
  setValue('hwSubjectInput',  item ? (item.subject||'') : '');
  setValue('hwTitleInput',    item ? (item.title||'') : '');
  setValue('hwDueDateInput',  item ? (item.dueDate||'') : '');
  setValue('hwPriorityInput', item ? (item.priority||'mittel') : 'mittel');
  setValue('hwNotesInput',    item ? (item.notes||'') : '');
  document.getElementById('hwModalBg').classList.add('open');
}

function editHwItem(id) {
  const item = homeworkData.find(h => h.id === id);
  if (item) openHwModal(item);
}

function closeHwModal() {
  document.getElementById('hwModalBg').classList.remove('open');
  editingHwId = null;
}

function saveHwItem() {
  const subject  = getValue('hwSubjectInput').trim();
  const title    = getValue('hwTitleInput').trim();
  const dueDate  = getValue('hwDueDateInput');
  const priority = getValue('hwPriorityInput');
  const notes    = getValue('hwNotesInput').trim();

  if (!title) return;

  if (editingHwId) {
    const idx = homeworkData.findIndex(h => h.id === editingHwId);
    if (idx >= 0) {
      homeworkData[idx] = { ...homeworkData[idx], subject, title, dueDate, priority, notes };
    }
  } else {
    homeworkData.push({ id: uuid(), subject, title, dueDate, priority, notes, done: false, createdAt: Date.now() });
  }
  Storage.saveHomework(homeworkData);
  closeHwModal();
  renderHomeworkList();
}

function deleteHwItem(id) {
  if (!confirm(t('hwDeleteConfirm'))) return;
  homeworkData = homeworkData.filter(h => h.id !== id);
  Storage.saveHomework(homeworkData);
  renderHomeworkList();
}

// ══════════════════════════════════════════════════════════════════
//  GRADES
// ══════════════════════════════════════════════════════════════════
function renderGradesList() {
  const container = document.getElementById('grSubjectList');
  const empty     = document.getElementById('grEmpty');
  const overview  = document.getElementById('grOverview');
  if (!container) return;

  const subjects = Object.values(gradesData);

  // Always update stats row
  const allEntries = subjects.flatMap(s => s.entries || []);
  const grStatAvg   = document.getElementById('grStatAvg');
  const grStatBest  = document.getElementById('grStatBest');
  const grStatWorst = document.getElementById('grStatWorst');
  const grStatCount = document.getElementById('grStatCount');
  if (grStatCount) grStatCount.textContent = allEntries.length;
  if (allEntries.length > 0) {
    const vals = allEntries.map(e => parseFloat(e.value)).filter(v => !isNaN(v));
    if (grStatBest)  { const b = Math.min(...vals); grStatBest.textContent  = b.toFixed(1); grStatBest.style.color  = gradeColor(b); }
    if (grStatWorst) { const w = Math.max(...vals); grStatWorst.textContent = w.toFixed(1); grStatWorst.style.color = gradeColor(w); }
    let tw = 0, ts = 0;
    allEntries.forEach(e => { const wt = e.weight||1; ts += parseFloat(e.value)*wt; tw += wt; });
    if (grStatAvg) { const a = tw>0 ? ts/tw : null; grStatAvg.textContent = a!==null ? a.toFixed(1) : '–'; if(a) grStatAvg.style.color = gradeColor(a); }
  } else {
    if (grStatAvg)   { grStatAvg.textContent   = '–'; grStatAvg.style.color   = ''; }
    if (grStatBest)  { grStatBest.textContent  = '–'; grStatBest.style.color  = ''; }
    if (grStatWorst) { grStatWorst.textContent = '–'; grStatWorst.style.color = ''; }
  }
  if (subjects.length === 0) {
    container.innerHTML = '';
    empty.style.display   = '';
    overview.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  overview.style.display = '';

  // Compute overall average
  let totalWeight = 0, totalSum = 0;
  subjects.forEach(subj => {
    const avg = computeAverage(subj.entries || []);
    const weight = (subj.entries || []).reduce((a, e) => a + (e.weight || 1), 0);
    if (avg !== null) { totalSum += avg * weight; totalWeight += weight; }
  });
  const overall = totalWeight > 0 ? (totalSum / totalWeight) : null;
  const overallEl = document.getElementById('grOverallValue');
  if (overallEl) overallEl.textContent = overall !== null ? overall.toFixed(2) : '–';
  const fill = document.getElementById('grOverallFill');
  if (fill && overall !== null) {
    const pct = Math.max(0, Math.min(100, (1 - (overall - 1) / 5) * 100));
    fill.style.width = pct + '%';
    fill.style.background = gradeColor(overall);
  }

  // Update datalist
  const dl = document.getElementById('grSubjectSuggestions');
  if (dl) dl.innerHTML = subjects.map(s => `<option value="${esc(s.name)}">`).join('');

  container.innerHTML = subjects.map(subj => {
    const avg = computeAverage(subj.entries || []);
    const colorClass = avg ? getGradeClass(avg) : '';
    const entries = [...(subj.entries || [])].sort((a,b) => (b.date||'').localeCompare(a.date||''));
    return `
    <div class="gr-subject-card">
      <div class="gr-subject-header" onclick="toggleSubjectExpand('${subj.id}')">
        <div class="gr-subject-color" style="background:${subj.color || '#7c6af5'}"></div>
        <div class="gr-subject-name">${esc(subj.name)}</div>
        <div class="gr-subject-avg ${colorClass}" style="color:${gradeColor(avg)}">${avg !== null ? avg.toFixed(2) : '–'}</div>
        <button class="gr-del-btn" onclick="deleteSubject(event,'${subj.id}')">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
      <div class="gr-entries" id="grEntries-${subj.id}">
        ${entries.map(e => `
          <div class="gr-entry">
            <div class="gr-value" style="color:${gradeColor(e.value)}">${e.value}</div>
            <div class="gr-entry-info">
              <div class="gr-entry-type">${esc(e.type || '')}${e.ects ? ' · ' + e.ects + ' ECTS' : ''}</div>
              <div class="gr-entry-date">${e.date ? fmtDate2(e.date) : ''}</div>
              ${e.note ? `<div class="gr-entry-note">${esc(e.note)}</div>` : ''}
            </div>
            <div class="gr-entry-weight">×${e.weight||1}</div>
            <button class="gr-del-btn" onclick="deleteGradeEntry('${subj.id}','${e.id}')">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>`).join('')}
        <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:4px" onclick="openGradeModal('${subj.id}')">
          ${t('grAdd')}
        </button>
      </div>
    </div>`;
  }).join('');
}

function computeAverage(entries) {
  if (!entries || entries.length === 0) return null;
  let sum = 0, total = 0;
  entries.forEach(e => {
    const w = e.weight || 1;
    sum += parseFloat(e.value) * w;
    total += w;
  });
  return total > 0 ? sum / total : null;
}

function gradeColor(val) {
  if (val === null || val === undefined) return 'var(--text2)';
  const v = parseFloat(val);
  if (v <= 1.5) return '#22c55e';
  if (v <= 2.5) return '#84cc16';
  if (v <= 3.5) return '#eab308';
  if (v <= 4.0) return '#f97316';
  return '#ef4444';
}

function getGradeClass(val) {
  const v = parseFloat(val);
  if (v <= 1.5) return 'grade-1';
  if (v <= 2.5) return 'grade-2';
  if (v <= 3.5) return 'grade-3';
  if (v <= 4.0) return 'grade-4';
  return 'grade-5';
}

function toggleSubjectExpand(id) {
  const el = document.getElementById('grEntries-' + id);
  if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
}

function openGradeModal(prefilledSubjectId) {
  setValue('grSubjectInput', '');
  setValue('grValueInput', '');
  setValue('grWeightInput', '1');
  setValue('grTypeInput', 'Klausur');
  setValue('grDateInput', todayStr());
  setValue('grEctsInput', '');
  setValue('grNoteInput', '');

  if (prefilledSubjectId && gradesData[prefilledSubjectId]) {
    setValue('grSubjectInput', gradesData[prefilledSubjectId].name);
  }

  const ectsField = document.getElementById('grEctsField');
  if (ectsField) ectsField.style.display = (settings.mode === 'student') ? '' : 'none';

  document.getElementById('grModalBg').classList.add('open');
}

function closeGradeModal() {
  document.getElementById('grModalBg').classList.remove('open');
}

function saveGradeEntry() {
  const subjectName = getValue('grSubjectInput').trim();
  const val         = parseFloat(getValue('grValueInput'));
  if (!subjectName || isNaN(val)) return;

  const entry = {
    id:     uuid(),
    value:  val,
    weight: parseInt(getValue('grWeightInput')) || 1,
    type:   getValue('grTypeInput'),
    date:   getValue('grDateInput'),
    ects:   getValue('grEctsInput') || '',
    note:   getValue('grNoteInput'),
  };

  // Find or create subject
  let subj = Object.values(gradesData).find(s => s.name.toLowerCase() === subjectName.toLowerCase());
  if (!subj) {
    const id = uuid();
    subj = { id, name: subjectName, color: GRADE_COLORS[Object.keys(gradesData).length % GRADE_COLORS.length], entries: [] };
    gradesData[id] = subj;
  }
  subj.entries = subj.entries || [];
  subj.entries.push(entry);

  Storage.saveGrades(gradesData);
  closeGradeModal();
  renderGradesList();
}

function deleteSubject(e, id) {
  e.stopPropagation();
  if (!confirm(t('grDeleteSubject'))) return;
  delete gradesData[id];
  Storage.saveGrades(gradesData);
  renderGradesList();
}

function deleteGradeEntry(subjectId, entryId) {
  if (!confirm(t('grDeleteEntry'))) return;
  const subj = gradesData[subjectId];
  if (!subj) return;
  subj.entries = (subj.entries || []).filter(e => e.id !== entryId);
  if (subj.entries.length === 0) delete gradesData[subjectId];
  Storage.saveGrades(gradesData);
  renderGradesList();
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════════════════════════
//  SCHOOL NETWORK
// ══════════════════════════════════════════════════════════════════
function renderSchoolPortal() {
  const container = document.getElementById('schoolPortalView');
  if (!container) return;

  const url  = settings.portalUrl  || '';
  const name = settings.portalName || '';
  const type = settings.portalType || 'iserv';

  if (!url) {
    container.innerHTML = `
      <div class="no-portal-hint">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <h3 data-i18n="schNoPortal">${t('schNoPortal')}</h3>
        <p>${t('schConfigureFirst')}</p>
      </div>`;
    return;
  }

  const isIserv = type === 'iserv';
  const icon = type === 'iserv' ? '🏫' : type === 'moodle' ? '📚' : type === 'webuntis' ? '📅' : '🌐';

  const quickLinks = isIserv ? [
    { label: t('schMail'),      path: '/iserv/mail',         icon: '✉️' },
    { label: t('schFiles'),     path: '/iserv/file',         icon: '📁' },
    { label: t('schCalendar'),  path: '/iserv/calendar',     icon: '📅' },
    { label: t('schTasks'),     path: '/iserv/exercise',     icon: '📝' },
    { label: t('schDashboard'), path: '/iserv/dashboard',    icon: '🏠' },
    { label: 'Nachrichten',     path: '/iserv/notification', icon: '🔔' },
  ] : [
    { label: t('schMail'),      path: '/messages', icon: '✉️' },
    { label: t('schCalendar'),  path: '/calendar', icon: '📅' },
    { label: t('schTasks'),     path: '/courses',  icon: '📝' },
    { label: t('schDashboard'), path: '/',         icon: '🏠' },
  ];

  container.innerHTML = `
    <div class="school-portal-card">
      <div class="portal-header">
        <div class="portal-icon">${icon}</div>
        <div>
          <div class="portal-name">${esc(name || t('schTitle'))}</div>
          <div class="portal-url">${esc(url)}</div>
        </div>
        <a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-left:auto">
          ${t('schOpenPortal')} ↗
        </a>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:6px">${t('schQuickLinks')}</div>
      <div class="portal-quicklinks">
        ${quickLinks.map(ql => `
          <a class="portal-ql-btn" href="${safeUrl(url + ql.path)}" target="_blank" rel="noopener noreferrer">
            <span style="font-size:20px">${ql.icon}</span>
            <span>${ql.label}</span>
          </a>`).join('')}
      </div>
    </div>`;
}

function safeUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '#';
    return url;
  } catch { return '#'; }
}

// ══════════════════════════════════════════════════════════════════
//  LEGAL
// ══════════════════════════════════════════════════════════════════
const LEGAL_CONTENT = {
  imprint: {
    de: '<h3>Anbieter &amp; Verantwortlicher</h3><p>KX KroniX Tech<br>E-Mail: contact@kronix-tech.com<br>Website: kronix-tech.com</p>' +
        '<h3>Impressumspflicht (§ 5 TMG)</h3><p>Für eine rein private, nicht-kommerzielle App entfällt die gesetzliche Impressumspflicht. Sobald die App öffentlich angeboten wird (Play Store, Webseite etc.), ist ein vollständiges Impressum mit Name, Anschrift und erreichbarer E-Mail gesetzlich verpflichtend.</p>' +
        '<h3>Haftungsausschluss</h3><p>Die Inhalte wurden mit größtmöglicher Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit oder Aktualität wird keine Haftung übernommen.</p>' +
        '<h3>Drittanbieter-Lizenzen</h3><p>Electron (MIT) · electron-builder (MIT) · @capacitor/core (MIT) · @capacitor/android (MIT)<br>Vollständige Liste in <code>package.json</code>.</p>',
    en: '<h3>Provider &amp; Responsible Party</h3><p>KX KroniX Tech<br>E-Mail: contact@kronix-tech.com<br>Website: kronix-tech.com</p>' +
        '<h3>Legal Notice</h3><p>For a purely private, non-commercial app, there is no legal obligation to provide an imprint. Once publicly offered, a full imprint including name, address, and reachable email is legally required.</p>' +
        '<h3>Disclaimer</h3><p>Content has been compiled with the greatest possible care. No liability is accepted for accuracy or completeness.</p>' +
        '<h3>Third-Party Licenses</h3><p>Electron (MIT) · electron-builder (MIT) · @capacitor/core (MIT) · @capacitor/android (MIT)<br>Full list in <code>package.json</code>.</p>',
  },
  privacy: {
    de: '<h3>Grundsatz</h3><p>StudyLane erhebt <b>keine personenbezogenen Daten</b> und sendet <b>keine Daten an externe Server</b>, solange die SMTP-Funktion nicht aktiv genutzt wird.</p>' +
        '<h3>Lokal gespeicherte Daten</h3><p>Alle Daten werden ausschließlich im <code>localStorage</code> gespeichert:<br><code>studylane_schedules</code> – Stundenpläne<br><code>studylane_settings</code> – Sprache, Modus, SMTP-Konfiguration<br><code>studylane_student</code> – Studenten-Daten &amp; Notizen</p>' +
        '<p>Es werden keine Analyse-Tools, Tracking-Dienste, Cookies oder Werbedienste eingesetzt.</p>' +
        '<h3>SMTP / E-Mail (optional)</h3><p>SMTP-Zugangsdaten werden lokal in <code>studylane_settings</code> gespeichert und nur für den konfigurierten Server verwendet. KroniX Tech hat keinen Zugriff auf diese Daten.</p>' +
        '<h3>Daten löschen</h3><p><b>Einstellungen → Alle Daten löschen</b> · oder App deinstallieren.</p>' +
        '<h3>DSGVO / Datenschutzanfragen</h3><p>Da keine personenbezogenen Daten zentral verarbeitet werden, entfällt eine zentrale Datenhaltung. Anfragen: contact@kronix-tech.com</p>',
    en: '<h3>Principle</h3><p>StudyLane collects <b>no personal data</b> and transmits <b>no data to external servers</b>, unless the SMTP function is actively used.</p>' +
        '<h3>Locally Stored Data</h3><p>All data is stored exclusively in the device\'s <code>localStorage</code>:<br><code>studylane_schedules</code> – Schedules<br><code>studylane_settings</code> – Language, mode, SMTP config<br><code>studylane_student</code> – Student data &amp; notes</p>' +
        '<p>No analytics, tracking services, cookies, or advertising services are used.</p>' +
        '<h3>SMTP / Email (optional)</h3><p>SMTP credentials are stored locally and used only for the configured server. KroniX Tech has no access to this data.</p>' +
        '<h3>Delete Your Data</h3><p><b>Settings → Delete all data</b> · or uninstall the app.</p>' +
        '<h3>GDPR / Privacy Inquiries</h3><p>Since no personal data is centrally processed, there is no central data storage. Inquiries: contact@kronix-tech.com</p>',
  },
  terms: {
    de: '<h3>Nutzungsrecht</h3><p>StudyLane wird kostenlos bereitgestellt. Die Nutzung ist für legale, persönliche oder schulische bzw. akademische Zwecke gestattet.</p>' +
        '<h3>Verbotene Nutzung</h3><p>• Reverse Engineering zur kommerziellen Vervielfältigung<br>• Verbreitung modifizierter Versionen ohne schriftliche Genehmigung<br>• Verwendung für Spam, Betrug oder zur Umgehung technischer Schutzmaßnahmen</p>' +
        '<h3>Verfügbarkeit</h3><p>Es wird keine Garantie für die dauerhafte Verfügbarkeit der App oder Web-Version übernommen. Updates können ohne Ankündigung veröffentlicht werden.</p>' +
        '<h3>Haftungsausschluss &amp; Datenverlust</h3><p>Die App wird „wie besehen" bereitgestellt. Da alle Daten lokal gespeichert werden, liegt die Verantwortung für Datensicherung beim Nutzer. KroniX Tech haftet nicht für Datenverluste durch Gerätewechsel, Deinstallation oder Cache-Löschung.</p>' +
        '<h3>Copyright</h3><p>© 2026 KX KroniX Tech – Alle Rechte vorbehalten.<br><b>StudyLane</b> und das <b>SL-Logo</b> sind Kennzeichen von KX KroniX Tech. Nutzung ohne schriftliche Genehmigung ist untersagt.</p>',
    en: '<h3>Right of Use</h3><p>StudyLane is provided free of charge. Use is permitted for legal, personal, or business purposes.</p>' +
        '<h3>Prohibited Use</h3><p>• Reverse engineering for commercial reproduction<br>• Distribution of modified versions without written consent<br>• Use for spam, fraud, or circumvention of security measures</p>' +
        '<h3>Availability</h3><p>No guarantee is made for the permanent availability of the app or web version. Updates may be released without prior notice.</p>' +
        '<h3>Disclaimer &amp; Data Loss</h3><p>The app is provided "as is". Since all data is stored locally, the user is responsible for data backup. KroniX Tech is not liable for data loss due to device changes, uninstallation, or cache clearing.</p>' +
        '<h3>Copyright</h3><p>© 2026 KX KroniX Tech – All rights reserved.<br><b>StudyLane</b> and the <b>SL logo</b> are marks of KX KroniX Tech. Use without written consent is prohibited.</p>',
  },
};

function showLegalModal(type) {
  switchLegalTab(type || 'imprint');
  document.getElementById('legalModalBg').classList.add('open');
}

function switchLegalTab(type) {
  ['imprint', 'privacy', 'terms'].forEach(function(k) {
    var btn = document.getElementById('legalTab-' + k);
    if (btn) btn.classList.toggle('active', k === type);
  });
  var lang = currentLang || 'de';
  var html = (LEGAL_CONTENT[type] || {})[lang] || (LEGAL_CONTENT[type] || {})['en'] || '';
  document.getElementById('legalModalContent').innerHTML = html;
}

function closeLegalModal() {
  document.getElementById('legalModalBg').classList.remove('open');
}

// ══════════════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════════════
let _toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ══════════════════════════════════════════════════════════════════
//  PWA
// ══════════════════════════════════════════════════════════════════
function setupPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('installBanner');
    const btn    = document.getElementById('installBtn');
    if (banner) banner.classList.add('visible');
    if (btn) btn.onclick = () => {
      banner.classList.remove('visible');
      deferredPrompt.prompt();
    };
  });
  const dismiss = document.getElementById('installDismiss');
  if (dismiss) dismiss.onclick = () => {
    document.getElementById('installBanner').classList.remove('visible');
  };
}

// ══════════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════════
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
