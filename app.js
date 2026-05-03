const state = {
  page: 'dashboard',
  user: null,
  profile: null,
  demoMode: false,
  tasks: [],
  messages: [],
  notifications: [],
  notifUnread: 0,
  courses: [],
  invites: [],
  calendarEvents: [],
  calendarYear: null,
  calendarMonth: null,
  ui: {
    studyMode: 'school',
    schoolStage: 'grade-9-10',
    uniSemester: 'semester-1-2',
    examMode: 'balanced',
    country: 'de',
  },
  taskFilter: 'all',
  chat: {
    currentRoomId: null,
    messagesByRoom: {},
  },
};

const UI_SETTINGS_KEY = 'nexus_ui_settings';
const DEMO_MODE_KEY = 'nexus_demo_mode';
const AUTH_REMEMBER_KEY = 'nexus_remember_me';
const FORCE_DEMO_MODE = true;
const LEARN_BOOKMARKS_KEY = 'nexus_learn_bookmarks_v1';
const PLANNER_SCHEDULE_KEY = 'nexus_planner_schedule_v1'; // legacy
const TIMETABLE_KEY = 'nexus_timetable_v2';
const PLANER_TASKS_KEY = 'nexus_planer_tasks_v1';
// Default time labels for 12 timetable periods
const TIMETABLE_SLOTS = [
  '07:00','07:45','08:45','09:30','10:30','11:15','12:15','13:00','14:00','14:45','15:45','16:30'
];

const tr = (key, fallback) => {
  if (typeof t === 'function') {
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return fallback || key;
};

const isDemoModeEnabled = () => {
  if (FORCE_DEMO_MODE) return true;
  const urlFlag = new URLSearchParams(window.location.search).get('demo');
  if (urlFlag === '1') return true;
  return localStorage.getItem(DEMO_MODE_KEY) === '1';
};

const getActiveLanguage = () => {
  if (typeof currentLang === 'string' && currentLang) return currentLang;
  if (typeof window.currentLang === 'string' && window.currentLang) return window.currentLang;
  return (navigator.language || 'en');
};

// Eastern Arabic and Persian digit maps for locale-aware number formatting
const _EAD = '٠١٢٣٤٥٦٧٨٩'; // Eastern Arabic digits (used in ar, ar-PS)
const _PD  = '۰۱۲۳۴۵۶۷۸۹'; // Persian/Urdu digits  (used in fa, ur)
const formatNumber = (n, lang) => {
  if (n === undefined || n === null) return '';
  const str = String(n);
  const l = lang || getActiveLanguage();
  if (l === 'ar' || l === 'ar-PS') return str.replace(/[0-9]/g, d => _EAD[Number(d)]);
  if (l === 'fa' || l === 'ur')    return str.replace(/[0-9]/g, d => _PD[Number(d)]);
  return str;
};
window.formatNumber = formatNumber;

const localizeLearnText = async (text, lang) => {
  const normalized = (lang || 'en').toLowerCase();
  if (normalized.startsWith('en')) return text;
  if (typeof window.translateText !== 'function') return text;
  return window.translateText(text, normalized);
};

window.translateText = async (text, targetLang) => {
  if (!text || !targetLang || targetLang.toLowerCase().startsWith('en')) return text;
  try {
    const lang = encodeURIComponent(targetLang.toLowerCase());
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) return text;
    return data[0].map((part) => part[0] || '').join('') || text;
  } catch {
    return text;
  }
};

const applyTheme = () => {
  document.body.classList.toggle('dark', state.ui.theme === 'dark');
};

const setTheme = (theme) => {
  if (theme !== 'light' && theme !== 'dark') return;
  state.ui.theme = theme;
  saveUiSettings();
  applyTheme();
  renderSettings();
  Notifications.show(tr('settingsThemeSaved', theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'));
};

const getLearningContextLine = (mode) => {
  if (mode === 'school') {
    const map = {
      'grade-5-6': tr('learnSchoolStage56', 'School stage: Grade 5-6'),
      'grade-7-8': tr('learnSchoolStage78', 'School stage: Grade 7-8'),
      'grade-9-10': tr('learnSchoolStage910', 'School stage: Grade 9-10'),
      'grade-11-13': tr('learnSchoolStage1113', 'School stage: Grade 11-13'),
    };
    return map[state.ui.schoolStage] || map['grade-9-10'];
  }

  const map = {
    'semester-1-2': tr('learnUniSem12', 'University stage: Semester 1-2'),
    'semester-3-4': tr('learnUniSem34', 'University stage: Semester 3-4'),
    'semester-5-6': tr('learnUniSem56', 'University stage: Semester 5-6'),
    'semester-7-plus': tr('learnUniSem7Plus', 'University stage: Semester 7+'),
  };
  return map[state.ui.uniSemester] || map['semester-1-2'];
};

const buildSimpleLessonPlan = (topic, mode) => {
  const isUni = mode === 'university';
  const examMode = state.ui.examMode || 'balanced';
  const examHint = {
    basics: tr('learnExamBasicsHint', 'Focus mode: strong basics first, then a small practice set.'),
    balanced: tr('learnExamBalancedHint', 'Focus mode: balanced understanding, practice, and review.'),
    exam: tr('learnExamHardHint', 'Focus mode: exam-style tasks with time pressure and quick feedback.'),
  }[examMode] || tr('learnExamBalancedHint', 'Focus mode: balanced understanding, practice, and review.');

  return {
    level: isUni ? tr('learnLevelIntermediate', 'Intermediate') : tr('learnLevelBasic', 'Basic'),
    explain: isUni
      ? `${tr('learnExplainPrefix', 'In simple terms')}: ${topic} ${tr('learnExplainUni', 'means understanding the main concept, why it matters, and where it is applied in study or practice.')}`
      : `${tr('learnExplainPrefix', 'In simple terms')}: ${topic} ${tr('learnExplainSchool', 'means learning one core idea at a time, then using easy examples to practice it.')}`,
    steps: [
      tr('learnStep1', 'Read the short explanation once.'),
      tr('learnStep2', 'Write the key idea in your own words.'),
      tr('learnStep3', 'Solve one mini task and check mistakes.'),
    ],
    miniTask: `${tr('learnMiniTask', 'Mini task')}: ${tr('learnMiniTaskAbout', 'Give one example for')} ${topic.toLowerCase()} ${tr('learnMiniTaskAndWhy', 'and explain why it fits.')}`,
    hint: `${tr('learnHintSimple', 'Tip: If it feels hard, split the topic into smaller parts and repeat with one example each.')} ${examHint}`,
  };
};

const loadLearnBookmarks = () => {
  try {
    const raw = localStorage.getItem(LEARN_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLearnBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(LEARN_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // Ignore storage write failures.
  }
};

const setLearnBookmark = (bookmark) => {
  const all = loadLearnBookmarks();
  all[bookmark.mode] = {
    ...bookmark,
    updatedAt: new Date().toISOString(),
  };
  saveLearnBookmarks(all);
};

const getLearnBookmark = (mode) => {
  const all = loadLearnBookmarks();
  return all[mode] || null;
};

const showAuthPanel = (panel) => {
  const loginEl = document.getElementById('authPanelLogin');
  const regEl = document.getElementById('authPanelRegister');
  const loginBtn = document.getElementById('authShowLogin');
  const regBtn = document.getElementById('authShowRegister');
  if (!loginEl || !regEl) return;
  loginEl.classList.toggle('hidden', panel !== 'login');
  regEl.classList.toggle('hidden', panel !== 'register');
  loginBtn?.classList.toggle('active', panel === 'login');
  regBtn?.classList.toggle('active', panel === 'register');
};

const showAuthTab = (tab) => {
  const loginTab = document.getElementById('tabLogin');
  const registerTab = document.getElementById('tabRegister');
  if (loginTab && registerTab) {
    loginTab.classList.toggle('active', tab === 'login');
    registerTab.classList.toggle('active', tab === 'register');
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
  }
};

const setAuthMode = (mode) => {
  const studentTab = document.querySelector('.auth-form-tabs .auth-tab:first-child');
  const teacherTab = document.querySelector('.auth-form-tabs .auth-tab:last-child');
  const teacherFields = document.getElementById('teacherFields');
  const loginSubmit = document.getElementById('loginSubmit');
  const loginRole = document.getElementById('loginRole');

  if (!studentTab || !teacherTab || !teacherFields || !loginSubmit || !loginRole) return;
  studentTab.classList.toggle('active', mode === 'student');
  teacherTab.classList.toggle('active', mode === 'teacher');
  teacherFields.classList.toggle('hidden', mode !== 'teacher');
  loginRole.value = mode;
  loginSubmit.textContent = mode === 'teacher' ? 'Sign in as Lecturer' : 'Continue as student';
};

const setPageTitle = (title) => {
  document.getElementById('topbarTitle').textContent = title;
};

const PAGE_TITLE_KEYS = {
  dashboard: { key: 'pageDashboard', fallback: 'Dashboard' },
  courses: { key: 'pageCourses', fallback: 'Courses' },
  'course-detail': { key: 'pageCourseDetail', fallback: 'Course Details' },
  tasks: { key: 'pageTasks', fallback: 'Tasks' },
  messages: { key: 'pageMessages', fallback: 'Messages' },
  files: { key: 'pageFiles', fallback: 'Files' },
  calendar: { key: 'pageCalendar', fallback: 'Calendar' },
  grades: { key: 'pageGrades', fallback: 'Grades' },
  learn: { key: 'pageLearn', fallback: 'Learn' },
  settings: { key: 'pageSettings', fallback: 'Settings' },
  profile: { key: 'pageProfile', fallback: 'Profile' },
  'teacher-tools': { key: 'pageTeacherTools', fallback: 'Teacher tools' },
  admin: { key: 'pageAdmin', fallback: 'Users & Roles' },
  invites: { key: 'pageInvites', fallback: 'Invite Codes' },
};

const getPageTitle = (page) => {
  const config = PAGE_TITLE_KEYS[page];
  if (!config) return page.charAt(0).toUpperCase() + page.slice(1);
  return tr(config.key, config.fallback);
};

const navigate = (page) => {
  state.page = page;
  document.querySelectorAll('.page').forEach((section) => section.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach((link) => link.classList.toggle('active', link.dataset.page === page));
  setPageTitle(getPageTitle(page));
  closeSidebar();
  loadPage(page);
};

const loginSkeleton = (container) => {
  container.innerHTML = `<div class="card"><div class="dash-card-title">Loading…</div><div class="dash-list-placeholder">Please wait while data loads.</div></div>`;
};

const loadPage = async (page) => {
  switch (page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'courses':
      await renderCourses();
      break;
    case 'tasks':
      renderTasks();
      break;
    case 'messages':
      renderMessages();
      break;
    case 'files':
      renderFiles();
      break;
    case 'calendar':
      renderCalendar();
      break;
    case 'grades':
      renderGrades();
      break;
    case 'teacher-tools':
      renderTeacherTools();
      break;
    case 'learn':
      renderLearn();
      break;
    case 'settings':
      renderSettings();
      break;
    case 'profile':
      renderProfile();
      break;
    case 'admin':
      await renderAdmin();
      break;
    case 'invites':
      await renderInvites();
      break;
    default:
      renderDashboard();
  }
};

const showShell = () => {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  loadUiSettings();
  applyTheme();
  updateUserChip();
  loadPage(state.page);
};

const enterApp = () => {
  state.demoMode = true;
  state.user = { id: 'demo-user', email: 'demo@lyceon.local' };
  state.profile = { id: 'demo-user', full_name: 'Demo User', role: 'student' };
  localStorage.setItem(DEMO_MODE_KEY, '1');
  showShell();
  Notifications.show(tr('demoModeEnabled', 'Demo mode enabled. Authentication is bypassed for testing.'));
};

const loadUiSettings = () => {
  try {
    const raw = localStorage.getItem(UI_SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.studyMode === 'school' || parsed.studyMode === 'university')) {
      state.ui.studyMode = parsed.studyMode;
      if (parsed.schoolStage) state.ui.schoolStage = parsed.schoolStage;
      if (parsed.uniSemester) state.ui.uniSemester = parsed.uniSemester;
      if (parsed.examMode) state.ui.examMode = parsed.examMode;
      if (parsed.country) state.ui.country = parsed.country;
      if (parsed.theme === 'light' || parsed.theme === 'dark') state.ui.theme = parsed.theme;
      if (parsed.plannerTab === 'timetable' || parsed.plannerTab === 'tasks' || parsed.plannerTab === 'view' || parsed.plannerTab === 'edit') state.ui.plannerTab = (parsed.plannerTab === 'view' || parsed.plannerTab === 'timetable') ? 'timetable' : 'tasks';
    }
  } catch (_) {
    state.ui.studyMode = 'school';
    state.ui.schoolStage = 'grade-9-10';
    state.ui.uniSemester = 'semester-1-2';
    state.ui.examMode = 'balanced';
    state.ui.country = 'de';
    state.ui.theme = 'dark';
    state.ui.plannerTab = 'timetable';
  }
};

const saveUiSettings = () => {
  localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(state.ui));
};

// ─── Timetable storage ───────────────────────────────────────────────────────
const loadTimetable = () => {
  try { const r = localStorage.getItem(TIMETABLE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
};
const saveTimetable = (data) => {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(data));
};

// ─── Planer tasks storage ────────────────────────────────────────────────────
const loadPlanerTasks = () => {
  try { const r = localStorage.getItem(PLANER_TASKS_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
};
const savePlanerTasks = (tasks) => {
  localStorage.setItem(PLANER_TASKS_KEY, JSON.stringify(tasks));
};

// Keep legacy loader for migration (not actively used)
const loadPlannerSchedule = () => {
  try { const r = localStorage.getItem(PLANNER_SCHEDULE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
};

window.switchPlannerTab = (tab) => {
  if (tab !== 'timetable' && tab !== 'tasks') return;
  state.ui.plannerTab = tab;
  saveUiSettings();
  renderTasks();
};

window.openTimetableCell = (day, slot) => {
  const tt = loadTimetable();
  const cell = (tt[day] || {})[slot] || {};
  showModal(tr('planerEditSlot','Edit time slot'), `
    <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
      <input id="ttSubject" class="input" type="text" placeholder="${tr('planerSubject','Subject')}" value="${(cell.subject||'').replace(/"/g,'&quot;')}" />
      <input id="ttTeacher" class="input" type="text" placeholder="${tr('planerTeacher','Teacher (optional)')}" value="${(cell.teacher||'').replace(/"/g,'&quot;')}" />
      <input id="ttRoom" class="input" type="text" placeholder="${tr('planerRoom','Room (optional)')}" value="${(cell.room||'').replace(/"/g,'&quot;')}" />
      <div style="display:flex;align-items:center;gap:10px">
        <label style="font-size:13px;color:var(--text2)">${tr('planerColor','Color')}</label>
        <input id="ttColor" type="color" value="${cell.color||'#3b5bdb'}" style="width:44px;height:32px;border:none;border-radius:8px;cursor:pointer;padding:0" />
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="btn btn-primary" style="flex:1" onclick="saveTimetableCell(${day},${slot})">${tr('planerSave','Save')}</button>
        ${cell.subject ? `<button class="btn" style="color:#ef4444;border-color:#ef4444" onclick="deleteTimetableCell(${day},${slot})">${tr('planerDelete','Delete')}</button>` : ''}
      </div>
    </div>
  `);
  setTimeout(() => document.getElementById('ttSubject')?.focus(), 80);
};

window.saveTimetableCell = (day, slot) => {
  const subject = (document.getElementById('ttSubject')?.value || '').trim();
  if (!subject) { Notifications.show(tr('planerSubjectRequired','Subject is required.'), 'warn'); return; }
  const tt = loadTimetable();
  if (!tt[day]) tt[day] = {};
  tt[day][slot] = {
    subject,
    teacher: (document.getElementById('ttTeacher')?.value || '').trim(),
    room: (document.getElementById('ttRoom')?.value || '').trim(),
    color: document.getElementById('ttColor')?.value || '#3b5bdb',
  };
  saveTimetable(tt);
  closeModal();
  renderTasks();
};

window.deleteTimetableCell = (day, slot) => {
  const tt = loadTimetable();
  if (tt[day]) delete tt[day][slot];
  saveTimetable(tt);
  closeModal();
  renderTasks();
};

window.addPlanerTask = () => {
  showModal(tr('planerAddTask','New task'), `
    <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
      <input id="ptTitle" class="input" type="text" placeholder="${tr('planerTaskTitle','Task title')}" />
      <input id="ptSubject" class="input" type="text" placeholder="${tr('planerSubject','Subject (optional)')}" />
      <input id="ptDue" class="input" type="date" />
      <button class="btn btn-primary" onclick="submitPlanerTask()">${tr('planerSave','Save')}</button>
    </div>
  `);
  setTimeout(() => document.getElementById('ptTitle')?.focus(), 80);
};

window.submitPlanerTask = () => {
  const title = (document.getElementById('ptTitle')?.value || '').trim();
  if (!title) { Notifications.show(tr('planerTaskRequired','Task title is required.'), 'warn'); return; }
  const tasks = loadPlanerTasks();
  tasks.unshift({
    id: `pt-${Date.now()}`,
    title,
    subject: (document.getElementById('ptSubject')?.value || '').trim(),
    dueDate: document.getElementById('ptDue')?.value || '',
    done: false,
    createdAt: new Date().toISOString(),
  });
  savePlanerTasks(tasks);
  closeModal();
  renderTasks();
};

window.togglePlanerTask = (id) => {
  const tasks = loadPlanerTasks();
  const t = tasks.find(x => x.id === id);
  if (t) t.done = !t.done;
  savePlanerTasks(tasks);
  renderTasks();
};

window.deletePlanerTask = (id) => {
  savePlanerTasks(loadPlanerTasks().filter(x => x.id !== id));
  renderTasks();
};

const showAuth = () => {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
};

const clearOldServiceWorker = async () => {
  if (!('serviceWorker' in navigator) && !('caches' in window)) return false;
  let foundServiceWorker = false;

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
    foundServiceWorker = registrations.length > 0;
    await Promise.all(registrations.map((reg) => reg.unregister().catch(() => false)));
  }

  if ('caches' in window) {
    const cacheKeys = await caches.keys().catch(() => []);
    await Promise.all(cacheKeys.map((key) => caches.delete(key).catch(() => false)));
  }

  return foundServiceWorker;
};

const updateUserChip = () => {
  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userChipName');
  const role = document.getElementById('userChipRole');
  const label = state.profile?.full_name || state.user?.email || 'Guest';
  avatar.textContent = label.charAt(0).toUpperCase();
  name.textContent = label;
  role.textContent = state.profile?.role?.toUpperCase() || 'Member';
  document.body.classList.remove('role-admin', 'role-teacher');
  if (state.profile?.role === 'admin') document.body.classList.add('role-admin');
  if (state.profile?.role === 'teacher') document.body.classList.add('role-teacher');
};

const handleLogin = async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('loginRemember').checked;
  const loginRole = document.getElementById('loginRole').value;
  const loginError = document.getElementById('loginError');
  loginError.textContent = '';

  localStorage.setItem(AUTH_REMEMBER_KEY, rememberMe ? '1' : '0');

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message;
    return;
  }

  await onAuthChange(data.user, loginRole);
};

const handleRegister = async (event) => {
  event.preventDefault();
  const full_name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const invite_code = document.getElementById('regCode').value.trim();
  const study_type = document.getElementById('regStudyType').value;
  const institution = document.getElementById('regInstitution').value.trim();
  const level = document.getElementById('regLevel').value.trim();
  const role = document.getElementById('regRole').value;
  const regError = document.getElementById('regError');
  regError.textContent = '';

  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
          invite_code,
          study_type,
          institution,
          level,
        }
      }
    });
    if (error) throw error;
    Notifications.show('Registration received. Please confirm your email if required.');
  } catch (err) {
    regError.textContent = err.message || 'Unable to register.';
  }
};

