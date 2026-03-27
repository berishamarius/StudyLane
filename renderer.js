/* ═══════════════════════════════════════════════════════════════
   renderer.js  –  StudyLane
   Workplan + Reports + Azubi + Settings
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

const CELL_COLORS = [
  '#7c6af5','#a855f7','#ec4899','#ef4444',
  '#f59e0b','#22c55e','#3b82f6','#64748b',
  '#14b8a6','#f97316','#0ea5e9','#8b5cf6',
];

const GRADE_COLORS = ['#7c6af5','#ec4899','#22c55e','#f59e0b','#3b82f6','#ef4444','#14b8a6','#f97316','#a855f7','#0ea5e9'];

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
    settings.mode = 'mitarbeiter';
    settings.gradeSystem = 'school';
    settings._v = 1;
    Storage.saveSettings(settings);
  }

  const osSuggest = (navigator.language || '').split('-')[0].toLowerCase();
  const supported = LANGUAGES.map(l => l.code);
  const lang = settings.lang || (supported.includes(osSuggest) ? osSuggest : 'de');
  if (!settings.lang) { settings.lang = lang; Storage.saveSettings(settings); }

  setLanguage(lang);
  renderLangDropdown();
  renderLangGrid();

  schedules    = Storage.loadSchedules();
  homeworkData = Storage.loadHomework();
  gradesData   = Storage.loadGrades();

  populateSettingsForm();
  renderDefaultSlotsList();
  renderScheduleList();
  renderHomeworkList();
  renderGradesList();
  renderSchoolPortal();
  applyMode();
  setupPWA();

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
  document.getElementById('langPicker').classList.add('open');
  document.addEventListener('click', outsideLangClose, { once: true });
}
function closeLangMenu()  { document.getElementById('langPicker').classList.remove('open'); }
function outsideLangClose(e) {
  if (!document.getElementById('langPicker').contains(e.target)) closeLangMenu();
}

function renderLangDropdown() {
  const dd = document.getElementById('langDropdown');
  if (!dd) return;
  dd.innerHTML = LANGUAGES.map(l => `
    <div class="lang-option ${l.code === currentLang ? 'active' : ''}" onclick="switchLang('${l.code}')">
      <span class="lang-flag">${l.flag}</span>
      <span class="lang-name">${l.label}</span>
      ${l.code === currentLang ? '<span class="lang-check">✓</span>' : ''}
    </div>`).join('');
}

function renderLangGrid() {
  const grid = document.getElementById('langGrid');
  if (!grid) return;
  grid.innerHTML = LANGUAGES.map(l => `
    <button class="lang-grid-btn ${l.code === currentLang ? 'active' : ''}" onclick="switchLang('${l.code}')">
      <span class="lf">${l.flag}</span>
      <span>${l.label}</span>
    </button>`).join('');
}

function switchLang(code) {
  settings.lang = code;
  Storage.saveSettings(settings);
  setLanguage(code);
  renderLangDropdown();
  renderLangGrid();
  closeLangMenu();
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
  const mode = settings.mode || 'mitarbeiter';
  ['mitarbeiter','azubi'].forEach(m => {
    const btn = document.getElementById('mode' + cap(m) + 'Btn');
    if (btn) btn.classList.toggle('active', m === mode);
  });
  // Toggle body class for CSS-based nav/button switching
  document.body.classList.toggle('mode-mitarbeiter', mode === 'mitarbeiter');
  document.body.classList.toggle('mode-azubi',       mode === 'azubi');
  // Show/hide ECTS field in grade modal
  const ectsField = document.getElementById('grEctsField');
  if (ectsField) ectsField.style.display = mode === 'azubi' ? '' : 'none';
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
  if (id === 'grades')  renderGradesList();
  if (id === 'school')  renderSchoolPortal();
  if (id === 'homework') renderHomeworkList();
  if (id === 'azubi') { /* azubi page rendered statically */ }
}