const handleSignOut = async () => {
  if (state.demoMode) {
    state.user = null;
    state.profile = null;
    localStorage.removeItem(DEMO_MODE_KEY);
    showAuth();
    return;
  }
  await sb.auth.signOut();
  state.user = null;
  state.profile = null;
  showAuth();
};

const onAuthChange = async (user, fallbackRole = 'student') => {
  state.user = user;
  const { data: profile, error } = await sb.from('profiles').select('*').eq('id', user.id).single();
  if (error) {
    state.profile = {
      id: user.id,
      full_name: user.email.split('@')[0],
      role: fallbackRole,
    };
    showShell();
    return;
  }
  state.profile = profile || {
    id: user.id,
    full_name: user.email.split('@')[0],
    role: fallbackRole,
  };
  showShell();
};

const loadProfile = async () => {
  const { data, error } = await sb.from('profiles').select('*').eq('id', state.user.id).single();
  if (!error) state.profile = data;
};

const renderDashboard = async () => {
  // Greeting based on time of day
  const now = new Date();
  const hour = now.getHours();
  const greetingKey = hour < 12 ? 'dashGoodMorning' : hour < 17 ? 'dashGoodAfternoon' : 'dashGoodEvening';
  const greetingFallback = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = state.profile?.full_name || tr('student', 'Student');
  const greetEl = document.getElementById('dashGreeting');
  const dateEl = document.getElementById('dashDate');
  if (greetEl) greetEl.innerHTML = `${tr(greetingKey, greetingFallback)}, <strong>${name}</strong>!`;
  if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Quick actions
  const qaEl = document.getElementById('dashQuickActions');
  if (qaEl) qaEl.innerHTML = `
    <button class="dash-quick-btn dash-quick-learn" onclick="navigate('learn')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
      <span>${tr('pageLearn', 'Learn')}</span>
    </button>
    <button class="dash-quick-btn dash-quick-tasks" onclick="navigate('tasks')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      <span>${tr('pageTasks', 'Tasks')}</span>
    </button>
    <button class="dash-quick-btn dash-quick-calendar" onclick="navigate('calendar')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span>${tr('pageCalendar', 'Calendar')}</span>
    </button>
    <button class="dash-quick-btn dash-quick-grades" onclick="navigate('grades')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
      <span>${tr('pageGrades', 'Grades')}</span>
    </button>
  `;

  const tasks = state.tasks || [];
  const courses = state.courses || [];
  // Today's timetable from new timetable data
  const jsDow = new Date().getDay();
  const todayDayIdx = jsDow === 0 ? 6 : jsDow - 1; // 0=Mon...6=Sun
  const tt = loadTimetable();
  const todaySlots = TIMETABLE_SLOTS.map((time, si) => {
    const cell = (tt[todayDayIdx] || {})[si];
    return cell && cell.subject ? { time, ...cell } : null;
  }).filter(Boolean);
  // Also merge legacy state.schedules
  const legacySchedules = state.schedules || [];
  const schedules = todaySlots.length ? todaySlots : legacySchedules;
  const openTasks = tasks.filter(t => t.status !== 'done');
  // Also load new planer tasks
  const planerTasks = loadPlanerTasks().filter(t => !t.done);

  // Stats
  const statsEl = document.getElementById('dashStats');
  if (statsEl) statsEl.innerHTML = `
    <div class="dash-stat dash-stat-purple">
      <div class="dash-stat-icon">📋</div>
      <span class="dash-stat-value">${formatNumber(openTasks.length + planerTasks.length)}</span>
      <span class="dash-stat-label">${tr('dashStatTasks', 'Open tasks')}</span>
    </div>
    <div class="dash-stat dash-stat-blue">
      <div class="dash-stat-icon">📅</div>
      <span class="dash-stat-value">${formatNumber(schedules.length)}</span>
      <span class="dash-stat-label">${tr('dashStatLessons', "Today's lessons")}</span>
    </div>
    <div class="dash-stat dash-stat-emerald">
      <div class="dash-stat-icon">📚</div>
      <span class="dash-stat-value">${formatNumber(courses.length)}</span>
      <span class="dash-stat-label">${tr('dashStatCourses', 'Courses')}</span>
    </div>
    <div class="dash-stat dash-stat-amber">
      <div class="dash-stat-icon">🔥</div>
      <span class="dash-stat-value">${formatNumber(3)}</span>
      <span class="dash-stat-label">${tr('dashStreak', 'Day streak')}</span>
    </div>
  `;

  // Schedule (today's timetable)
  const dashSchedule = document.getElementById('dashSchedule');
  if (dashSchedule) {
    if (schedules.length) {
      dashSchedule.innerHTML = schedules.map(s => `
        <div class="dash-schedule-item">
          <div class="dash-schedule-time" style="color:${s.color||'var(--accent)'}">${s.time}</div>
          <div class="dash-schedule-info">
            <div class="dash-list-title"><span class="planner-color-dot" style="background:${s.color||'var(--accent)'}"></span>${s.subject}</div>
            ${s.teacher || s.room ? `<div class="dash-list-sub">${[s.teacher, s.room].filter(Boolean).join(' · ')}</div>` : ''}
          </div>
        </div>`).join('');
    } else {
      dashSchedule.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoSchedule', 'No classes scheduled yet.')}</div>`;
    }
  }

  // Upcoming tasks
  const dashUpcoming = document.getElementById('dashUpcoming');
  if (dashUpcoming) {
    const upcoming = openTasks.slice(0, 4);
    if (upcoming.length) {
      dashUpcoming.innerHTML = upcoming.map(task => {
        const overdue = task.status === 'overdue';
        const color = overdue ? '#ef4444' : '#7180ff';
        return `<div class="dash-list-item">
          <span class="dash-dot" style="background:${color};margin-top:5px"></span>
          <div>
            <div class="dash-list-title">${task.title}</div>
            <div class="dash-list-sub">${task.course_name || ''} · ${tr('dashDue', 'Due')} ${new Date(task.due_date).toLocaleDateString()}</div>
          </div>
          ${overdue ? `<span class="dash-overdue-badge">${tr('dashOverdue', 'Overdue')}</span>` : ''}
        </div>`;
      }).join('');
    } else {
      dashUpcoming.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoUpcoming', 'No upcoming tasks.')}</div>`;
    }
  }

  // Open tasks (compact list)
  const dashTasks = document.getElementById('dashTasks');
  if (dashTasks) {
    if (tasks.length) {
      dashTasks.innerHTML = tasks.map(task => {
        const icon = task.status === 'done' ? '✓' : task.status === 'overdue' ? '!' : '○';
        const color = task.status === 'done' ? '#22c55e' : task.status === 'overdue' ? '#ef4444' : '#7180ff';
        return `<div class="dash-task-row">
          <span class="dash-task-icon" style="color:${color};font-weight:700;font-size:13px;width:14px;flex-shrink:0">${icon}</span>
          <span class="dash-task-title" style="font-size:13px;flex:1;${task.status === 'done' ? 'text-decoration:line-through;color:var(--text3)' : ''}">${task.title}</span>
        </div>`;
      }).join('');
    } else {
      dashTasks.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoTasks', 'No tasks yet.')}</div>`;
    }
  }

  // Rooms
  const dashRooms = document.getElementById('dashRooms');
  if (dashRooms) dashRooms.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoRooms', 'No learning rooms available.')}</div>`;
};

const renderCourses = async () => {
  const grid = document.getElementById('courseGrid');
  grid.innerHTML = `<div class="dash-list-placeholder">${tr('loadingLabel','Loading...')}</div>`;
  if (state.demoMode) {
    // keep existing state.courses (may have been joined)
    renderCourseGrid();
    return;
  }
  const { data, error } = await sb.from('courses').select('*').order('name', { ascending: true });
  if (error) return (grid.innerHTML = `<div class="dash-list-placeholder">${tr('courseLoadError','Unable to load courses.')}</div>`);
  state.courses = data;
  renderCourseGrid();
};

const COURSE_COLORS = [
  ['#3b5bdb','#5c7cfa'],['#0ea5e9','#38bdf8'],['#7c3aed','#a78bfa'],
  ['#059669','#34d399'],['#dc2626','#f87171'],['#d97706','#fbbf24'],
  ['#db2777','#f472b6'],['#0891b2','#22d3ee'],
];

const renderCourseGrid = () => {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;
  if (!state.courses.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        </div>
        <h3>${tr('emptyCourses','No courses yet')}</h3>
        <p>${tr('emptyCoursesDesc','Join an existing course with a code or create your own.')}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="openJoinCourse()">${tr('courseJoin','Join Course')}</button>
          <button class="btn btn-secondary" onclick="openCreateCourse()">${tr('courseCreate','Create Course')}</button>
        </div>
      </div>`;
    return;
  }
  grid.innerHTML = state.courses.map((course, i) => {
    const [c1, c2] = COURSE_COLORS[i % COURSE_COLORS.length];
    const abbr = (course.name || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
    return `<div class="course-card" onclick="showCourseDetail('${course.id}')">
      <div class="course-card-banner" style="background:linear-gradient(135deg,${c1},${c2})">
        <div class="course-card-abbr">${abbr}</div>
      </div>
      <div class="course-card-body">
        <div class="course-card-name">${course.name}</div>
        <div class="course-card-teacher">${course.teacher_name || course.owner_name || tr('noInstructor','No instructor')}</div>
        <div class="course-card-chips">
          <span class="chip">${course.level || tr('levelGeneral','General')}</span>
          ${course.code ? `<span class="chip" style="font-family:monospace;letter-spacing:.06em">${course.code}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
};

const openJoinCourse = () => {
  showModal(tr('joinCourseTitle','Join a Course'), `
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0">
      <p style="color:var(--text2);font-size:14px">${tr('joinCourseDesc','Enter the 6-character course code from your teacher or classmate.')}</p>
      <input id="joinCodeInput" type="text" placeholder="${tr('joinCoursePlaceholder','e.g. ABC123')}" maxlength="8" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:16px;font-family:monospace;letter-spacing:.1em;text-transform:uppercase;outline:none;width:100%;box-sizing:border-box" oninput="this.value=this.value.toUpperCase()" />
      <button class="btn btn-primary" onclick="submitJoinCourse()">${tr('joinCourseBtn','Join')}</button>
    </div>
  `);
  setTimeout(() => document.getElementById('joinCodeInput')?.focus(), 100);
};

const submitJoinCourse = () => {
  const code = (document.getElementById('joinCodeInput')?.value || '').trim().toUpperCase();
  if (code.length < 4) { Notifications.show(tr('joinCourseInvalidCode','Please enter a valid course code.'), 'warn'); return; }
  const existing = state.courses.find(c => c.code === code);
  if (existing) { Notifications.show(tr('joinCourseAlreadyJoined','You already joined this course.'), 'warn'); closeModal(); return; }
  const fakeName = tr('courseCodeLabel','Course') + ' ' + code;
  const newCourse = { id: 'c-' + Date.now(), name: fakeName, code, teacher_name: tr('unknownInstructor','Unknown'), level: tr('levelGeneral','General'), owner: false };
  state.courses.push(newCourse);
  addNotification('invite', `${tr('courseJoinedNotif','Joined')} "${fakeName}"`, `${tr('courseJoinedCode','Successfully joined with code')} ${code}`, new Date().toISOString());
  const today = new Date();
  state.calendarEvents.push({ date: today.toISOString().slice(0,10), title: `${tr('courseJoin','Joined')}: ${fakeName}`, type: 'course', color: '#3b5bdb' });
  closeModal();
  renderCourseGrid();
  Notifications.show(`${tr('courseJoinedNotif','Joined')} ${fakeName}!`);
};

const openCreateCourse = () => {
  showModal(tr('createCourseTitle','Create a Course'), `
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0">
      <input id="createCourseNameInput" type="text" placeholder="${tr('createCoursePlaceholder','Course name')}" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;width:100%;box-sizing:border-box" />
      <button class="btn btn-primary" onclick="submitCreateCourse()">${tr('createCourseBtn','Create')}</button>
    </div>
  `);
  setTimeout(() => document.getElementById('createCourseNameInput')?.focus(), 100);
};

const submitCreateCourse = () => {
  const name = (document.getElementById('createCourseNameInput')?.value || '').trim();
  if (!name) { Notifications.show(tr('createCourseNameRequired','Enter a course name.'), 'warn'); return; }
  const code = Math.random().toString(36).slice(2,8).toUpperCase();
  const newCourse = { id: 'c-' + Date.now(), name, code, teacher_name: state.profile?.full_name || tr('you','You'), level: tr('levelGeneral','General'), owner: true };
  state.courses.push(newCourse);
  addNotification('invite', `${tr('courseCreatedNotif','Course created')}: "${name}"`, `${tr('courseCreatedShareCode','Share code')}: ${code}`, new Date().toISOString());
  closeModal();
  renderCourseGrid();
  showModal(tr('courseCreatedTitle','Course Created!'), `
    <div style="text-align:center;padding:16px 8px">
      <p style="color:var(--text2);font-size:14px;margin-bottom:16px">${tr('courseCreatedShareHint','Share this code with students:')}</p>
      <div style="font-size:32px;font-weight:900;font-family:monospace;letter-spacing:.15em;color:var(--accent);background:rgba(59,91,219,.1);padding:20px;border-radius:16px">${code}</div>
      <button class="btn btn-primary" style="margin-top:20px" onclick="closeModal()">${tr('courseCreatedDone','Done')}</button>
    </div>
  `);
};

const showCourseDetail = async (courseId) => {
  const course = state.courses.find((c) => c.id === courseId);
  if (!course) return;
  navigate('course-detail');
  const el = document.getElementById('courseDetailContent');
  if (el) el.innerHTML = `<div class="card"><div class="card-title">${course.name}</div><div class="card-sub">${tr('courseInstructor','Instructor')}: ${course.teacher_name || '—'}</div>${course.code ? `<p style="font-family:monospace;font-size:13px;color:var(--text3)">${tr('courseCodeLabel','Code')}: ${course.code}</p>` : ''}<p>${course.description || tr('courseNoDesc','No description available for this course.')}</p></div>`;
};

const filterCourses = () => {
  const term = (document.getElementById('courseSearch')?.value || '').toLowerCase();
  const filtered = state.courses.filter((course) => (course.name||'').toLowerCase().includes(term) || (course.teacher_name||'').toLowerCase().includes(term));
  document.getElementById('courseGrid').innerHTML = filtered.length ? filtered.map((course, i) => {
    const [c1, c2] = COURSE_COLORS[i % COURSE_COLORS.length];
    const abbr = (course.name || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
    return `<div class="course-card" onclick="showCourseDetail('${course.id}')"><div class="course-card-banner" style="background:linear-gradient(135deg,${c1},${c2})"><div class="course-card-abbr">${abbr}</div></div><div class="course-card-body"><div class="course-card-name">${course.name}</div><div class="course-card-teacher">${course.teacher_name || '—'}</div></div></div>`;
  }).join('') : `<div class="dash-list-placeholder">${tr('courseSearchNoMatch','No matching courses.')}</div>`;
};

const renderTasks = async () => {
  const content = document.getElementById('plannerContent');
  if (!content) return;

  const activeTab = state.ui.plannerTab || 'timetable';

  // Localized day names via Intl (0=Mon … 6=Sun)
  const lang = (typeof getActiveLanguage === 'function' ? getActiveLanguage() : null) || 'de';
  const fmtLong  = new Intl.DateTimeFormat(lang, { weekday: 'long' });
  const fmtShort = new Intl.DateTimeFormat(lang, { weekday: 'short' });
  // 2024-01-01 = Monday, 2024-01-07 = Sunday
  const DAY_NAMES = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, i + 1);
    return [fmtLong.format(d), fmtShort.format(d)];
  });

  // ── Timetable tab ─────────────────────────────────────────────────────────
  let panelHtml = '';
  if (activeTab === 'timetable') {
    const tt = loadTimetable();
    // Determine today's column index (0=Mon … 6=Sun; JS getDay: 0=Sun,1=Mon…)
    const jsDow = new Date().getDay();
    const todayIdx = jsDow === 0 ? 6 : jsDow - 1;

    // Build header row
    const headerCells = DAY_NAMES.map(([full], di) =>
      `<th class="tt-day-hdr${di === todayIdx ? ' tt-today' : ''}">${full}</th>`
    ).join('');

    // Build body rows
    const bodyRows = TIMETABLE_SLOTS.map((time, si) => {
      const cells = DAY_NAMES.map(([,], di) => {
        const cell = (tt[di] || {})[si];
        if (cell && cell.subject) {
          return `<td class="tt-cell tt-cell-filled" onclick="openTimetableCell(${di},${si})" style="--cell-color:${cell.color||'#3b5bdb'}">
            <div class="tt-cell-inner" style="background:${cell.color||'#3b5bdb'}22;border-left:3px solid ${cell.color||'#3b5bdb'}">
              <div class="tt-cell-subject">${cell.subject}</div>
              ${cell.teacher ? `<div class="tt-cell-teacher">${cell.teacher}</div>` : ''}
              ${cell.room ? `<div class="tt-cell-room">${cell.room}</div>` : ''}
            </div>
          </td>`;
        }
        return `<td class="tt-cell tt-cell-empty" onclick="openTimetableCell(${di},${si})">
          <span class="tt-add-icon">+</span>
        </td>`;
      }).join('');
      return `<tr><td class="tt-time-cell">${time}</td>${cells}</tr>`;
    }).join('');

    panelHtml = `
      <div class="tt-scroll-wrap">
        <table class="tt-table">
          <thead><tr><th class="tt-time-hdr">${tr('planerPeriod','Period')}</th>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <p class="tt-hint">${tr('planerClickHint','Click any cell to add or edit a lesson.')}</p>`;

  // ── Tasks tab ─────────────────────────────────────────────────────────────
  } else {
    const tasks = loadPlanerTasks();
    const openTasks = tasks.filter(t => !t.done);
    const doneTasks = tasks.filter(t => t.done);
    const taskRow = (task) => `
      <div class="planer-task-row${task.done ? ' planer-task-done' : ''}">
        <button class="planer-task-check" onclick="togglePlanerTask('${task.id}')" title="${task.done ? tr('planerUncheck','Uncheck') : tr('planerCheck','Check')}">
          ${task.done ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </button>
        <div class="planer-task-body">
          <div class="planer-task-title">${task.title}</div>
          ${(task.subject || task.dueDate) ? `<div class="planer-task-meta">${task.subject ? `${task.subject}` : ''}${task.subject && task.dueDate ? ' · ' : ''}${task.dueDate ? `📅 ${task.dueDate}` : ''}</div>` : ''}
        </div>
        <button class="planer-task-delete icon-btn" onclick="deletePlanerTask('${task.id}')" title="${tr('planerDelete','Delete')}">✕</button>
      </div>`;

    panelHtml = `
      <div class="planer-task-toolbar">
        <button class="btn btn-primary" onclick="addPlanerTask()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${tr('planerAddTask','Add task')}
        </button>
        <span class="planer-task-count">${openTasks.length} ${tr('planerOpenTasks','open')}</span>
      </div>
      ${tasks.length === 0 ? `<div class="dash-list-placeholder" style="padding:40px 0">${tr('planerNoTasks','No tasks yet. Add your first task!')}</div>` : ''}
      <div class="planer-task-list">${openTasks.map(taskRow).join('')}</div>
      ${doneTasks.length ? `
        <div class="planer-done-section">
          <div class="planer-done-label">${tr('planerDone','Completed')} (${doneTasks.length})</div>
          <div class="planer-task-list">${doneTasks.map(taskRow).join('')}</div>
        </div>` : ''}`;
  }

  content.innerHTML = `
    <div class="planer-tabs-row">
      <button class="planer-main-tab${activeTab === 'timetable' ? ' active' : ''}" onclick="switchPlannerTab('timetable')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/></svg>
        ${tr('planerTabTimetable','Stundenplan')}
      </button>
      <button class="planer-main-tab${activeTab === 'tasks' ? ' active' : ''}" onclick="switchPlannerTab('tasks')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        ${tr('planerTabTasks','Aufgaben')}
      </button>
    </div>
    <div class="planer-panel">${panelHtml}</div>`;
};

const renderMessages = async () => {
  const list = document.getElementById('msgRoomList');
  list.innerHTML = `<div class="dash-list-placeholder">${tr('chatLoading', 'Loading chats...')}</div>`;
  if (state.demoMode) {
    list.innerHTML = state.messages.length
      ? state.messages.map((room) => `<div class="msg-room-item ${state.chat.currentRoomId === room.id ? 'active' : ''}" onclick="openChat('${room.id}')"><div class="msg-room-avatar">${(room.room_name || 'R').charAt(0).toUpperCase()}</div><div class="msg-room-info"><div class="msg-room-name">${room.room_name || tr('chatRoom', 'Room')}</div><div class="msg-room-preview">${room.last_message || tr('chatNoMessagesYet', 'No messages yet')}</div></div></div>`).join('')
      : `<div class="msg-empty-state" style="padding:30px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:40px;height:40px;stroke:var(--text3);opacity:.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><h3 style="font-size:14px;color:var(--text2);margin:8px 0 4px">No chats yet</h3><p style="font-size:12px;color:var(--text3);margin:0 0 12px">Create a room to start chatting.</p><button class="btn btn-primary" style="font-size:12px;padding:7px 14px" onclick="startNewChat()">+ New chat</button></div>`;
    if (state.chat.currentRoomId) {
      await openChat(state.chat.currentRoomId);
    } else {
      document.getElementById('msgChatArea').innerHTML = `<div class="msg-empty-state"><p>${tr('chatCreateFirstRoom', 'Create your first chat room.')}</p></div>`;
    }
    return;
  }
  let data = null;
  let error = null;

  const roomsRes = await sb.from('chat_rooms').select('id,name,updated_at').order('updated_at', { ascending: false });
  if (!roomsRes.error && roomsRes.data) {
    data = roomsRes.data.map((room) => ({
      id: room.id,
      room_name: room.name,
      last_message: '',
      updated_at: room.updated_at,
    }));
  } else {
    const fallback = await sb.from('messages').select('id,room_name,last_message,updated_at').order('updated_at', { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }

  if (error) return (list.innerHTML = `<div class="dash-list-placeholder">${tr('chatLoadError', 'Unable to load chats.')}</div>`);
  state.messages = data || [];
  if (!state.messages.length) {
    list.innerHTML = `<div class="dash-list-placeholder">${tr('chatNoRooms', 'No chats available.')}</div>`;
    document.getElementById('msgChatArea').innerHTML = `<div class="msg-empty-state"><p>${tr('chatCreateFirstRoom', 'Create your first chat room.')}</p></div>`;
    return;
  }
  list.innerHTML = state.messages.map((room) => `<div class="msg-room-item ${state.chat.currentRoomId === room.id ? 'active' : ''}" onclick="openChat('${room.id}')"><div class="msg-room-avatar">${(room.room_name || 'R').charAt(0).toUpperCase()}</div><div class="msg-room-info"><div class="msg-room-name">${room.room_name || tr('chatRoom', 'Room')}</div><div class="msg-room-preview">${room.last_message || tr('chatNoMessagesYet', 'No messages yet')}</div></div></div>`).join('');
  if (state.chat.currentRoomId) {
    await openChat(state.chat.currentRoomId);
  }
};

const renderFiles = async () => {
  const grid = document.getElementById('fileGrid');
  grid.innerHTML = `<div class="dash-list-placeholder">${tr('loadingLabel','Loading...')}</div>`;
  if (state.demoMode) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon"><svg viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg></div>
        <h3>${tr('emptyFiles','No files yet')}</h3>
        <p>${tr('emptyFilesDesc','Upload study materials, notes, or resources for your courses.')}</p>
        <button class="btn btn-primary" onclick="openFileUpload()">${tr('uploadFile','Upload file')}</button>
      </div>`;
    return;
  }
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) return (grid.innerHTML = `<div class="dash-list-placeholder">${tr('filesLoadError','Unable to load files.')}</div>`);
  grid.innerHTML = data.length ? data.map((file) => `<div class="file-item"><div class="file-icon">📄</div><div class="file-name">${file.name}</div><div class="file-size">${file.size || '—'} KB</div></div>`).join('') : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon"><svg viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg></div><h3>${tr('filesNone','No files uploaded yet')}</h3></div>`;
};

const renderCalendar = async () => {
  const container = document.getElementById('calendarContainer');
  if (!container) return;
  // Init calendar state
  if (!state.calendarYear) {
    const now = new Date();
    state.calendarYear = now.getFullYear();
    state.calendarMonth = now.getMonth(); // 0-11
  }
  if (!state.calendarEvents) state.calendarEvents = [];
  renderCalendarGrid();
};

const getMonthName = (idx) => new Intl.DateTimeFormat(getActiveLanguage(), { month: 'long' }).format(new Date(2000, idx, 1));
const getShortDayNames = () => Array.from({length:7}, (_,i) => new Intl.DateTimeFormat(getActiveLanguage(), { weekday: 'short' }).format(new Date(2000, 0, 2 + i)));

const calNav = (dir) => {
  const now = new Date();
  const maxYear = now.getFullYear() + 10;
  let m = state.calendarMonth + dir;
  let y = state.calendarYear;
  if (m > 11) { m = 0; y++; }
  if (m < 0) { m = 11; y--; }
  if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() - 120)) return;
  if (y > maxYear) return;
  state.calendarYear = y;
  state.calendarMonth = m;
  renderCalendarGrid();
};

const calGoToday = () => {
  const now = new Date();
  state.calendarYear = now.getFullYear();
  state.calendarMonth = now.getMonth();
  renderCalendarGrid();
};

const renderCalendarGrid = () => {
  const container = document.getElementById('calendarContainer');
  if (!container) return;
  const y = state.calendarYear;
  const m = state.calendarMonth;
  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  // Build days array
  const firstDay = new Date(y, m, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  // Build events map { 'YYYY-MM-DD': [{title,type,color},...] }
  const evMap = {};
  (state.calendarEvents || []).forEach(ev => {
    if (!evMap[ev.date]) evMap[ev.date] = [];
    evMap[ev.date].push(ev);
  });
  // Build cells
  const cells = [];
  // Prev month padding
  for (let d = firstDay - 1; d >= 0; d--) {
    cells.push({ day: prevDays - d, cur: false, date: null });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(m+1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    cells.push({ day: d, cur: true, date: `${y}-${mm}-${dd}` });
  }
  // Next month padding
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, cur: false, date: null });
  }
  // Upcoming events sidebar
  const monthStart = `${y}-${String(m+1).padStart(2,'0')}-01`;
  const monthEnd = `${y}-${String(m+1).padStart(2,'0')}-${String(daysInMonth).padStart(2,'0')}`;
  const monthEvs = (state.calendarEvents || []).filter(ev => ev.date >= monthStart && ev.date <= monthEnd).sort((a,b) => a.date.localeCompare(b.date));
  const evColors = { course:'#3b5bdb', task:'#f59e0b', invite:'#22c55e', default:'#8896a8' };
  container.innerHTML = `
    <div class="cal-wrap">
      <div class="cal-nav">
        <button class="cal-nav-btn" onclick="calNav(-1)" title="Previous month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div class="cal-nav-title">${getMonthName(m)} ${y}</div>
        <button class="cal-nav-btn" onclick="calNav(1)" title="Next month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="cal-nav-btn cal-today-btn" onclick="calGoToday()">${tr('calToday','Today')}</button>
      </div>
      <div class="cal-layout">
        <div class="cal-grid-wrap">
          <div class="cal-weekdays">${getShortDayNames().map(d => `<div class="cal-wd">${d}</div>`).join('')}</div>
          <div class="cal-days">${cells.map(cell => {
            const evs = cell.date ? (evMap[cell.date] || []) : [];
            const isToday = cell.date === todayStr;
            return `<div class="cal-cell${cell.cur ? '' : ' other-month'}${isToday ? ' today' : ''}" onclick="${cell.date ? `calDayClick('${cell.date}')` : ''}"><div class="cal-day-num">${cell.day}</div>${evs.slice(0,3).map(ev => `<div class="cal-event-chip ${ev.type||'course'}" title="${ev.title}">${ev.title}</div>`).join('')}${evs.length > 3 ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">+${evs.length-3} more</div>` : ''}</div>`;
          }).join('')}</div>
        </div>
        <div class="cal-sidebar">
          <div class="cal-sidebar-title">${getMonthName(m)}</div>
          ${monthEvs.length ? monthEvs.map(ev => `<div class="cal-event-row"><div class="cal-event-dot" style="background:${evColors[ev.type]||evColors.default}"></div><div><div style="font-size:13px;font-weight:700">${ev.title}</div><div style="font-size:12px;color:var(--text3)">${ev.date}</div></div></div>`).join('') : `<div style="font-size:13px;color:var(--text3);padding:8px 0">${tr('calNoEventsMonth','No events this month.')}</div>`}
        </div>
      </div>
    </div>`;
};

const calDayClick = (dateStr) => {
  showModal(tr('calEventAdd','Add Event'), `
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0">
      <p style="color:var(--text3);font-size:13px">${dateStr}</p>
      <input id="newEvTitle" placeholder="${tr('calEventTitlePlaceholder','Event title')}" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;width:100%;box-sizing:border-box" />
      <select id="newEvType" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;background:#fff">
        <option value="course">${tr('calEventTypeCourse','Course')}</option>
        <option value="task">${tr('calEventTypeTask','Task')}</option>
        <option value="invite">${tr('calEventTypeEvent','Event')}</option>
      </select>
      <button class="btn btn-primary" onclick="submitCalEvent('${dateStr}')">${tr('calAddBtn','Add')}</button>
    </div>
  `);
  setTimeout(() => document.getElementById('newEvTitle')?.focus(), 100);
};

const submitCalEvent = (dateStr) => {
  const title = (document.getElementById('newEvTitle')?.value || '').trim();
  const type = document.getElementById('newEvType')?.value || 'course';
  if (!title) { Notifications.show(tr('calEventTitleRequired','Enter an event title.'),'warn'); return; }
  if (!state.calendarEvents) state.calendarEvents = [];
  state.calendarEvents.push({ date: dateStr, title, type });
  closeModal();
  renderCalendarGrid();
  Notifications.show(tr('calEventAdded','Event added!'));
};

const renderGrades = async () => {
  const content = document.getElementById('gradesContent');
  content.innerHTML = `<div class="dash-list-placeholder">${tr('loadingLabel','Loading...')}</div>`;
  const { data, error } = await sb.from('grades').select('*').order('updated_at', { ascending: false });
  if (error) return (content.innerHTML = `<div class="dash-list-placeholder">${tr('dashLoadError','Unable to load data.')}</div>`);
  content.innerHTML = data.length
    ? `<table class="grade-table"><thead><tr><th>${tr('grSubject','Course')}</th><th>${tr('grGrade','Grade')}</th><th>${tr('grNote','Notes')}</th></tr></thead><tbody>${data.map((grade) => `<tr><td>${grade.course_name}</td><td class="grade-val grade-${Math.min(6, Math.max(1, grade.value))}">${grade.value}</td><td>${grade.notes || '—'}</td></tr>`).join('')}</tbody></table>`
    : `<div class="empty-state"><div class="empty-state-icon"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div><h3>${tr('emptyGrades','No grades available')}</h3></div>`;
};

const SUBJECT_META = {
  mathematics:                  { icon: '📐', color: '#e8a020' },
  physics:                      { icon: '⚛️',  color: '#4a90d9' },
  chemistry:                    { icon: '⚗️',  color: '#9b59b6' },
  biology:                      { icon: '🌿', color: '#27ae60' },
  'computer-science':           { icon: '💻', color: '#2980b9' },
  'language-arts':              { icon: '📝', color: '#e67e22' },
  'english-language':           { icon: '🇬🇧', color: '#c0392b' },
  'english-as-foreign-language':{ icon: '🇬🇧', color: '#c0392b' },
  'german-language':            { icon: '🇩🇪', color: '#f39c12' },
  'french-language':            { icon: '🇫🇷', color: '#2980b9' },
  'spanish-language':           { icon: '🇪🇸', color: '#c0392b' },
  'arabic-language':            { icon: '🌙', color: '#16a085' },
  history:                      { icon: '📜', color: '#8e6b3e' },
  geography:                    { icon: '🌍', color: '#16a085' },
  civics:                       { icon: '🏛️',  color: '#2c3e50' },
  economics:                    { icon: '📊', color: '#2c3e50' },
  'earth-science':              { icon: '🌎', color: '#16a085' },
  arts:                         { icon: '🎨', color: '#c0392b' },
  health:                       { icon: '💚', color: '#27ae60' },
  'religion-ethics':            { icon: '⚖️',  color: '#7f8c8d' },
  'religion-and-ethics':        { icon: '⚖️',  color: '#7f8c8d' },
  music:                        { icon: '🎵', color: '#8e44ad' },
  'physical-education':         { icon: '🏃', color: '#2ecc71' },
  'technology-and-design':      { icon: '🔧', color: '#34495e' },
  'technology':                 { icon: '🔧', color: '#34495e' },
  'social-studies':             { icon: '🏛️',  color: '#2c3e50' },
  'philosophy':                 { icon: '🧠', color: '#6c3483' },
  'media-literacy':             { icon: '📱', color: '#3498db' },
  'media-studies':              { icon: '📱', color: '#3498db' },
  'politics-civics':            { icon: '🏛️',  color: '#2c3e50' },
  'psychology-school':          { icon: '🧠', color: '#6c3483' },
  astronomy:                    { icon: '🔭', color: '#1a1a6e' },
  'latin-language':             { icon: '🏺', color: '#8e6b3e' },
  'chinese-language':           { icon: '🇨🇳', color: '#c0392b' },
  'environmental-studies':      { icon: '🌿', color: '#27ae60' },
  // University-only subjects
  law:                          { icon: '⚖️',  color: '#2c3e50' },
  medicine:                     { icon: '🩺', color: '#e74c3c' },
  psychology:                   { icon: '🧠', color: '#8e44ad' },
  sociology:                    { icon: '👥', color: '#2980b9' },
  'political-science':          { icon: '🏛️',  color: '#34495e' },
  architecture:                 { icon: '🏗️',  color: '#795548' },
  engineering:                  { icon: '⚙️',  color: '#607d8b' },
  'business-administration':    { icon: '💼', color: '#f39c12' },
  linguistics:                  { icon: '🗣️',  color: '#16a085' },
  literature:                   { icon: '📖', color: '#8e6b3e' },
  'environmental-science':      { icon: '🌍', color: '#27ae60' },
  'education-pedagogy':         { icon: '🎓', color: '#2980b9' },
  'statistics-data-science':    { icon: '📈', color: '#e67e22' },
  cybersecurity:                { icon: '🔐', color: '#c0392b' },
  'social-work':                { icon: '🤝', color: '#16a085' },
  'nutrition-dietetics':        { icon: '🥗', color: '#27ae60' },
};
const getLearnMeta = (id) => SUBJECT_META[id] || { icon: '📚', color: 'var(--accent2)' };

// ─── School Systems & Grade Scales ───────────────────────────────────────────
// Each entry: flag, name, gradeScale { type, min, max, passing, inverted, suffix, best, worst,
//   scaleDesc, cssClass(value)→string, letterFromPct(pct)→string [optional] }, stages[]
const SCHOOL_SYSTEMS = {
  // ── Europe ──────────────────────────────────────────────────────────────
  de: {
    flag: '🇩🇪', name: 'Germany',
    gradeScale: {
      type: 'numeric', min: 1, max: 6, passing: 4, inverted: true,
      suffix: '', best: '1', worst: '6',
      labels: { 1: 'sehr gut', 2: 'gut', 3: 'befriedigend', 4: 'ausreichend', 5: 'mangelhaft', 6: 'ungenügend' },
      scaleDesc: '1 (sehr gut) → 6 (ungenügend)',
      cssClass: (v) => v <= 2 ? 'grade-1' : v <= 3 ? 'grade-2' : v <= 4 ? 'grade-4' : 'grade-6',
    },
    stages: ['Grundschule Klasse 1–4', 'Mittelstufe Klasse 5–10', 'Gymnasium / Oberstufe 11–13'],
  },
  at: {
    flag: '🇦🇹', name: 'Austria',
    gradeScale: {
      type: 'numeric', min: 1, max: 5, passing: 4, inverted: true,
      suffix: '', best: '1', worst: '5',
      labels: { 1: 'Sehr gut', 2: 'Gut', 3: 'Befriedigend', 4: 'Genügend', 5: 'Nicht genügend' },
      scaleDesc: '1 (Sehr gut) → 5 (Nicht genügend)',
      cssClass: (v) => v <= 2 ? 'grade-1' : v <= 3 ? 'grade-2' : v <= 4 ? 'grade-4' : 'grade-6',
    },
    stages: ['Volksschule 1–4', 'Mittelschule / AHS-Unterstufe 5–8', 'AHS-Oberstufe 9–12'],
  },
  ch: {
    flag: '🇨🇭', name: 'Switzerland',
    gradeScale: {
      type: 'numeric', min: 1, max: 6, passing: 4, inverted: false,
      suffix: '', best: '6', worst: '1',
      labels: { 6: 'sehr gut', 5: 'gut', 4: 'genügend', 3: 'ungenügend', 2: 'schwach', 1: 'sehr schwach' },
      scaleDesc: '6 (sehr gut) → 1 (sehr schwach)',
      cssClass: (v) => v >= 5 ? 'grade-1' : v >= 4 ? 'grade-3' : v >= 3 ? 'grade-4' : 'grade-6',
    },
    stages: ['Primarstufe 1–6', 'Sekundarstufe I 7–9', 'Gymnasium / Mittelschule 10–12'],
  },
  fr: {
    flag: '🇫🇷', name: 'France',
    gradeScale: {
      type: 'numeric', min: 0, max: 20, passing: 10, inverted: false,
      suffix: '/20', best: '20', worst: '0',
      labels: {},
      scaleDesc: '0–20 (réussite ≥ 10)',
      cssClass: (v) => v >= 16 ? 'grade-1' : v >= 12 ? 'grade-2' : v >= 10 ? 'grade-3' : v >= 8 ? 'grade-4' : 'grade-6',
    },
    stages: ['École primaire CP–CM2', 'Collège 6e–3e', 'Lycée 2nde–Terminale'],
  },
  nl: {
    flag: '🇳🇱', name: 'Netherlands',
    gradeScale: {
      type: 'numeric', min: 1, max: 10, passing: 6, inverted: false,
      suffix: '', best: '10', worst: '1',
      labels: {},
      scaleDesc: '1–10 (voldoende ≥ 6)',
      cssClass: (v) => v >= 8 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 6 ? 'grade-3' : 'grade-6',
    },
    stages: ['Basisschool 1–8', 'VMBO / HAVO / VWO 1–4/5/6'],
  },
  be: {
    flag: '🇧🇪', name: 'Belgium',
    gradeScale: {
      type: 'numeric', min: 0, max: 20, passing: 10, inverted: false,
      suffix: '/20', best: '20', worst: '0',
      labels: {},
      scaleDesc: '0–20 (réussite ≥ 10)',
      cssClass: (v) => v >= 16 ? 'grade-1' : v >= 12 ? 'grade-2' : v >= 10 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primaire 1–6', 'Secondaire 7–12'],
  },
  it: {
    flag: '🇮🇹', name: 'Italy',
    gradeScale: {
      type: 'numeric', min: 1, max: 10, passing: 6, inverted: false,
      suffix: '/10', best: '10', worst: '1',
      labels: { 10: 'Eccellente', 9: 'Ottimo', 8: 'Buono', 7: 'Discreto', 6: 'Sufficiente', 5: 'Mediocre', 4: 'Insufficiente' },
      scaleDesc: '1–10 (sufficiente ≥ 6)',
      cssClass: (v) => v >= 9 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 6 ? 'grade-3' : 'grade-6',
    },
    stages: ['Scuola primaria 1–5', 'Scuola media 6–8', 'Liceo / Istituto 9–13'],
  },
  es: {
    flag: '🇪🇸', name: 'Spain',
    gradeScale: {
      type: 'numeric', min: 0, max: 10, passing: 5, inverted: false,
      suffix: '/10', best: '10', worst: '0',
      labels: { 10: 'Sobresaliente', 9: 'Sobresaliente', 8: 'Notable', 7: 'Notable', 6: 'Bien', 5: 'Aprobado' },
      scaleDesc: '0–10 (aprobado ≥ 5)',
      cssClass: (v) => v >= 9 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 5 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primaria 6–12', 'ESO 12–16', 'Bachillerato 16–18'],
  },
  pl: {
    flag: '🇵🇱', name: 'Poland',
    gradeScale: {
      type: 'numeric', min: 1, max: 6, passing: 2, inverted: false,
      suffix: '', best: '6', worst: '1',
      labels: { 6: 'celujący', 5: 'bardzo dobry', 4: 'dobry', 3: 'dostateczny', 2: 'dopuszczający', 1: 'niedostateczny' },
      scaleDesc: '1 (niedostateczny) → 6 (celujący)',
      cssClass: (v) => v >= 5 ? 'grade-1' : v >= 4 ? 'grade-2' : v >= 3 ? 'grade-3' : v >= 2 ? 'grade-4' : 'grade-6',
    },
    stages: ['Szkoła podstawowa 1–8', 'Liceum / Technikum 9–12'],
  },
  ru: {
    flag: '🇷🇺', name: 'Russia',
    gradeScale: {
      type: 'numeric', min: 1, max: 5, passing: 3, inverted: false,
      suffix: '', best: '5', worst: '1',
      labels: { 5: 'отлично', 4: 'хорошо', 3: 'удовлетворительно', 2: 'неудовлетворительно', 1: 'плохо' },
      scaleDesc: '1 → 5 (зачёт ≥ 3)',
      cssClass: (v) => v >= 5 ? 'grade-1' : v >= 4 ? 'grade-2' : v >= 3 ? 'grade-3' : 'grade-6',
    },
    stages: ['Начальная школа 1–4', 'Основная школа 5–9', 'Средняя школа 10–11'],
  },
  ua: {
    flag: '🇺🇦', name: 'Ukraine',
    gradeScale: {
      type: 'numeric', min: 1, max: 12, passing: 4, inverted: false,
      suffix: '', best: '12', worst: '1',
      labels: {},
      scaleDesc: '1–12 (зараховано ≥ 4)',
      cssClass: (v) => v >= 10 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 4 ? 'grade-3' : 'grade-6',
    },
    stages: ['Початкова школа 1–4', 'Основна школа 5–9', 'Старша школа 10–12'],
  },
  tr: {
    flag: '🇹🇷', name: 'Turkey',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 50, inverted: false,
      suffix: '', best: '100', worst: '0',
      labels: {},
      scaleDesc: '0–100 (geçme ≥ 50)',
      cssClass: (v) => v >= 85 ? 'grade-1' : v >= 70 ? 'grade-2' : v >= 50 ? 'grade-3' : 'grade-6',
    },
    stages: ['İlkokul 1–4', 'Ortaokul 5–8', 'Lise 9–12'],
  },
  // ── Americas ────────────────────────────────────────────────────────────
  us: {
    flag: '🇺🇸', name: 'United States',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 60, inverted: false,
      suffix: '', best: 'A', worst: 'F',
      labels: {},
      scaleDesc: 'A (90-100) · B (80-89) · C (70-79) · D (60-69) · F (<60)',
      cssClass: (v) => v >= 90 ? 'grade-1' : v >= 80 ? 'grade-2' : v >= 70 ? 'grade-3' : v >= 60 ? 'grade-4' : 'grade-6',
      letterFromPct: (v) => v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : v >= 60 ? 'D' : 'F',
    },
    stages: ['Elementary School K–5', 'Middle School 6–8', 'High School 9–12'],
  },
  ca: {
    flag: '🇨🇦', name: 'Canada',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 50, inverted: false,
      suffix: '', best: 'A+', worst: 'F',
      labels: {},
      scaleDesc: 'A+ (95-100) · A (87-94) · B (73-86) · C (60-72) · F (<50)',
      cssClass: (v) => v >= 87 ? 'grade-1' : v >= 73 ? 'grade-2' : v >= 60 ? 'grade-3' : v >= 50 ? 'grade-4' : 'grade-6',
      letterFromPct: (v) => v >= 95 ? 'A+' : v >= 87 ? 'A' : v >= 80 ? 'B+' : v >= 73 ? 'B' : v >= 67 ? 'C+' : v >= 60 ? 'C' : v >= 50 ? 'D' : 'F',
    },
    stages: ['Elementary K–6', 'Junior High / Middle 7–9', 'Secondary 9–12'],
  },
  mx: {
    flag: '🇲🇽', name: 'Mexico',
    gradeScale: {
      type: 'numeric', min: 0, max: 10, passing: 6, inverted: false,
      suffix: '/10', best: '10', worst: '0',
      labels: {},
      scaleDesc: '0–10 (aprobado ≥ 6)',
      cssClass: (v) => v >= 9 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 6 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primaria 1–6', 'Secundaria 7–9', 'Preparatoria / Bachillerato 10–12'],
  },
  br: {
    flag: '🇧🇷', name: 'Brazil',
    gradeScale: {
      type: 'numeric', min: 0, max: 10, passing: 5, inverted: false,
      suffix: '/10', best: '10', worst: '0',
      labels: {},
      scaleDesc: '0–10 (aprovado ≥ 5)',
      cssClass: (v) => v >= 8 ? 'grade-1' : v >= 7 ? 'grade-2' : v >= 5 ? 'grade-3' : 'grade-6',
    },
    stages: ['Ensino Fundamental I 1–5', 'Ensino Fundamental II 6–9', 'Ensino Médio 10–12'],
  },
  arg: {
    flag: '🇦🇷', name: 'Argentina',
    gradeScale: {
      type: 'numeric', min: 1, max: 10, passing: 6, inverted: false,
      suffix: '/10', best: '10', worst: '1',
      labels: {},
      scaleDesc: '1–10 (aprobado ≥ 6)',
      cssClass: (v) => v >= 8 ? 'grade-1' : v >= 6 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primaria 1–6', 'Secundaria 7–12'],
  },
  // ── UK & Commonwealth ───────────────────────────────────────────────────
  gb: {
    flag: '🇬🇧', name: 'United Kingdom',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 40, inverted: false,
      suffix: '', best: 'A*', worst: 'U',
      labels: {},
      scaleDesc: 'A* · A · B · C · D · E · U',
      cssClass: (v) => v >= 80 ? 'grade-1' : v >= 70 ? 'grade-2' : v >= 40 ? 'grade-3' : 'grade-6',
      letterFromPct: (v) => v >= 90 ? 'A*' : v >= 80 ? 'A' : v >= 70 ? 'B' : v >= 60 ? 'C' : v >= 50 ? 'D' : v >= 40 ? 'E' : 'U',
    },
    stages: ['Primary School Y1–Y6', 'Secondary School Y7–Y11', 'Sixth Form Y12–Y13'],
  },
  au: {
    flag: '🇦🇺', name: 'Australia',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 50, inverted: false,
      suffix: '', best: 'A', worst: 'E',
      labels: {},
      scaleDesc: 'A (85-100) · B (75-84) · C (65-74) · D (50-64) · E (<50)',
      cssClass: (v) => v >= 85 ? 'grade-1' : v >= 75 ? 'grade-2' : v >= 65 ? 'grade-3' : v >= 50 ? 'grade-4' : 'grade-6',
      letterFromPct: (v) => v >= 85 ? 'A' : v >= 75 ? 'B' : v >= 65 ? 'C' : v >= 50 ? 'D' : 'E',
    },
    stages: ['Primary School Prep–6', 'Secondary School 7–10', 'Senior Secondary 11–12'],
  },
  // ── Asia & Middle East ──────────────────────────────────────────────────
  cn: {
    flag: '🇨🇳', name: 'China',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 60, inverted: false,
      suffix: '', best: '100', worst: '0',
      labels: {},
      scaleDesc: '0–100 (及格 ≥ 60) · 优 ≥90 · 良 ≥75 · 中 ≥60 · 差 <60',
      cssClass: (v) => v >= 90 ? 'grade-1' : v >= 75 ? 'grade-2' : v >= 60 ? 'grade-3' : 'grade-6',
    },
    stages: ['小学 Primary 1–6', '初中 Middle School 7–9', '高中 High School 10–12'],
  },
  jp: {
    flag: '🇯🇵', name: 'Japan',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 60, inverted: false,
      suffix: '', best: 'S', worst: 'D',
      labels: {},
      scaleDesc: 'S (90-100) · A (80-89) · B (70-79) · C (60-69) · D (<60)',
      cssClass: (v) => v >= 90 ? 'grade-1' : v >= 80 ? 'grade-2' : v >= 70 ? 'grade-3' : v >= 60 ? 'grade-4' : 'grade-6',
      letterFromPct: (v) => v >= 90 ? 'S' : v >= 80 ? 'A' : v >= 70 ? 'B' : v >= 60 ? 'C' : 'D',
    },
    stages: ['小学校 Elementary 1–6', '中学校 Junior High 7–9', '高等学校 High School 10–12'],
  },
  kr: {
    flag: '🇰🇷', name: 'South Korea',
    gradeScale: {
      type: 'letter', min: 0, max: 100, passing: 60, inverted: false,
      suffix: '', best: 'A', worst: 'F',
      labels: {},
      scaleDesc: 'A (90-100) · B (80-89) · C (70-79) · D (60-69) · F (<60)',
      cssClass: (v) => v >= 90 ? 'grade-1' : v >= 80 ? 'grade-2' : v >= 60 ? 'grade-3' : 'grade-6',
      letterFromPct: (v) => v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : v >= 60 ? 'D' : 'F',
    },
    stages: ['초등학교 Elementary 1–6', '중학교 Middle 7–9', '고등학교 High School 10–12'],
  },
  in: {
    flag: '🇮🇳', name: 'India',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 33, inverted: false,
      suffix: '%', best: '100%', worst: '0%',
      labels: {},
      scaleDesc: '0–100% (pass ≥ 33%)',
      cssClass: (v) => v >= 75 ? 'grade-1' : v >= 60 ? 'grade-2' : v >= 33 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primary 1–5', 'Upper Primary 6–8', 'Secondary 9–10', 'Higher Secondary 11–12'],
  },
  pk: {
    flag: '🇵🇰', name: 'Pakistan',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 33, inverted: false,
      suffix: '%', best: '100%', worst: '0%',
      labels: {},
      scaleDesc: '0–100% (pass ≥ 33%)',
      cssClass: (v) => v >= 80 ? 'grade-1' : v >= 60 ? 'grade-2' : v >= 33 ? 'grade-3' : 'grade-6',
    },
    stages: ['Primary 1–5', 'Middle 6–8', 'Secondary 9–10', 'Higher Secondary 11–12'],
  },
  sa: {
    flag: '🇸🇦', name: 'Saudi Arabia',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 50, inverted: false,
      suffix: '', best: '100', worst: '0',
      labels: {},
      scaleDesc: '٠–١٠٠ (ناجح ≥ ٥٠) · ممتاز ≥90 · جيد جداً ≥80 · جيد ≥70 · مقبول ≥50',
      cssClass: (v) => v >= 90 ? 'grade-1' : v >= 80 ? 'grade-2' : v >= 50 ? 'grade-3' : 'grade-6',
    },
    stages: ['الابتدائية Primary 1–6', 'المتوسطة Middle 7–9', 'الثانوية High School 10–12'],
  },
  ir: {
    flag: '🇮🇷', name: 'Iran',
    gradeScale: {
      type: 'numeric', min: 0, max: 20, passing: 10, inverted: false,
      suffix: '/۲۰', best: '۲۰', worst: '۰',
      labels: {},
      scaleDesc: '۰–۲۰ (قبولی ≥ ۱۰)',
      cssClass: (v) => v >= 17 ? 'grade-1' : v >= 14 ? 'grade-2' : v >= 10 ? 'grade-3' : 'grade-6',
    },
    stages: ['ابتدایی 1–6', 'متوسطه اول 7–9', 'متوسطه دوم 10–12'],
  },
  // ── Africa ──────────────────────────────────────────────────────────────
  za: {
    flag: '🇿🇦', name: 'South Africa',
    gradeScale: {
      type: 'numeric', min: 0, max: 100, passing: 30, inverted: false,
      suffix: '%', best: '100%', worst: '0%',
      labels: {},
      scaleDesc: '0–100% · Level 7 (80-100) · Level 4 (50-59) · Level 2 (30-39)',
      cssClass: (v) => v >= 70 ? 'grade-1' : v >= 50 ? 'grade-2' : v >= 30 ? 'grade-3' : 'grade-6',
    },
    stages: ['Foundation Phase R–3', 'Intermediate Phase 4–6', 'Senior Phase 7–9', 'FET 10–12'],
  },
};
window.SCHOOL_SYSTEMS = SCHOOL_SYSTEMS;

// Returns the active school system object
const getSchoolSystem = () => SCHOOL_SYSTEMS[state.ui.country || 'de'] || SCHOOL_SYSTEMS.de;

// Maps German 1-6 grade (1=best) to a 0-100 percentage for cross-system conversion
const _deGradeToPercent = (v) => ({ 1: 97, 2: 83, 3: 67, 4: 55, 5: 38, 6: 20 })[Math.round(v)] || 50;

// Converts a German 1-6 grade value to the display string for the current school system
const formatGradeValue = (germanValue, lang) => {
  const sys = getSchoolSystem();
  const scale = sys.gradeScale;
  // If we're on German scale, just format the number
  if (state.ui.country === 'de') return formatNumber(germanValue, lang);
  const pct = _deGradeToPercent(germanValue);
  if (scale.type === 'letter') {
    return scale.letterFromPct ? scale.letterFromPct(pct) : (pct >= scale.passing ? 'P' : 'F');
  }
  // Numeric system
  const range = scale.max - scale.min;
  let converted;
  if (scale.inverted) {
    converted = scale.max - Math.round((pct / 100) * range);
  } else {
    converted = scale.min + Math.round((pct / 100) * range);
  }
  converted = Math.max(scale.min, Math.min(scale.max, converted));
  // Round to 1 decimal for scales like Austria 1–5
  const val = Number.isInteger(converted) ? converted : converted.toFixed(1);
  return formatNumber(val, lang) + (scale.suffix || '');
};

// Returns the CSS grade class for a German 1-6 value in the current school system
const gradeClass = (germanValue) => {
  const sys = getSchoolSystem();
  if (state.ui.country === 'de') return `grade-${Math.min(6, Math.max(1, Math.round(germanValue)))}`;
  const pct = _deGradeToPercent(germanValue);
  return sys.gradeScale.cssClass(pct);
};

// ─── Learn Progress Tracking ─────────────────────────────────────────────────
const LEARN_PROGRESS_KEY = 'nexus_learn_progress_v2';
const loadLearnProgress = () => {
  try { return JSON.parse(localStorage.getItem(LEARN_PROGRESS_KEY) || '{}'); } catch { return {}; }
};
const saveLearnProgress = (d) => {
  try { localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(d)); } catch {}
};
const _progressKey = (mode, sid, fi, ti) => `${mode}::${sid}::${fi}::${ti}`;
const markTopicDone = (mode, sid, fi, ti) => {
  const p = loadLearnProgress(); p[_progressKey(mode, sid, fi, ti)] = Date.now(); saveLearnProgress(p);
};
const unmarkTopicDone = (mode, sid, fi, ti) => {
  const p = loadLearnProgress(); delete p[_progressKey(mode, sid, fi, ti)]; saveLearnProgress(p);
};
const isTopicDone = (mode, sid, fi, ti) => !!loadLearnProgress()[_progressKey(mode, sid, fi, ti)];
const countSubjectDone = (mode, sid, folders) => {
  const p = loadLearnProgress();
  let done = 0, total = 0;
  (folders || []).forEach((f, fi) => (f.topics || []).forEach((_, ti) => { total++; if (p[_progressKey(mode, sid, fi, ti)]) done++; }));
  return { done, total };
};

// ─── Learn search state ───────────────────────────────────────────────────────
const _learnSearch = { q: '', cat: 'all', subjectTab: 'topics', vocabCache: {}, vocabLoading: false };

// ─── Vocabulary tab config per language subject ───────────────────────────────
// LANG_VOCAB_SKIP: locale codes (lower-case) that are native for this subject
//   → those users don't see the vocab tab (they ARE the native speakers).
const LANG_VOCAB_SKIP = {
  'german-language':             new Set(['de']),
  'french-language':             new Set(['fr']),
  'spanish-language':            new Set(['es', 'es-ar', 'es-mx', 'es-us', 'es-uy']),
  'arabic-language':             new Set(['ar', 'ar-ps']),
  'chinese-language':            new Set(['zh', 'zh-tw']),
  'latin-language':              new Set([]),
  'english-as-foreign-language': new Set(['en']),
};

const LANG_VOCAB_MAP = {
  'german-language':             { file: 'german',  wordKey: 'de', subKey: null, transKey: 'en', exKey: 'ex_de', rtl: false },
  'french-language':             { file: 'french',  wordKey: 'fr', subKey: null, transKey: 'en', exKey: 'ex_fr', rtl: false },
  'spanish-language':            { file: 'spanish', wordKey: 'es', subKey: null, transKey: 'en', exKey: 'ex_es', rtl: false },
  'arabic-language':             { file: 'arabic',  wordKey: 'ar', subKey: 'tr', transKey: 'en', exKey: 'ex_ar', rtl: true  },
  'chinese-language':            { file: 'chinese', wordKey: 'zh', subKey: 'py', transKey: 'en', exKey: 'ex_zh', rtl: false },
  'latin-language':              { file: 'latin',   wordKey: 'la', subKey: null, transKey: 'en', exKey: 'ex_la', rtl: false },
  'english-as-foreign-language': { file: 'english', wordKey: 'en', subKey: null, transKey: 'de', exKey: 'ex_en', rtl: false },
};

const renderLearnTopicDetail = async (subjectId, folderIdx, topicIdx, _scrollSection) => {
  const container = document.getElementById('learnContent');
  if (!container) return;
  const model = window.LEARN_SOURCES || { core: {}, school: [], university: [] };
  const mode = state.ui.studyMode;
  const subjects = model[mode] || [];
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return renderLearn();
  const folder = (subject.folders || [])[folderIdx];
  if (!folder) return renderLearn();
  const topicRaw = (folder.topics || [])[topicIdx];
  if (!topicRaw) return renderLearn();

  const meta       = getLearnMeta(subjectId);
  const done       = isTopicDone(mode, subjectId, folderIdx, topicIdx);
  const subjectTl  = tr(subject.title, subject.title);
  const folderTl   = tr(folder.name, folder.name);
  const topicTl    = tr(topicRaw, topicRaw);
  const sources    = model.core[folder.sourceGroup] || [];

  // ── Per-topic deep content (falls back to folder-level) ───────────────────
  const tpDescRaw   = tr(topicRaw + '_desc', '');
  const descTl      = tpDescRaw || (folder.description ? tr(folder.description, folder.description) : '');

  const tpKps       = [0,1,2,3,4].map(i => tr(topicRaw + '_kp' + i, '')).filter(Boolean);
  const keyPointsTl = tpKps.length > 0 ? tpKps : (folder.keyPoints || []).map(kp => tr(kp, kp));

  const tpInsight   = tr(topicRaw + '_insight', '');
  const insightTl   = tpInsight || (folder.miniTask ? tr(folder.miniTask, folder.miniTask) : '');

  const allTopicsTl = (folder.topics || []).map(t => tr(t, t));

  // ── Auto-save bookmark (tracks exact position within topic) ───────────────
  const prevBm = getLearnBookmark(mode);
  const sameTopicBm = prevBm?.subjectId === subjectId && prevBm?.folderIndex === folderIdx && prevBm?.topicIndex === topicIdx;
  const scrollSection = _scrollSection || (sameTopicBm ? prevBm.sectionKey : null);
  setLearnBookmark({
    mode, subjectId, subjectTitle: subjectTl, folderName: folderTl,
    folderIndex: folderIdx, topic: topicTl, topicIndex: topicIdx,
    sectionKey: scrollSection || 'desc',
  });

  // ── Build HTML ─────────────────────────────────────────────────────────────
  const mkSection = (secKey, labelKey, labelFb, inner) => `
    <div class="learn-topic-section ltd-sec" data-section="${secKey}"
         onclick="learnMarkSection('${subjectId}',${folderIdx},${topicIdx},'${secKey}')">
      <div class="learn-topic-section-label">${tr(labelKey, labelFb)}</div>
      ${inner}
    </div>`;

  const kpHtml = keyPointsTl.map((kp, i) => `
    <div class="ltd-kp-row" data-section="kp${i}"
         onclick="event.stopPropagation();learnMarkSection('${subjectId}',${folderIdx},${topicIdx},'kp${i}')">
      <span class="ltd-kp-num" style="background:${meta.color}22;color:${meta.color}">${i + 1}</span>
      <span class="ltd-kp-text">${kp}</span>
      <span class="ltd-kp-bookmark-icon" title="${tr('learnBookmarkPos','Position merken')}">🔖</span>
    </div>`).join('');

  const relatedHtml = allTopicsTl.filter((_, i) => i !== topicIdx).map((t, i) => {
    const realIdx = i >= topicIdx ? i + 1 : i;
    return `<button class="learn-topic-chip learn-topic-chip-btn" onclick="renderLearnTopicDetail('${subjectId}',${folderIdx},${realIdx})">${t}</button>`;
  }).join('');

  const sourcesHtml = sources.map(s => `<span class="ltd-source-tag">${s}</span>`).join('');

  container.innerHTML = `
    <div class="learn-wrap">
      <div class="ltd-topbar">
        <button class="learn-back-btn" onclick="renderLearn()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="15 18 9 12 15 6"/></svg>
          ${tr('learnBack','Zurück')}
        </button>
        <nav class="ltd-breadcrumb">
          <span>${subjectTl}</span><span class="ltd-bc-sep">›</span>
          <span>${folderTl}</span><span class="ltd-bc-sep">›</span>
          <span class="ltd-bc-current">${topicTl}</span>
        </nav>
        <button class="ltd-pos-btn" onclick="learnMarkSection('${subjectId}',${folderIdx},${topicIdx},'desc')" title="${tr('learnBookmarkPos','Position merken')}">
          🔖 ${tr('learnBookmarkPos','Position merken')}
        </button>
      </div>

      <div class="learn-topic-detail">
        <div class="ltd-header" style="border-left:4px solid ${meta.color}">
          <div class="ltd-header-icon" style="background:${meta.color}22;font-size:28px">${meta.icon}</div>
          <div class="ltd-header-text">
            <div class="ltd-folder-label">${folderTl}</div>
            <h2 class="learn-topic-detail-title">${topicTl}</h2>
          </div>
          <button class="ltd-done-btn${done ? ' done' : ''}"
            onclick="toggleLearnTopicDone('${subjectId}',${folderIdx},${topicIdx},this)"
            style="${done ? `background:${meta.color};border-color:${meta.color};color:#fff` : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><polyline points="20 6 9 17 4 12"/></svg>
            ${done ? tr('learnDone','Erledigt ✓') : tr('learnMarkDone','Als erledigt markieren')}
          </button>
        </div>

        ${descTl ? mkSection('desc','learnSummary','Erklärung', `<p class="ltd-desc">${descTl}</p>`) : ''}

        ${kpHtml ? mkSection('concepts','learnTopicKeyPoints','Kernkonzepte', `<div class="ltd-kp-list">${kpHtml}</div>`) : ''}

        ${insightTl ? mkSection('insight','learnTopicInsight','Vertiefung', `
          <div class="ltd-insight-box" style="border-left:3px solid ${meta.color}">
            <span class="ltd-insight-icon">💡</span>
            <span class="ltd-insight-text">${insightTl}</span>
          </div>`) : ''}

        ${sourcesHtml ? mkSection('sources','learnTopicSources','Quellen', `<div class="ltd-sources-row">${sourcesHtml}</div>`) : ''}

        ${relatedHtml ? mkSection('related','learnTopicRelated','Weitere Themen in diesem Kapitel', `<div class="learn-topic-related-row">${relatedHtml}</div>`) : ''}
      </div>
    </div>`;

  // ── Highlight + scroll to saved/requested section ─────────────────────────
  const targetSec = scrollSection;
  if (targetSec) {
    setTimeout(() => {
      // Try specific kp row first, then section
      const el = container.querySelector(`[data-section="${targetSec}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ltd-highlight');
        setTimeout(() => el.classList.remove('ltd-highlight'), 2500);
      }
    }, 80);
  }
};