// ══════════════════════════════════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════════════════════════════════
function populateSettingsForm() {
  setValue('settingName',      settings.profileName     || '');
  setValue('settingSchool',    settings.profileSchool   || '');
  setValue('settingClass',     settings.profileClass    || '');
  setValue('settingSemester',  settings.profileSemester || '');
  setValue('settingGradeSystem', settings.gradeSystem   || 'school');
  setValue('settingPortalName', settings.portalName     || '');
  setValue('settingPortalUrl',  settings.portalUrl      || '');
  setValue('settingPortalType', settings.portalType     || 'iserv');
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function saveSettings(showToast) {
  settings.profileName     = getValue('settingName');
  settings.profileSchool   = getValue('settingSchool');
  settings.profileClass    = getValue('settingClass');
  settings.profileSemester = getValue('settingSemester');
  settings.gradeSystem     = getValue('settingGradeSystem') || 'school';
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
  list.innerHTML = filtered.map(s => `
    <div class="schedule-card" onclick="openSchedule('${s.id}')">
      <div class="schedule-card-info">
        <div class="schedule-card-name">${esc(s.name || t('unnamed'))}</div>
        <div class="schedule-card-meta">
          ${s.from && s.to ? esc(s.from) + ' – ' + esc(s.to) + ' · ' : ''}
          ${t('lastChanged')}${fmtDate(s.updatedAt)}
        </div>
      </div>
      <button class="schedule-card-delete" onclick="deleteSchedule(event,'${s.id}')">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`).join('');
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
  const tr = TRANSLATIONS[currentLang] || TRANSLATIONS['de'];
  return ['Mo','Di','Mi','Do','Fr'];
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
  const cols  = days.length + 1;

  grid.style.gridTemplateColumns = `60px repeat(${days.length}, minmax(90px,1fr))`;

  let html = '<div class="timetable-header" style="background:transparent"></div>';
  days.forEach(d => { html += `<div class="timetable-header">${esc(d)}</div>`; });

  slots.forEach((slot, si) => {
    html += `<div class="timetable-slot-label">${esc(slot)}</div>`;
    days.forEach((_, di) => {
      const key  = `${di}-${si}`;
      const cell = (current.grid || {})[key] || {};
      const subj = (current.subjects || []).find(s => s.id === cell.subjectId);
      const bg   = cell.colorOverride || (subj ? subj.color : '');
      const name = subj ? subj.name : '';
      html += `<div class="timetable-cell ${name ? 'filled' : ''}"
        style="${bg ? 'background:' + bg + '22;border-color:' + bg + '55' : ''}"
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
  subjectSel.innerHTML = `<option value="">– ${t('chooseSubject' in TRANSLATIONS[currentLang||'de'] ? 'chooseSubject' : 'lesson')} –</option>` +
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

  const today    = new Date(); today.setHours(0,0,0,0);
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
          + ${t('grAdd')}
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
        '<h3>Lokal gespeicherte Daten</h3><p>Alle Daten werden ausschließlich im <code>localStorage</code> gespeichert:<br><code>studylane_schedules</code> – Stundenpläne<br><code>studylane_settings</code> – Sprache, Modus, SMTP-Konfiguration<br><code>studylane_azubi</code> – Azubi-Daten &amp; Notizen</p>' +
        '<p>Es werden keine Analyse-Tools, Tracking-Dienste, Cookies oder Werbedienste eingesetzt.</p>' +
        '<h3>SMTP / E-Mail (optional)</h3><p>SMTP-Zugangsdaten werden lokal in <code>studylane_settings</code> gespeichert und nur für den konfigurierten Server verwendet. KroniX Tech hat keinen Zugriff auf diese Daten.</p>' +
        '<h3>Daten löschen</h3><p><b>Einstellungen → Alle Daten löschen</b> · oder App deinstallieren.</p>' +
        '<h3>DSGVO / Datenschutzanfragen</h3><p>Da keine personenbezogenen Daten zentral verarbeitet werden, entfällt eine zentrale Datenhaltung. Anfragen: contact@kronix-tech.com</p>',
    en: '<h3>Principle</h3><p>StudyLane collects <b>no personal data</b> and transmits <b>no data to external servers</b>, unless the SMTP function is actively used.</p>' +
        '<h3>Locally Stored Data</h3><p>All data is stored exclusively in the device\'s <code>localStorage</code>:<br><code>studylane_schedules</code> – Schedules<br><code>studylane_settings</code> – Language, mode, SMTP config<br><code>studylane_azubi</code> – Trainee data &amp; notes</p>' +
        '<p>No analytics, tracking services, cookies, or advertising services are used.</p>' +
        '<h3>SMTP / Email (optional)</h3><p>SMTP credentials are stored locally and used only for the configured server. KroniX Tech has no access to this data.</p>' +
        '<h3>Delete Your Data</h3><p><b>Settings → Delete all data</b> · or uninstall the app.</p>' +
        '<h3>GDPR / Privacy Inquiries</h3><p>Since no personal data is centrally processed, there is no central data storage. Inquiries: contact@kronix-tech.com</p>',
  },
  terms: {
    de: '<h3>Nutzungsrecht</h3><p>StudyLane wird kostenlos bereitgestellt. Die Nutzung ist für legale, persönliche oder betriebliche Zwecke gestattet.</p>' +
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
    pl: `StudyLane – KX KroniX Tech\nKontakt: contact@kronix-tech.com`,
    pt: `StudyLane – KX KroniX Tech\nContato: contact@kronix-tech.com`,
    ru: `StudyLane – KX KroniX Tech\nКонтакт: contact@kronix-tech.com`,
    tr: `StudyLane – KX KroniX Tech\nİletişim: contact@kronix-tech.com`,
    uk: `StudyLane – KX KroniX Tech\nКонтакт: contact@kronix-tech.com`,
    zh: `StudyLane – KX KroniX Tech\n联系方式：contact@kronix-tech.com`,
  },
  privacy: {
    de: `StudyLane speichert alle Daten ausschließlich lokal auf Ihrem Gerät (localStorage). Es werden keine Daten an externe Server übertragen.`,
    en: `StudyLane stores all data exclusively on your device (localStorage). No data is transmitted to external servers.`,
    ar: `يخزّن StudyLane جميع البيانات محلياً على جهازك (localStorage). لا تُرسل أي بيانات إلى خوادم خارجية.`,
    es: `StudyLane almacena todos los datos exclusivamente en tu dispositivo (localStorage). No se transmite ningún dato a servidores externos.`,
    fr: `StudyLane stocke toutes les données exclusivement sur votre appareil (localStorage). Aucune donnée n'est transmise à des serveurs externes.`,
    hi: `StudyLane सभी डेटा केवल आपके डिवाइस पर (localStorage) संग्रहीत करता है। कोई भी डेटा बाहरी सर्वर पर नहीं भेजा जाता।`,
    it: `StudyLane archivia tutti i dati esclusivamente sul tuo dispositivo (localStorage). Nessun dato viene trasmesso a server esterni.`,
    ja: `StudyLaneはすべてのデータをお使いのデバイス（localStorage）にのみ保存します。外部サーバーへのデータ送信は行いません。`,
    ko: `StudyLane은 모든 데이터를 귀하의 기기(localStorage)에만 저장합니다. 외부 서버로 데이터가 전송되지 않습니다.`,
    pl: `StudyLane przechowuje wszystkie dane wyłącznie na Twoim urządzeniu (localStorage). Żadne dane nie są przesyłane do zewnętrznych serwerów.`,
    pt: `StudyLane armazena todos os dados exclusivamente no seu dispositivo (localStorage). Nenhum dado é transmitido a servidores externos.`,
    ru: `StudyLane хранит все данные исключительно на вашем устройстве (localStorage). Данные не передаются на внешние серверы.`,
    tr: `StudyLane tüm verileri yalnızca cihazınızda (localStorage) depolar. Hiçbir veri harici sunuculara iletilmez.`,
    uk: `StudyLane зберігає всі дані виключно на вашому пристрої (localStorage). Жодні дані не передаються на зовнішні сервери.`,
    zh: `StudyLane仅将所有数据存储在您的设备上（localStorage）。不向外部服务器传输任何数据。`,
  },
  terms: {
    de: `StudyLane wird "wie besehen" bereitgestellt. Die Nutzung erfolgt auf eigene Verantwortung. KX KroniX Tech übernimmt keine Haftung für Datenverlust.`,
    en: `StudyLane is provided "as is". Use at your own risk. KX KroniX Tech accepts no liability for data loss.`,
    ar: `يُقدَّم StudyLane "كما هو". الاستخدام على مسؤوليتك الخاصة. لا تتحمل KX KroniX Tech أي مسؤولية عن فقدان البيانات.`,
    es: `StudyLane se proporciona "tal cual". El uso es bajo tu propia responsabilidad. KX KroniX Tech no acepta responsabilidad por pérdida de datos.`,
    fr: `StudyLane est fourni "tel quel". L'utilisation se fait à vos risques. KX KroniX Tech n'assume aucune responsabilité pour la perte de données.`,
    hi: `StudyLane "जैसा है" प्रदान किया जाता है। उपयोग अपनी जिम्मेदारी पर। KX KroniX Tech डेटा हानि के लिए कोई दायित्व स्वीकार नहीं करता।`,
    it: `StudyLane è fornito "così com'è". L'uso è a proprio rischio. KX KroniX Tech non si assume responsabilità per la perdita di dati.`,
    ja: `StudyLaneは「現状のまま」提供されます。使用は自己責任です。KX KroniX Techはデータ損失に対して一切の責任を負いません。`,
    ko: `StudyLane은 "있는 그대로" 제공됩니다. 사용은 본인 책임입니다. KX KroniX Tech는 데이터 손실에 대한 책임을 지지 않습니다.`,
    pl: `StudyLane jest dostarczany "tak jak jest". Korzystanie odbywa się na własną odpowiedzialność. KX KroniX Tech nie ponosi odpowiedzialności za utratę danych.`,
    pt: `StudyLane é fornecido "como está". O uso é por sua conta e risco. KX KroniX Tech não aceita responsabilidade por perda de dados.`,
    ru: `StudyLane предоставляется "как есть". Использование осуществляется на ваш страх и риск. KX KroniX Tech не несёт ответственности за потерю данных.`,
    tr: `StudyLane "olduğu gibi" sunulmaktadır. Kullanım kendi sorumluluğunuzdadır. KX KroniX Tech veri kaybından sorumlu değildir.`,
    uk: `StudyLane надається "як є". Використання здійснюється на власний ризик. KX KroniX Tech не несе відповідальності за втрату даних.`,
    zh: `StudyLane按"原样"提供。使用风险自负。KX KroniX Tech不承担数据丢失的责任。`,
  },
};

function showLegalModal(type) {
  const lang    = currentLang || 'de';
  const content = (LEGAL_CONTENT[type] || {})[lang] || (LEGAL_CONTENT[type] || {})['en'] || '';
  const titles  = { imprint: t('imprintTitle'), privacy: t('privacyTitle'), terms: t('termsTitle') };
  document.getElementById('legalModalTitle').textContent = titles[type] || '';
  document.getElementById('legalModalContent').textContent = content;
  document.getElementById('legalModalBg').classList.add('open');
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