window.renderLearnTopicDetail = renderLearnTopicDetail;

window.learnMarkSection = (subjectId, folderIdx, topicIdx, sectionKey) => {
  const mode = state.ui.studyMode;
  const bm = getLearnBookmark(mode);
  // Update sectionKey in existing bookmark for this topic
  if (bm) {
    setLearnBookmark({ ...bm, sectionKey });
  }
  // Visual feedback: highlight the clicked row
  document.querySelectorAll('.ltd-kp-row, .ltd-sec').forEach(el => el.classList.remove('ltd-bookmark-pos'));
  const el = document.querySelector(`[data-section="${sectionKey}"]`);
  if (el) {
    el.classList.add('ltd-bookmark-pos');
    Notifications.show('🔖 ' + tr('learnBookmarkPosSaved', 'Lesezeichen gesetzt'));
  }
};

window.toggleLearnTopicDone = (subjectId, folderIdx, topicIdx) => {
  const mode = state.ui.studyMode;
  if (isTopicDone(mode, subjectId, folderIdx, topicIdx)) {
    unmarkTopicDone(mode, subjectId, folderIdx, topicIdx);
    Notifications.show(tr('learnMarkedUndone','Marked as not done.'));
  } else {
    markTopicDone(mode, subjectId, folderIdx, topicIdx);
    Notifications.show(tr('learnMarkedDone','Topic marked as done! ✓'));
  }
  renderLearnTopicDetail(subjectId, folderIdx, topicIdx);
};

const renderLearn = async () => {
  const container = document.getElementById('learnContent');
  if (!container) return;

  const mode = state.ui.studyMode;
  const model = window.LEARN_SOURCES || { core: {}, school: [], university: [] };
  const allSubjects = model[mode] || [];

  if (!allSubjects.length) {
    container.innerHTML = `<div class="dash-list-placeholder">${tr('learnEmpty','No content available.')}</div>`;
    return;
  }

  // ── Category definitions ─────────────────────────────────────────────────
  const LEARN_CATS = {
    school: [
      { id: 'stem',   label: tr('learnCatSTEM','MINT'),             ids: ['mathematics','physics','chemistry','biology','computer-science','earth-science','astronomy'] },
      { id: 'lang',   label: tr('learnCatLanguages','Sprachen'),     ids: ['language-arts','german-language','french-language','spanish-language','arabic-language','chinese-language','latin-language','english-as-foreign-language'] },
      { id: 'social', label: tr('learnCatSocial','Soziales'),        ids: ['history','geography','economics','social-studies','politics-civics'] },
      { id: 'hum',    label: tr('learnCatHumanities','Geisteswiss.'),ids: ['philosophy','religion-ethics','arts','music','media-studies'] },
      { id: 'health', label: tr('learnCatHealth','Sport & Gesundheit'), ids: ['health','physical-education'] },
      { id: 'tech',   label: tr('learnCatTech','Technik'),           ids: ['technology','environmental-studies','psychology-school'] },
    ],
    university: [
      { id: 'stem',   label: tr('learnCatSTEM','MINT'),              ids: ['mathematics','physics','chemistry','biology','computer-science','engineering','statistics-data-science','cybersecurity'] },
      { id: 'social', label: tr('learnCatSocial','Sozialwiss.'),     ids: ['economics','law','sociology','political-science','social-work'] },
      { id: 'health', label: tr('learnCatHealth','Medizin & Gesundheit'), ids: ['medicine','psychology','nutrition-dietetics'] },
      { id: 'lang',   label: tr('learnCatLanguages','Sprachen & Lit.'), ids: ['linguistics','literature'] },
      { id: 'hum',    label: tr('learnCatHumanities','Geisteswiss.'), ids: ['philosophy','history','education-pedagogy'] },
      { id: 'tech',   label: tr('learnCatTech','Angewandte Wiss.'),  ids: ['architecture','business-administration','environmental-science'] },
    ],
  };
  const cats = LEARN_CATS[mode] || [];

  // Track which category sections are open (Set of cat ids)
  if (!_learnSearch.openCats) {
    _learnSearch.openCats = new Set([cats[0]?.id].filter(Boolean));
  }

  const q = (_learnSearch.q || '').toLowerCase().trim();

  // Ensure a valid subject is selected
  if (!state.ui.learnSelectedSubject || !allSubjects.find(s => s.id === state.ui.learnSelectedSubject)) {
    state.ui.learnSelectedSubject = allSubjects[0].id;
  }
  const selId = state.ui.learnSelectedSubject;
  const subject = allSubjects.find(s => s.id === selId) || allSubjects[0];
  const meta = getLearnMeta(subject.id);
  const subjectTitle = tr(subject.title, subject.title);
  const vocabConf   = LANG_VOCAB_MAP[selId] || null;
  const activeLoc   = (window.currentLang || 'en').toLowerCase();
  const isNative    = vocabConf && (LANG_VOCAB_SKIP[selId] || new Set()).has(activeLoc);
  const hasVocabTab = vocabConf && !isNative;
  const subjectTab  = hasVocabTab ? (_learnSearch.subjectTab || 'topics') : 'topics';

  // Helper: render one subject card
  const subjectCard = (s) => {
    const m = getLearnMeta(s.id);
    const active = s.id === selId;
    const title = tr(s.title, s.title);
    const { done, total } = countSubjectDone(mode, s.id, s.folders);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const folderCount = (s.folders || []).length;
    return `
      <button type="button" class="learn-subject-card${active ? ' active' : ''}" onclick="selectLearnSubject('${s.id}')"
        style="${active ? `border-color:${m.color};box-shadow:0 0 0 3px ${m.color}22` : ''}">
        <div class="learn-subject-card-icon" style="background:${m.color}">${m.icon}</div>
        <div class="learn-subject-card-title">${title}</div>
        <div class="lsc-meta-row">
          <span class="lsc-badge">${folderCount} ${tr('learnChapters','Kap.')}</span>
          ${done > 0 ? `<span class="lsc-badge lsc-done">${done}/${total} ✓</span>` : ''}
        </div>
        ${pct > 0 ? `<div class="lsc-progress-bar"><div class="lsc-progress-fill" style="width:${pct}%;background:${m.color}"></div></div>` : ''}
      </button>`;
  };

  // ── Search mode: flat grid ────────────────────────────────────────────────
  let bodyHtml = '';
  if (q) {
    const results = allSubjects.filter(s => tr(s.title, s.id).toLowerCase().includes(q));
    if (results.length === 0) {
      bodyHtml = `<div class="dash-list-placeholder">${tr('learnNoResults','Keine Fächer gefunden.')}</div>`;
    } else {
      bodyHtml = `<div class="learn-subject-grid">${results.map(subjectCard).join('')}</div>`;
      if (!results.find(s => s.id === selId)) {
        state.ui.learnSelectedSubject = results[0].id;
      }
    }
  } else {
    // ── Accordion mode: collapsible category sections ──────────────────────
    bodyHtml = cats.map(cat => {
      const catSubjects = allSubjects.filter(s => cat.ids.includes(s.id));
      if (!catSubjects.length) return '';
      const isOpen = _learnSearch.openCats.has(cat.id);
      const doneCount = catSubjects.reduce((acc, s) => acc + countSubjectDone(mode, s.id, s.folders).done, 0);
      const totalCount = catSubjects.reduce((acc, s) => acc + countSubjectDone(mode, s.id, s.folders).total, 0);
      const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
      return `
        <div class="learn-cat-section">
          <button class="learn-cat-hdr" onclick="learnToggleCat('${cat.id}')">
            <svg class="learn-cat-chevron${isOpen ? ' open' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0"><polyline points="6 9 12 15 18 9"/></svg>
            <span class="learn-cat-hdr-label">${cat.label}</span>
            <span class="learn-cat-hdr-count">${catSubjects.length}</span>
            ${pct > 0 ? `<span class="learn-cat-hdr-done">${pct}%</span>` : ''}
          </button>
          ${isOpen ? `<div class="learn-cat-body"><div class="learn-subject-grid learn-subject-grid-compact">${catSubjects.map(subjectCard).join('')}</div></div>` : ''}
        </div>`;
    }).join('');
  }

  // ── Folder panel for selected subject ─────────────────────────────────────
  const { done: subDone, total: subTotal } = countSubjectDone(mode, selId, subject.folders);
  const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

  const foldersHtml = (subject.folders || []).map((folder, fi) => {
    const name = tr(folder.name, folder.name);
    const fullDesc = folder.description ? tr(folder.description, folder.description) : '';
    const topics = folder.topics || [];
    const topicsDone = topics.filter((_, ti) => isTopicDone(mode, selId, fi, ti)).length;
    const allDone = topics.length > 0 && topicsDone === topics.length;
    const topicsHtml = topics.length
      ? `<div class="learn-topics-row">${topics.map((raw, ti) => {
          const t = tr(raw, raw);
          const tdone = isTopicDone(mode, selId, fi, ti);
          return `<button class="learn-topic-chip learn-topic-chip-btn${tdone ? ' chip-done' : ''}"
            style="${tdone ? `background:${meta.color}22;border-color:${meta.color};color:${meta.color}` : ''}"
            onclick="renderLearnTopicDetail('${selId}',${fi},${ti})">${tdone ? '✓ ' : ''}${t}</button>`;
        }).join('')}</div>`
      : '';
    return `
      <div class="learn-folder-row${allDone ? ' folder-done' : ''}">
        <div class="learn-folder-row-hdr">
          <span class="learn-folder-num" style="background:${allDone ? meta.color : meta.color+'22'};color:${allDone ? '#fff' : meta.color}">${allDone ? '✓' : fi + 1}</span>
          <div class="learn-folder-row-info">
            <div class="learn-folder-row-name">${name}</div>
            ${fullDesc ? `<div class="learn-folder-row-desc">${fullDesc.slice(0,150)}${fullDesc.length > 150 ? '…' : ''}</div>` : ''}
          </div>
          ${topics.length > 0 ? `<span class="lf-count" style="color:${meta.color}">${topicsDone}/${topics.length}</span>` : ''}
        </div>
        ${topicsHtml}
      </div>`;
  }).join('');

  // ── Vocab panel HTML (for language subjects) ──────────────────────────────
  let vocabPanelHtml = '';
  if (subjectTab === 'vocab' && hasVocabTab) {
    const locale    = activeLoc;
    const cacheKey  = vocabConf.file;
    const cached    = _learnSearch.vocabCache[cacheKey];
    if (_learnSearch.vocabLoading) {
      vocabPanelHtml = `<div class="vocab-loading">${tr('loading','Laden…')}</div>`;
    } else if (cached === null) {
      vocabPanelHtml = `<div class="vocab-error">${tr('vocabLoadError','Vokabeln konnten nicht geladen werden.')}</div>`;
    } else if (cached) {
      const catEntries = Object.entries(cached.categories || {});
      if (!_learnSearch.vocabOpenCats) _learnSearch.vocabOpenCats = new Set([catEntries[0]?.[0]].filter(Boolean));
      vocabPanelHtml = `<div class="vocab-panel">${catEntries.map(([key, cat]) => {
        const isOpen = _learnSearch.vocabOpenCats.has(key);
        const entries = cat.entries || [];
        return `<div class="vocab-cat">
          <button class="vocab-cat-hdr" onclick="learnVocabToggleCat('${key}')">
            <svg class="vocab-cat-chevron${isOpen ? ' open' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><polyline points="6 9 12 15 18 9"/></svg>
            <span>${cat.label || key}</span>
            <span class="vocab-cat-count">${entries.length}</span>
          </button>
          ${isOpen ? `<div class="vocab-entries">${entries.map(e => {
            const word    = e[vocabConf.wordKey] || '';
            const sub     = vocabConf.subKey ? (e[vocabConf.subKey] || '') : '';
            // Inline locale translation: try full locale, then base lang, then English
            const baseLang = locale.includes('-') ? locale.split('-')[0] : locale;
            const trans   = e[locale] || e[baseLang] || e[vocabConf.transKey] || e.en || '';
            const ex      = e[vocabConf.exKey] || '';
            const exTrans = (vocabConf.exKey !== 'ex_en') ? (e.ex_en || '') : '';
            return `<div class="vocab-entry">
              <div class="vocab-entry-top">
                <span class="vocab-word${vocabConf.rtl ? ' rtl' : ''}">${word}</span>
                ${sub ? `<span class="vocab-sub">${sub}</span>` : ''}
                <span class="vocab-trans">${trans}</span>
              </div>
              ${ex ? `<div class="vocab-ex">${ex}${exTrans ? `<span class="vocab-ex-trans"> — ${exTrans}</span>` : ''}</div>` : ''}
            </div>`;
          }).join('')}</div>` : ''}
        </div>`;
      }).join('')}</div>`;
    }
  }

  // Bookmark resume bar
  const bm = getLearnBookmark(mode);
  const bmHtml = bm ? `
    <div class="lbr-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      <span class="lbr-text">🔖 <strong>${bm.subjectTitle || ''}</strong> › ${bm.folderName || ''} › ${bm.topic || ''}</span>
      <button class="lbr-btn" onclick="renderLearnTopicDetail('${bm.subjectId}',${bm.folderIndex},${bm.topicIndex},'${bm.sectionKey || 'desc'}')">${tr('learnContinue','Weiter')}</button>
      <button class="lbr-close" onclick="clearLearnBookmark()">✕</button>
    </div>` : '';

  container.innerHTML = `
    <div class="learn-wrap">
      <div class="learn-topbar-row">
        <div class="learn-mode-toggle">
          <button class="lmt-btn${mode === 'school' ? ' active' : ''}" onclick="switchLearnMode('school')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            ${tr('studyModeSchool','Schule')}
          </button>
          <button class="lmt-btn${mode === 'university' ? ' active' : ''}" onclick="switchLearnMode('university')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            ${tr('studyModeUniversity','Universität')}
          </button>
        </div>
        <div class="learn-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:var(--text3);flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="learn-search-input" type="text" placeholder="${tr('learnSearch','Fächer suchen…')}" value="${q.replace(/"/g,'&quot;')}" oninput="learnSearch(this.value)" />
          ${q ? `<button class="lsi-clear" onclick="learnSearch('')">✕</button>` : ''}
        </div>
      </div>

      ${bmHtml}

      <div class="learn-categories">${bodyHtml}</div>

      <div class="learn-subject-panel">
        <div class="learn-subject-panel-header" style="border-left:4px solid ${meta.color}">
          <span class="lsp-icon" style="background:${meta.color}22;font-size:22px;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;flex-shrink:0">${meta.icon}</span>
          <div class="lsp-header-text">
            <span class="learn-subject-panel-title">${subjectTitle}</span>
            ${subPct > 0 ? `<span class="lsp-pct">${subPct}% ${tr('learnComplete','abgeschlossen')}</span>` : `<span class="lsp-pct">${subTotal} ${tr('learnTopicsTotal','Themen')}</span>`}
          </div>
          ${subPct > 0 ? `<div class="lsp-prog-wrap"><div class="lsp-prog-bar"><div class="lsp-prog-fill" style="width:${subPct}%;background:${meta.color}"></div></div><span class="lsp-prog-label">${subDone}/${subTotal}</span></div>` : ''}
        </div>
        ${hasVocabTab ? `<div class="lsp-tabs">
          <button class="lsp-tab${subjectTab === 'topics' ? ' active' : ''}" onclick="learnSelectTab('topics')" style="${subjectTab === 'topics' ? `border-bottom-color:${meta.color};color:${meta.color}` : ''}">${tr('learnTabTopics','Themen')}</button>
          <button class="lsp-tab${subjectTab === 'vocab' ? ' active' : ''}" onclick="learnSelectTab('vocab')" style="${subjectTab === 'vocab' ? `border-bottom-color:${meta.color};color:${meta.color}` : ''}">${tr('learnTabVocab','Vokabular')}</button>
        </div>` : ''}
        ${subjectTab === 'vocab' && hasVocabTab ? vocabPanelHtml : `<div class="learn-folder-list">${foldersHtml}</div>`}
      </div>
    </div>`;
};

window.selectLearnSubject = (id) => {
  state.ui.learnSelectedSubject = id;
  _learnSearch.subjectTab = 'topics';
  _learnSearch.vocabOpenCats = null;
  // Scroll subject panel into view
  setTimeout(() => document.querySelector('.learn-subject-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  renderLearn();
};

window.switchLearnMode = (mode) => {
  state.ui.studyMode = mode;
  state.ui.learnSelectedSubject = null;
  _learnSearch.q = '';
  _learnSearch.cat = 'all';
  _learnSearch.openCats = null; // reset so first cat opens again
  saveUiSettings();
  renderLearn();
};

window.learnSearch = (q) => {
  _learnSearch.q = q || '';
  renderLearn();
};

window.learnToggleCat = (catId) => {
  if (!_learnSearch.openCats) _learnSearch.openCats = new Set();
  if (_learnSearch.openCats.has(catId)) {
    _learnSearch.openCats.delete(catId);
  } else {
    _learnSearch.openCats.add(catId);
  }
  renderLearn();
};

window.learnSetCat = (cat) => {
  _learnSearch.cat = cat || 'all';
  state.ui.learnSelectedSubject = null;
  renderLearn();
};

window.learnSelectTab = async (tab) => {
  _learnSearch.subjectTab = tab;
  if (tab === 'vocab') {
    const conf = LANG_VOCAB_MAP[state.ui.learnSelectedSubject];
    if (conf && !_learnSearch.vocabCache[conf.file]) {
      _learnSearch.vocabLoading = true;
      renderLearn();
      try {
        const r = await fetch(`locales/vocab/${conf.file}.json`);
        _learnSearch.vocabCache[conf.file] = await r.json();
      } catch (e) {
        _learnSearch.vocabCache[conf.file] = null;
      }
      _learnSearch.vocabLoading = false;
    }
  }
  renderLearn();
};

window.learnVocabToggleCat = (key) => {
  if (!_learnSearch.vocabOpenCats) _learnSearch.vocabOpenCats = new Set();
  if (_learnSearch.vocabOpenCats.has(key)) {
    _learnSearch.vocabOpenCats.delete(key);
  } else {
    _learnSearch.vocabOpenCats.add(key);
  }
  renderLearn();
};

const markLearnTopic = (subjectId, subjectTitle, folderName, folderIndex, topic, topicIndex) => {
  const decodedSubject = decodeURIComponent(subjectTitle || '');
  const decodedFolder = decodeURIComponent(folderName || '');
  const decodedTopic = decodeURIComponent(topic || '');
  setLearnBookmark({
    mode: state.ui.studyMode,
    subjectId,
    subjectTitle: decodedSubject,
    folderName: decodedFolder,
    folderIndex,
    topic: decodedTopic,
    topicIndex,
  });
  Notifications.show(tr('learnBookmarkSaved', 'Bookmark saved.'));
  renderLearn();
};

const clearLearnBookmark = () => {
  const all = loadLearnBookmarks();
  delete all[state.ui.studyMode];
  saveLearnBookmarks(all);
  Notifications.show(tr('learnBookmarkCleared', 'Bookmark cleared.'));
  renderLearn();
};

const resumeLearnBookmark = () => {
  const bookmark = getLearnBookmark(state.ui.studyMode);
  if (!bookmark) return;
  const anchor = `${bookmark.subjectId}::${bookmark.folderIndex}`;
  const target = document.querySelector(`[data-learn-anchor="${anchor}"]`);
  if (!target) return;
  target.open = true;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const renderSettings = () => {
  const container = document.getElementById('settingsContent');
  if (!container) return;

  const isSchool = state.ui.studyMode === 'school';
  const currentLang = (window.i18nCurrentLang || 'en').toUpperCase();
  const sys = getSchoolSystem();

  // Build sorted country option list grouped by region
  const regions = [
    { label: 'Europe', ids: ['de','at','ch','fr','nl','be','it','es','pl','ru','ua','tr','gb'] },
    { label: 'Americas', ids: ['us','ca','mx','br','arg'] },
    { label: 'Asia & Middle East', ids: ['cn','jp','kr','in','pk','sa','ir'] },
    { label: 'Africa & Oceania', ids: ['za','au'] },
  ];
  const countryOptionsHtml = regions.map(r =>
    `<optgroup label="${r.label}">${r.ids.map(id => {
      const s = SCHOOL_SYSTEMS[id];
      if (!s) return '';
      return `<option value="${id}" ${state.ui.country === id ? 'selected' : ''}>${s.flag} ${s.name}</option>`;
    }).join('')}</optgroup>`
  ).join('');

  container.innerHTML = `
    <div class="settings-grid">

      <!-- Study Mode -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div>
            <div class="settings-card-title">${tr('studyModeTitle', 'Study mode')}</div>
            <div class="settings-card-sub">${tr('studyModeDescription', 'Choose whether your learning layout is optimized for school or university.')}</div>
          </div>
        </div>
        <div class="settings-toggle-row">
          <button class="settings-mode-btn ${isSchool ? 'active' : ''}" onclick="setStudyMode('school')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            ${tr('studyModeSchool', 'School')}
          </button>
          <button class="settings-mode-btn ${!isSchool ? 'active' : ''}" onclick="setStudyMode('university')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            ${tr('studyModeUniversity', 'University')}
          </button>
        </div>
        <div class="settings-field">
          <label>${isSchool ? tr('studySchoolStage', 'School stage') : tr('studyUniSemester', 'University semester range')}</label>
          ${isSchool ? `
          <select class="select" onchange="setSchoolStage(this.value)">
            <option value="grade-5-6" ${state.ui.schoolStage === 'grade-5-6' ? 'selected' : ''}>${tr('learnSchoolStage56', 'School stage: Grade 5-6')}</option>
            <option value="grade-7-8" ${state.ui.schoolStage === 'grade-7-8' ? 'selected' : ''}>${tr('learnSchoolStage78', 'School stage: Grade 7-8')}</option>
            <option value="grade-9-10" ${state.ui.schoolStage === 'grade-9-10' ? 'selected' : ''}>${tr('learnSchoolStage910', 'School stage: Grade 9-10')}</option>
            <option value="grade-11-13" ${state.ui.schoolStage === 'grade-11-13' ? 'selected' : ''}>${tr('learnSchoolStage1113', 'School stage: Grade 11-13')}</option>
          </select>` : `
          <select class="select" onchange="setUniSemester(this.value)">
            <option value="semester-1-2" ${state.ui.uniSemester === 'semester-1-2' ? 'selected' : ''}>${tr('learnUniSem12', 'University stage: Semester 1-2')}</option>
            <option value="semester-3-4" ${state.ui.uniSemester === 'semester-3-4' ? 'selected' : ''}>${tr('learnUniSem34', 'University stage: Semester 3-4')}</option>
            <option value="semester-5-6" ${state.ui.uniSemester === 'semester-5-6' ? 'selected' : ''}>${tr('learnUniSem56', 'University stage: Semester 5-6')}</option>
            <option value="semester-7-plus" ${state.ui.uniSemester === 'semester-7-plus' ? 'selected' : ''}>${tr('learnUniSem7Plus', 'University stage: Semester 7+')}</option>
          </select>`}
        </div>
        <div class="settings-field">
          <label>${tr('studyExamMode', 'Practice focus')}</label>
          <select class="select" onchange="setExamMode(this.value)">
            <option value="basics" ${state.ui.examMode === 'basics' ? 'selected' : ''}>${tr('studyExamModeBasics', 'Basics first')}</option>
            <option value="balanced" ${state.ui.examMode === 'balanced' ? 'selected' : ''}>${tr('studyExamModeBalanced', 'Balanced')}</option>
            <option value="exam" ${state.ui.examMode === 'exam' ? 'selected' : ''}>${tr('studyExamModeExam', 'Exam prep')}</option>
          </select>
        </div>
      </div>

      <!-- Country & School System -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon" style="font-size:20px">${sys.flag}</div>
          <div>
            <div class="settings-card-title">${tr('settingsCountryTitle','Country & School System')}</div>
            <div class="settings-card-sub">${tr('settingsCountrySub','Adapts grade scales, school stages, and number formats to your education system.')}</div>
          </div>
        </div>
        <div class="settings-field">
          <label>${tr('settingsCountryLabel','Country')}</label>
          <select class="select" onchange="setCountry(this.value)">${countryOptionsHtml}</select>
        </div>
        <div class="settings-info-row" style="gap:8px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style="font-size:13px">${tr('settingsGradeScaleLabel','Grade scale')}: <strong>${sys.gradeScale.scaleDesc}</strong></span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;padding:10px 0 4px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);margin-bottom:6px">${tr('settingsSchoolStagesLabel','School stages')}</div>
          ${sys.stages.map(s => `<div style="font-size:13px;color:var(--text2);padding:3px 0;border-bottom:1px solid var(--border)">${s}</div>`).join('')}
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </div>
          <div>
            <div class="settings-card-title" data-i18n="settingsAppearanceTitle">${tr('settingsAppearanceTitle','Appearance')}</div>
            <div class="settings-card-sub" data-i18n="settingsAppearanceSub">${tr('settingsAppearanceSub','Choose your interface and focus settings.')}</div>
          </div>
        </div>
        <div class="settings-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          ${state.ui.theme === 'dark' ? tr('settingsDarkModeActive','Dark mode active') : tr('settingsLightModeActive','Light mode active')}
        </div>
        <div class="settings-field">
          <label data-i18n="settingsThemeLabel">${tr('settingsThemeLabel','Theme')}</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="settings-action-btn" onclick="setTheme('light')">${tr('settingsLightMode','Light mode')}</button>
            <button class="settings-action-btn" onclick="setTheme('dark')">${tr('settingsDarkMode','Dark mode')}</button>
          </div>
        </div>
        <div class="settings-field">
          <label data-i18n="settingsLanguageLabel">${tr('settingsLanguageLabel','Language')}</label>
          <button class="settings-action-btn" onclick="toggleLangPicker()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            ${tr('settingsChangeLanguage','Change language')} (${currentLang})
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <div>
            <div class="settings-card-title" data-i18n="settingsNotifTitle">${tr('settingsNotifTitle','Notifications')}</div>
            <div class="settings-card-sub" data-i18n="settingsNotifSub">${tr('settingsNotifSub','Manage alerts and reminders.')}</div>
          </div>
        </div>
        <div class="settings-toggle-item">
          <div>
            <div class="settings-toggle-label" data-i18n="settingsStudyReminders">${tr('settingsStudyReminders','Study reminders')}</div>
            <div class="settings-toggle-sub" data-i18n="settingsStudyRemindersSub">${tr('settingsStudyRemindersSub',"Get reminded when it's time to study")}</div>
          </div>
          <label class="settings-switch">
            <input type="checkbox" checked onchange="Notifications.show(tr('settingsReminderSaved','Reminder setting saved.'))">
            <span class="settings-switch-track"></span>
          </label>
        </div>
        <div class="settings-toggle-item">
          <div>
            <div class="settings-toggle-label" data-i18n="settingsTaskDeadlines">${tr('settingsTaskDeadlines','Task deadlines')}</div>
            <div class="settings-toggle-sub" data-i18n="settingsTaskDeadlinesSub">${tr('settingsTaskDeadlinesSub','Alerts before task due dates')}</div>
          </div>
          <label class="settings-switch">
            <input type="checkbox" checked onchange="Notifications.show(tr('settingsDeadlineSaved','Deadline alerts saved.'))">
            <span class="settings-switch-track"></span>
          </label>
        </div>
      </div>

      <!-- Account -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <div class="settings-card-title" data-i18n="settingsAccountTitle">${tr('settingsAccountTitle','Account')}</div>
            <div class="settings-card-sub" data-i18n="settingsAccountSub">${tr('settingsAccountSub','Your profile and account information.')}</div>
          </div>
        </div>
        <div class="settings-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${state.user?.email || state.profile?.name || 'Demo user'}
        </div>
        <div class="settings-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          ${state.demoMode ? tr('settingsDemoMode','Demo mode — no sync') : tr('settingsSignedIn','Signed in')}
        </div>
      </div>

      <!-- About -->
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div class="settings-card-title" data-i18n="settingsAboutTitle">${tr('settingsAboutTitle','About Nexus')}</div>
            <div class="settings-card-sub" data-i18n="settingsAboutSub">${tr('settingsAboutSub','Version and app information.')}</div>
          </div>
        </div>
        <div class="settings-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          ${tr('settingsVersion','Nexus v1.0.0')}
        </div>
        <div class="settings-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${tr('settingsDataLocal','All data stored locally')}
        </div>
      </div>

    </div>
  `;
};

const setStudyMode = (mode) => {
  if (mode !== 'school' && mode !== 'university') return;
  state.ui.studyMode = mode;
  saveUiSettings();
  renderSettings();
  renderLearn();
  if (!state.demoMode && typeof EdgeFunctions?.saveStudyPreferences === 'function') {
    EdgeFunctions.saveStudyPreferences({
      user_id: state.user?.id || null,
      study_mode: mode,
      institution: state.profile?.institution || null,
      level: state.profile?.level || null,
    }).catch(() => {});
  }
  Notifications.show(`${tr('studyModeSwitchedTo', 'Study mode switched to')} ${mode === 'school' ? tr('studyModeSchool', 'School') : tr('studyModeUniversity', 'University')}.`);
};

const setSchoolStage = (stage) => {
  state.ui.schoolStage = stage;
  saveUiSettings();
  renderSettings();
  renderLearn();
};

const setUniSemester = (semester) => {
  state.ui.uniSemester = semester;
  saveUiSettings();
  renderSettings();
  renderLearn();
};

const setExamMode = (mode) => {
  state.ui.examMode = mode;
  saveUiSettings();
  renderSettings();
  renderLearn();
};

const setCountry = (countryId) => {
  if (!SCHOOL_SYSTEMS[countryId]) return;
  state.ui.country = countryId;
  saveUiSettings();
  renderSettings();
  renderGrades();
  const sys = SCHOOL_SYSTEMS[countryId];
  Notifications.show(`${tr('settingsCountrySaved','School system updated')}: ${sys.flag} ${sys.name}`);
};
window.setCountry = setCountry;

const filterTasks = (filter, button) => {
  state.taskFilter = filter;
  const chips = Array.from(document.querySelectorAll('#page-tasks .filter-chip'));
  chips.forEach((chip) => chip.classList.remove('active'));
  if (button) {
    button.classList.add('active');
  } else {
    const match = chips.find((chip) => chip.dataset.i18n && ['hwFilterAll','hwFilterOpen','hwFilterDone','hwOverdue'].includes(chip.dataset.i18n) && filter === ({'hwFilterAll':'all','hwFilterOpen':'open','hwFilterDone':'done','hwOverdue':'overdue'}[chip.dataset.i18n]));
    if (match) match.classList.add('active');
  }

  const filtered = (state.tasks || []).filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'done') return task.status === 'done';
    if (filter === 'open') return task.status !== 'done' && task.status !== 'overdue';
    if (filter === 'overdue') return task.status === 'overdue';
    return true;
  });

  const container = document.getElementById('taskList');
  if (!container) return;

  const statusLabel = (s) => s === 'done' ? tr('hwDone','Done') : s === 'overdue' ? tr('hwOverdue','Overdue') : tr('hwOpen','Open');
  const statusClass = (s) => s === 'done' ? 'submitted' : s === 'overdue' ? 'overdue' : 'due-soon';

  container.innerHTML = filtered.length
    ? filtered.map((task) => `<div class="task-item ${task.status === 'overdue' ? 'overdue' : task.status === 'done' ? '' : 'due-soon'}"><div class="task-check ${task.status === 'done' ? 'checked' : ''}" onclick="toggleTaskDone(event, '${task.id}')"></div><div class="task-body"><div class="task-title">${task.title}</div><div class="task-meta"><span>${task.course_name || ''}</span><span>${tr('dashDue','Due')} ${new Date(task.due_date).toLocaleDateString(getActiveLanguage())}</span></div></div><div class="task-badge ${statusClass(task.status)}">${statusLabel(task.status)}</div></div>`).join('')
    : `<div class="empty-state">
        <div class="empty-state-icon"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
        <h3>${state.tasks.length === 0 ? tr('tasksNoTasks','No tasks yet') : tr('tasksNothingInFilter','Nothing in this filter')}</h3>
        <p>${state.tasks.length === 0 ? tr('tasksAddHint','Add tasks to track your assignments and deadlines.') : tr('tasksTryFilter','Try a different filter above.')}</p>
      </div>`;
};

const renderProfile = () => {
  document.getElementById('profileContent').innerHTML = `<div class="card profile-avatar-wrap"><div class="profile-avatar-large">${state.profile?.full_name?.charAt(0).toUpperCase() || '?'}</div><div class="card-title">${state.profile?.full_name || tr('profileTitle','Profile')}</div><p class="card-sub">${state.profile?.role || ''}</p></div><div class="card"><div class="field"><label>${tr('profileEmail','Email')}</label><input class="input" disabled value="${state.user?.email || ''}" /></div><div class="field"><label>${tr('profileRole','Role')}</label><input class="input" disabled value="${state.profile?.role || tr('memberRole','Member')}" /></div></div>`;
};

const renderTeacherTools = () => {
  const container = document.getElementById('page-teacher-tools');
  if (!container) return;
  container.innerHTML = `
      <div class="page-header"><div><h1>${tr('teacherToolsTitle','Teacher Tools')}</h1><p class="card-sub">${tr('teacherToolsSubtitle','Manage class access, lock student modes and distribute study content without giving students lecturer rights.')}</p></div></div>
      <div class="card"><div class="field"><label>${tr('teacherClassControl','Class control')}</label><p class="card-sub">${tr('teacherClassControlDesc','Lock student switching between school and university mode and keep the class focused on the current curriculum.')}</p></div><button class="btn btn-secondary" onclick="Notifications.show(tr('teacherLockSuccess','Class mode locked for students.'))">${tr('teacherLockBtn','Lock student mode')}</button></div>
      <div class="card"><div class="field"><label>${tr('teacherShareMaterial','Share study material')}</label><p class="card-sub">${tr('teacherShareMaterialDesc','Publish assignments or quick revision notes for your class.')}</p></div><button class="btn btn-primary" onclick="Notifications.show(tr('teacherShareSuccess','Study materials shared with class.'))">${tr('teacherShareBtn','Share a new resource')}</button></div>
  `;
};

const renderAdmin = async () => {
  const container = document.getElementById('adminUserList');
  container.innerHTML = `<div class="dash-list-placeholder">${tr('loadingLabel','Loading...')}</div>`;
  const { data, error } = await sb.from('profiles').select('*').order('full_name', { ascending: true });
  if (error) return (container.innerHTML = `<div class="dash-list-placeholder">${tr('adminLoadError','Unable to load users.')}</div>`);
  container.innerHTML = `<table class="user-table"><thead><tr><th>${tr('adminColName','Name')}</th><th>${tr('adminColEmail','Email')}</th><th>${tr('adminColRole','Role')}</th></tr></thead><tbody>${data.map((profile) => `<tr><td>${profile.full_name}</td><td>${profile.email}</td><td><span class="role-badge ${profile.role}">${profile.role}</span></td></tr>`).join('')}</tbody></table>`;
};

const renderInvites = async () => {
  const container = document.getElementById('inviteList');
  container.innerHTML = `<div class="dash-list-placeholder">${tr('loadingLabel','Loading...')}</div>`;
  const { data, error } = await sb.from('invite_codes').select('*').order('created_at', { ascending: false });
  if (error) return (container.innerHTML = `<div class="dash-list-placeholder">${tr('invitesLoadError','Unable to load invites.')}</div>`);
  container.innerHTML = data.length ? `<div class="invite-grid">${data.map((invite) => `<div class="invite-card ${invite.used_at ? 'invite-used' : ''}"><div class="invite-code">${invite.code}</div><div class="invite-meta">${tr('inviteRole','Role')}: ${invite.role}</div><div class="invite-meta">${tr('inviteCreated','Created')}: ${new Date(invite.created_at).toLocaleDateString(getActiveLanguage())}</div></div>`).join('')}</div>` : `<div class="dash-list-placeholder">${tr('invitesNone','No invite codes yet.')}</div>`;
};

const generateInviteCode = async () => {
  try {
    const result = await EdgeFunctions.generateInvite('teacher');
    Notifications.show('Invite code generated successfully.');
    await renderInvites();
  } catch (error) {
    Notifications.show(error.message, 'error');
  }
};

const openCreateUser = () => {
  const body = `<div class="field"><label>Full name</label><input class="input" id="createUserName" placeholder="Full name" /></div><div class="field"><label>Email</label><input class="input" id="createUserEmail" placeholder="Email" /></div><div class="field"><label>Password</label><input class="input" id="createUserPassword" type="password" placeholder="Temporary password" /></div><div class="field"><label>Role</label><select class="select" id="createUserRole"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select></div><div class="field"><label>Invite code</label><input class="input" id="createUserInvite" placeholder="Optional invite code" /></div>`;
  openModal('Create new user', `${body}<div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitCreateUser()">Create</button></div>`);
};

const submitCreateUser = async () => {
  const email = document.getElementById('createUserEmail').value.trim();
  const password = document.getElementById('createUserPassword').value;
  const full_name = document.getElementById('createUserName').value.trim();
  const role = document.getElementById('createUserRole').value;
  const invite_code = document.getElementById('createUserInvite').value.trim();

  try {
    await EdgeFunctions.adminCreateUser(email, password, full_name, role, invite_code);
    Notifications.show('User created successfully.');
    closeModal();
    await renderAdmin();
  } catch (error) {
    Notifications.show(error.message, 'error');
  }
};

const openModal = (title, html) => {
  document.getElementById('globalModalTitle').textContent = title;
  document.getElementById('globalModalBody').innerHTML = html;
  document.getElementById('globalModal').classList.add('open');
};

const showModal = openModal;

const closeModal = () => {
  document.getElementById('globalModal').classList.remove('open');
};

const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('hidden');
};

const toggleSidebarCollapse = () => {
  const sidebar = document.querySelector('.sidebar');
  const shell = document.querySelector('.app-shell');
  sidebar.classList.toggle('collapsed');
  shell.classList.toggle('sidebar-collapsed');
};

const closeSidebar = () => {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.add('hidden');
};

const openSearch = () => {
  const modal = document.getElementById('searchModal');
  if (!modal) return;
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('searchInput')?.focus(), 80);
  runSearch('');
};

const closeSearch = (e) => {
  if (e && e.target !== document.getElementById('searchModal') && e.type === 'click') return;
  const modal = document.getElementById('searchModal');
  if (modal) modal.style.display = 'none';
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
};

const runSearch = (term) => {
  const results = document.getElementById('searchResults');
  if (!results) return;
  const q = (term || '').toLowerCase().trim();
  if (!q) {
    results.innerHTML = `<div class="search-empty">Type to search courses and messages…</div>`;
    return;
  }
  const matchedCourses = state.courses.filter(c => (c.name||'').toLowerCase().includes(q) || (c.code||'').toLowerCase().includes(q));
  const matchedMsgs = state.messages.filter(r => (r.room_name||'').toLowerCase().includes(q));
  if (!matchedCourses.length && !matchedMsgs.length) {
    results.innerHTML = `<div class="search-empty">No results for “${term}”</div>`;
    return;
  }
  let html = '';
  if (matchedCourses.length) {
    html += `<div class="search-section-label">Courses</div>`;
    html += matchedCourses.map((c,i) => {
      const [col] = COURSE_COLORS[i % COURSE_COLORS.length];
      return `<div class="search-result-item" onclick="closeSearch();navigate('courses')">
        <div class="search-result-icon" style="background:${col}20;color:${col}">📚</div>
        <div><div class="search-result-title">${c.name}</div><div class="search-result-sub">${c.teacher_name||'General'}</div></div>
      </div>`;
    }).join('');
  }
  if (matchedMsgs.length) {
    html += `<div class="search-section-label">Messages</div>`;
    html += matchedMsgs.map(r => `<div class="search-result-item" onclick="closeSearch();openChat('${r.id}')">
      <div class="search-result-icon" style="background:rgba(59,91,219,.1);color:var(--accent)">💬</div>
      <div><div class="search-result-title">${r.room_name}</div><div class="search-result-sub">${r.last_message||'No messages'}</div></div>
    </div>`).join('');
  }
  results.innerHTML = html;
};

// ── Notifications ──────────────────────────────────────────────────
if (!state.notifications) state.notifications = [];
if (!state.notifUnread) state.notifUnread = 0;

const addNotification = (type, title, body, date) => {
  if (!state.notifications) state.notifications = [];
  state.notifications.unshift({ id: Date.now(), type, title, body, date: date || new Date().toISOString(), unread: true });
  state.notifUnread = state.notifications.filter(n => n.unread).length;
  renderNotifDot();
};

const renderNotifDot = () => {
  const dot = document.getElementById('notifDot');
  if (!dot) return;
  if (state.notifUnread > 0) { dot.textContent = state.notifUnread > 9 ? '9+' : state.notifUnread; dot.classList.remove('hidden'); }
  else dot.classList.add('hidden');
};

const toggleNotifs = () => {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;
  const isOpen = !panel.classList.contains('hidden');
  if (isOpen) { panel.classList.add('hidden'); return; }
  // Mark all read
  state.notifications.forEach(n => n.unread = false);
  state.notifUnread = 0;
  renderNotifDot();
  // Render notifications
  const list = document.getElementById('notifList');
  const iconMap = { invite: 'invite', event: 'event', task: 'task', info: 'info', course: 'invite' };
  if (!state.notifications.length) {
    list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
  } else {
    list.innerHTML = state.notifications.slice(0,20).map(n => `
      <div class="notif-item">
        <div class="notif-icon ${iconMap[n.type]||'info'}">${n.type==='invite'||n.type==='course'?'🏃':n.type==='event'?'📅':n.type==='task'?'✅':'🔔'}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          ${n.body ? `<div class="notif-sub">${n.body}</div>` : ''}
          <div class="notif-time">${n.date ? new Date(n.date).toLocaleString([], {dateStyle:'short',timeStyle:'short'}) : ''}</div>
        </div>
      </div>`).join('');
  }
  panel.classList.remove('hidden');
  // Close on outside click
  setTimeout(() => {
    const handler = (e) => {
      if (!panel.contains(e.target) && e.target.id !== 'notifBtn') {
        panel.classList.add('hidden');
        document.removeEventListener('click', handler);
      }
    };
    document.addEventListener('click', handler);
  }, 10);
};

const clearAllNotifs = () => {
  state.notifications = [];
  state.notifUnread = 0;
  renderNotifDot();
  document.getElementById('notifList').innerHTML = '<div class="notif-empty">No notifications yet</div>';
};

const openChat = async (roomId) => {
  state.chat.currentRoomId = roomId;
  let rows = [];

  if (state.demoMode) {
    const existingMsgs = state.chat.messagesByRoom[roomId] || [];
    state.chat.messagesByRoom[roomId] = existingMsgs;
    const room = state.messages.find((entry) => entry.id === roomId);
    const roomName = room?.room_name || 'Chat';
    const bubbles = existingMsgs.length
      ? existingMsgs.map((item) => {
          const mine = item.sender_id === state.user?.id;
          return `<div class="msg-bubble-wrap ${mine ? 'mine' : 'theirs'}"><div class="msg-bubble ${mine ? 'mine' : 'theirs'}">${item.sender_name && !mine ? `<div class="msg-bubble-sender">${item.sender_name}</div>` : ''}<div>${item.content || ''}</div></div><div class="msg-bubble-time ${mine ? '' : 'theirs'}">${item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}</div></div>`;
        }).join('')
      : `<div class="dash-list-placeholder">${tr('chatNoMessagesYet', 'No messages yet')}</div>`;

    document.getElementById('msgChatArea').innerHTML = `
      <div class="msg-chat-header">${roomName}</div>
      <div class="msg-chat-messages" id="msgChatMessages">${bubbles}</div>
      <div class="msg-chat-input-wrap">
        <textarea class="msg-chat-input" id="msgComposer" placeholder="${tr('chatWriteMessage', 'Write a message...')}"></textarea>
        <button class="msg-send-btn" onclick="sendChatMessage()" title="${tr('chatSend','Send')}"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>
    `;
    return;
  }

  const msgRes = await sb
    .from('chat_messages')
    .select('id,room_id,content,created_at,sender_id,sender_name')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (!msgRes.error && msgRes.data) {
    rows = msgRes.data;
  } else {
    const fallback = await sb
      .from('messages')
      .select('id,room_id,content,created_at,sender_id,sender_name')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    rows = fallback.data || [];
  }

  state.chat.messagesByRoom[roomId] = rows;
  const room = state.messages.find((entry) => entry.id === roomId);
  const roomName = room?.room_name || 'Chat';
  const bubbles = rows.length
    ? rows.map((item) => {
        const mine = item.sender_id === state.user?.id;
        return `<div class="msg-bubble-wrap ${mine ? 'mine' : 'theirs'}"><div class="msg-bubble ${mine ? 'mine' : 'theirs'}">${item.sender_name && !mine ? `<div class="msg-bubble-sender">${item.sender_name}</div>` : ''}<div>${item.content || ''}</div></div><div class="msg-bubble-time ${mine ? '' : 'theirs'}">${item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}</div></div>`;
      }).join('')
    : '<div class="dash-list-placeholder">No messages yet. Start this conversation.</div>';

  document.getElementById('msgChatArea').innerHTML = `
    <div class="msg-chat-header">${roomName}</div>
    <div class="msg-chat-messages" id="msgChatMessages">${bubbles}</div>
    <div class="msg-chat-input-wrap">
      <textarea class="msg-chat-input" id="msgComposer" placeholder="Write a message..."></textarea>
      <button class="msg-send-btn" onclick="sendChatMessage()" title="${tr('chatSend','Send')}"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
  `;

  document.querySelectorAll('#msgRoomList .msg-room-item').forEach((node) => node.classList.remove('active'));
  const active = Array.from(document.querySelectorAll('#msgRoomList .msg-room-item')).find((node) => node.innerHTML.includes(roomName));
  if (active) active.classList.add('active');
};

const sendChatMessage = async () => {
  const roomId = state.chat.currentRoomId;
  const composer = document.getElementById('msgComposer');
  if (!roomId || !composer) return;

  const content = composer.value.trim();
  if (!content) return;

  const payload = {
    room_id: roomId,
    content,
    sender_id: state.user?.id,
    sender_name: state.profile?.full_name || state.user?.email || 'User',
  };

  if (state.demoMode) {
    const msgs = state.chat.messagesByRoom[roomId] || [];
    msgs.push({
      id: `msg-${Date.now()}`,
      room_id: roomId,
      content,
      sender_id: state.user?.id,
      sender_name: state.profile?.full_name || 'User',
      created_at: new Date().toISOString(),
    });
    state.chat.messagesByRoom[roomId] = msgs;
    composer.value = '';
    await openChat(roomId);
    return;
  }

  let inserted = false;
  const primary = await sb.from('chat_messages').insert(payload);
  if (!primary.error) inserted = true;
  if (!inserted) {
    const fallback = await sb.from('messages').insert(payload);
    if (fallback.error) {
      Notifications.show('Could not send message', 'error');
      return;
    }
  }

  composer.value = '';
  await openChat(roomId);
  await renderMessages();
};

const startNewChat = async () => {
  const roomName = prompt(tr('chatRoomNamePrompt', 'Room name'));
  if (!roomName || !roomName.trim()) return;

  if (state.demoMode) {
    const roomId = `room-${Date.now()}`;
    state.messages.unshift({
      id: roomId,
      room_name: roomName.trim(),
      last_message: '',
      updated_at: new Date().toISOString(),
    });
    state.chat.messagesByRoom[roomId] = [];
    state.chat.currentRoomId = roomId;
    await renderMessages();
    return;
  }

  let roomId = null;
  const createRoom = await sb.from('chat_rooms').insert({ name: roomName.trim() }).select('id').single();
  if (!createRoom.error && createRoom.data?.id) {
    roomId = createRoom.data.id;
  }

  if (!roomId) {
    Notifications.show('Chat room table not available. Please create chat_rooms.', 'error');
    return;
  }

  await renderMessages();
  await openChat(roomId);
};

const openFileUpload = () => {
  Notifications.show('File upload coming soon.');
};

const openCreateEvent = () => {
  const today = new Date().toISOString().slice(0,10);
  showModal('Add Calendar Event', `
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0">
      <input id="newEvTitle" placeholder="Event title" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;width:100%;box-sizing:border-box" />
      <input id="newEvDate" type="date" value="${today}" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;width:100%;box-sizing:border-box" />
      <select id="newEvType" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none;background:#fff">
        <option value="course">Course</option>
        <option value="task">Task</option>
        <option value="invite">Event</option>
      </select>
      <button class="btn btn-primary" onclick="submitCalEventFromModal()">Add</button>
    </div>
  `);
  setTimeout(() => document.getElementById('newEvTitle')?.focus(), 100);
};

const submitCalEventFromModal = () => {
  const title = (document.getElementById('newEvTitle')?.value || '').trim();
  const dateStr = document.getElementById('newEvDate')?.value;
  const type = document.getElementById('newEvType')?.value || 'course';
  if (!title || !dateStr) { Notifications.show('Fill in all fields.','warn'); return; }
  if (!state.calendarEvents) state.calendarEvents = [];
  state.calendarEvents.push({ date: dateStr, title, type });
  closeModal();
  if (state.page === 'calendar') renderCalendarGrid();
  addNotification('event', title, `Scheduled for ${dateStr}`, new Date().toISOString());
  Notifications.show('Event added to calendar!');
};

const toggleTaskDone = async (event, taskId) => {
  event.stopPropagation();
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return;
  const updatedStatus = task.status === 'done' ? 'open' : 'done';
  if (state.demoMode) {
    task.status = updatedStatus;
    renderTasks();
    return;
  }
  await sb.from('tasks').update({ status: updatedStatus }).eq('id', taskId);
  renderTasks();
};

const init = async () => {
  if (typeof ensurePagesMounted === 'function') ensurePagesMounted();
  if (FORCE_DEMO_MODE || isDemoModeEnabled()) {
    enterApp();
    return;
  }

  const { data: { session }, error } = await sb.auth.getSession();
  if (error) return Notifications.show('Auth error.');

  const remember = localStorage.getItem(AUTH_REMEMBER_KEY) !== '0';
  if (session?.user && !remember) {
    await sb.auth.signOut();
    showAuth();
    return;
  }

  if (session?.user) {
    state.user = session.user;
    await loadProfile();
    showShell();
  } else {
    showAuth();
  }
};

Object.assign(window, {
  showAuthTab,
  handleLogin,
  handleRegister,
  handleSignOut,
  setAuthMode,
  navigate,
  filterCourses,
  filterTasks,
  toggleSidebar,
  toggleSidebarCollapse,
  closeSidebar,
  openSearch,
  closeSearch,
  runSearch,
  toggleNotifs,
  clearAllNotifs,
  addNotification,
  openChat,
  startNewChat,
  sendChatMessage,
  openFileUpload,
  openCreateEvent,
  submitCalEventFromModal,
  toggleTaskDone,
  openCreateUser,
  submitCreateUser,
  closeModal,
  showModal,
  generateInviteCode,
  setStudyMode,
  setSchoolStage,
  setUniSemester,
  setExamMode,
  enterApp,
  markLearnTopic,
  resumeLearnBookmark,
  clearLearnBookmark,
  calNav,
  calGoToday,
  calDayClick,
  submitCalEvent,
  openJoinCourse,
  openCreateCourse,
  submitJoinCourse,
  submitCreateCourse,
  showCourseDetail,
});

if (window.registerPageModule) {
  window.registerPageModule('teacher-tools', () => `
    <section class="page" id="page-teacher-tools"></section>
  `);
}

window.addEventListener('DOMContentLoaded', async () => {
  window.onLanguageChanged = () => {
    setPageTitle(getPageTitle(state.page));
    loadPage(state.page);
  };

  // Close search modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sm = document.getElementById('searchModal');
      if (sm && sm.style.display !== 'none') closeSearch();
      const np = document.getElementById('notifPanel');
      if (np && !np.classList.contains('hidden')) np.classList.add('hidden');
    }
  });

  if (!localStorage.getItem('lyceon_sw_cleared')) {
    const cleared = await clearOldServiceWorker();
    if (cleared) {
      localStorage.setItem('lyceon_sw_cleared', '1');
      window.location.reload();
      return;
    }
  }

  showAuthTab('login');
  setAuthMode('student');
  init();
});

