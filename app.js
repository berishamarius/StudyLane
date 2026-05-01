const state = {
  page: 'dashboard',
  user: null,
  profile: null,
  demoMode: false,
  tasks: [],
  messages: [],
  notifications: [],
  courses: [],
  invites: [],
  ui: {
    studyMode: 'school',
    schoolStage: 'grade-9-10',
    uniSemester: 'semester-1-2',
    examMode: 'balanced',
  },
  taskFilter: 'all',
  chat: {
    currentRoomId: null,
    messagesByRoom: {},
  },
};

const UI_SETTINGS_KEY = 'lyceon_ui_settings';
const DEMO_MODE_KEY = 'lyceon_demo_mode';
const AUTH_REMEMBER_KEY = 'lyceon_remember_me';
const FORCE_DEMO_MODE = true;
const LEARN_BOOKMARKS_KEY = 'lyceon_learn_bookmarks_v1';

const DEMO_DATA = {
  tasks: [
    { id: 'd-task-1', title: 'Math worksheet: quadratic equations', status: 'open', course_name: 'Mathematics', due_date: '2026-05-02' },
    { id: 'd-task-2', title: 'Read chapter on cell respiration', status: 'open', course_name: 'Biology', due_date: '2026-05-03' },
    { id: 'd-task-3', title: 'Finish seminar abstract draft', status: 'overdue', course_name: 'Academic Writing', due_date: '2026-04-25' },
    { id: 'd-task-4', title: 'Submit lab report', status: 'done', course_name: 'Physics', due_date: '2026-04-22' },
  ],
  courses: [
    { id: 'd-course-1', name: 'Mathematics', teacher_name: 'Dr. Weber', level: 'Intermediate', description: 'Core algebra, geometry, and statistics with weekly practice.' },
    { id: 'd-course-2', name: 'Biology', teacher_name: 'Prof. Klein', level: 'Intermediate', description: 'Cell biology, genetics, and ecology with structured revision blocks.' },
    { id: 'd-course-3', name: 'Computer Science', teacher_name: 'Ms. Novak', level: 'Beginner', description: 'Programming, algorithms, and project-based learning.' },
  ],
  files: [
    { id: 'd-file-1', name: 'Semester_Plan.pdf', size: 640 },
    { id: 'd-file-2', name: 'Physics_Formula_Sheet.pdf', size: 220 },
  ],
  events: [
    { id: 'd-event-1', title: 'Mathematics Quiz', starts_at: '2026-05-05T09:00:00Z', location: 'Room A-12' },
    { id: 'd-event-2', title: 'Biology Lab', starts_at: '2026-05-07T12:00:00Z', location: 'Lab B-3' },
  ],
  schedules: [
    { id: 'd-sched-1', day: 'Monday', time: '08:00 - 09:00', subject: 'Mathematics', location: 'Room A-12', type: 'Lesson' },
    { id: 'd-sched-2', day: 'Monday', time: '09:15 - 10:00', subject: 'Biology', location: 'Lab B-3', type: 'Lab' },
    { id: 'd-sched-3', day: 'Monday', time: '10:30 - 11:15', subject: 'English Language', location: 'Room C-4', type: 'Class' },
    { id: 'd-sched-4', day: 'Monday', time: '11:30 - 12:15', subject: 'History', location: 'Room D-1', type: 'Seminar' },
    { id: 'd-sched-5', day: 'Monday', time: '13:30 - 14:15', subject: 'Computer Science', location: 'Room E-2', type: 'Project' },
  ],
  learningRooms: [
    { id: 'd-room-1', name: 'Quiet Study', description: 'A focused space for homework, revision and deep thinking.', status: 'Available', bestFor: 'Individual work' },
    { id: 'd-room-2', name: 'Homeschool Hub', description: 'A home classroom setup for parents and learners with daily routine support.', status: 'Ready', bestFor: 'Routine & family study' },
    { id: 'd-room-3', name: 'Group Room', description: 'A team space for group projects, video calls and collaborative review.', status: 'Open', bestFor: 'Project work' },
    { id: 'd-room-4', name: 'Online Tutor', description: 'A digital room for remote tutoring, exam prep and live support.', status: 'Booked', bestFor: 'Remote coaching' },
  ],
  homeschoolTips: [
    'Use a weekly timetable and block time for lessons, revision and breaks.',
    'Set up one dedicated study space with good light, clear surfaces and minimal distractions.',
    'Mix quiet solo work with short group or tutor sessions to stay motivated.',
    'Review your schedule each evening and plan the next day before you start.',
  ],
  grades: [
    { id: 'd-grade-1', course_name: 'Mathematics', value: 2, notes: 'Strong progress', updated_at: '2026-04-20' },
    { id: 'd-grade-2', course_name: 'Biology', value: 1, notes: 'Excellent practical work', updated_at: '2026-04-18' },
  ],
  chats: [
    { id: 'd-room-1', room_name: 'General Study', last_message: 'Remember to review chapters 3 and 4.', updated_at: '2026-04-30T10:00:00Z' },
    { id: 'd-room-2', room_name: 'Physics Lab Group', last_message: 'Meeting at 14:00 in Lab B-3.', updated_at: '2026-04-29T17:30:00Z' },
  ],
  chatMessages: {
    'd-room-1': [
      { id: 'd-msg-1', room_id: 'd-room-1', content: 'Hi all, today we focus on revision strategy.', created_at: '2026-04-30T08:00:00Z', sender_id: 'system', sender_name: 'Tutor' },
      { id: 'd-msg-2', room_id: 'd-room-1', content: 'Remember to review chapters 3 and 4.', created_at: '2026-04-30T10:00:00Z', sender_id: 'system', sender_name: 'Tutor' },
    ],
    'd-room-2': [
      { id: 'd-msg-3', room_id: 'd-room-2', content: 'Meeting at 14:00 in Lab B-3.', created_at: '2026-04-29T17:30:00Z', sender_id: 'system', sender_name: 'Lab Assistant' },
    ],
  },
};

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

const localizeLearnText = async (text, lang) => {
  const normalized = (lang || 'en').toLowerCase();
  if (normalized.startsWith('en')) return text;
  if (typeof window.translateText !== 'function') return text;
  return window.translateText(text, normalized);
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
    }
  } catch (_) {
    state.ui.studyMode = 'school';
    state.ui.schoolStage = 'grade-9-10';
    state.ui.uniSemester = 'semester-1-2';
    state.ui.examMode = 'balanced';
  }
};

const saveUiSettings = () => {
  localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(state.ui));
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
  document.getElementById('dashGreeting').textContent = `${tr('dashWelcome', 'Welcome back')}, ${state.profile?.full_name || tr('student', 'student')}!`;
  const scheduleCount = 0;
  const roomCount = 0;
  const taskCount = 0;
  const courseCount = 0;
  document.getElementById('dashStats').innerHTML = `
    <div class="dash-stat"><span class="dash-stat-value">${taskCount}</span><span class="dash-stat-label">${tr('dashStatTasks','Open tasks')}</span></div>
    <div class="dash-stat"><span class="dash-stat-value">${scheduleCount}</span><span class="dash-stat-label">${tr('dashStatLessons',"Today's lessons")}</span></div>
    <div class="dash-stat"><span class="dash-stat-value">${roomCount}</span><span class="dash-stat-label">${tr('dashStatRooms','Learning rooms')}</span></div>
    <div class="dash-stat"><span class="dash-stat-value">${courseCount}</span><span class="dash-stat-label">${tr('dashStatCourses','Courses')}</span></div>
  `;

  const dashSchedule = document.getElementById('dashSchedule');
  const dashRooms = document.getElementById('dashRooms');
  const dashUpcoming = document.getElementById('dashUpcoming');
  const dashTasks = document.getElementById('dashTasks');
  const dashHomeschool = document.getElementById('dashHomeschool');
  dashSchedule.textContent = 'Loading…';
  dashRooms.textContent = 'Loading…';
  dashUpcoming.textContent = 'Loading…';
  dashTasks.textContent = 'Loading…';
  dashHomeschool.textContent = 'Loading…';

  if (state.demoMode) {
    dashSchedule.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoSchedule','No classes scheduled yet.')}</div>`;
    dashRooms.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoRooms','No learning rooms available.')}</div>`;
    dashUpcoming.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoUpcoming','No upcoming tasks.')}</div>`;
    dashTasks.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoTasks','No tasks yet.')}</div>`;
    dashHomeschool.innerHTML = `<div class="dash-list-placeholder">${tr('dashNoHomeschool','Set up a routine in Learn to get guidance here.')}</div>`;
    return;
  }

  const { data: tasks } = await sb.from('tasks').select('*').order('due_date', { ascending: true }).limit(5);

  dashUpcoming.innerHTML = tasks?.length ? tasks.slice(0, 4).map((task) => `<div class="dash-list-item"><span class="dash-dot" style="background:${task.status === 'done' ? '#22c55e' : task.status === 'overdue' ? '#ef4444' : '#7180ff'}"></span><div><div class="dash-list-title">${task.title}</div><div class="dash-list-sub">Due ${new Date(task.due_date).toLocaleDateString()}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No upcoming tasks found.</div>';
  dashTasks.innerHTML = tasks?.length ? tasks.map((task) => `<div class="dash-list-item"><span class="dash-dot" style="background:${task.status === 'done' ? '#22c55e' : '#7180ff'}"></span><div><div class="dash-list-title">${task.title}</div><div class="dash-list-sub">${task.status}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No tasks available.</div>';
  dashSchedule.innerHTML = '<div class="dash-list-placeholder">Your schedule is not available yet.</div>';
  dashRooms.innerHTML = '<div class="dash-list-placeholder">Learning rooms will appear here once you add them.</div>';
  dashHomeschool.innerHTML = '<div class="dash-list-placeholder">Add a homeschooling routine in Learn to get helpful guidance.</div>';
};

const renderCourses = async () => {
  const grid = document.getElementById('courseGrid');
  grid.innerHTML = '<div class="dash-list-placeholder">Loading courses…</div>';
  if (state.demoMode) {
    state.courses = [];
    grid.innerHTML = '<div class="dash-list-placeholder">No courses yet.</div>';
    return;
  }
  const { data, error } = await sb.from('courses').select('*').order('name', { ascending: true });
  if (error) return (grid.innerHTML = '<div class="dash-list-placeholder">Unable to load courses.</div>');
  state.courses = data;
  if (!data.length) {
    grid.innerHTML = '<div class="dash-list-placeholder">No courses found.</div>';
    return;
  }
  grid.innerHTML = data.map((course) => `<div class="course-card" onclick="showCourseDetail('${course.id}')"><div class="course-card-banner"></div><div class="course-card-body"><div class="course-card-name">${course.name}</div><div class="course-card-teacher">${course.teacher_name}</div><div class="course-card-chips"><span class="chip">${course.level || 'General'}</span></div></div></div>`).join('');
};

const showCourseDetail = async (courseId) => {
  const course = state.courses.find((c) => c.id === courseId);
  if (!course) return;
  navigate('course-detail');
  document.getElementById('courseDetailContent').innerHTML = `<div class="card"><div class="card-title">${course.name}</div><div class="card-sub">Instructor: ${course.teacher_name}</div><p>${course.description || 'No description available for this course.'}</p></div>`;
};

const filterCourses = () => {
  const term = document.getElementById('courseSearch').value.toLowerCase();
  const filtered = state.courses.filter((course) => course.name.toLowerCase().includes(term) || course.teacher_name.toLowerCase().includes(term));
  document.getElementById('courseGrid').innerHTML = filtered.length ? filtered.map((course) => `<div class="course-card" onclick="showCourseDetail('${course.id}')"><div class="course-card-banner"></div><div class="course-card-body"><div class="course-card-name">${course.name}</div><div class="course-card-teacher">${course.teacher_name}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No matching courses.</div>';
};

const renderTasks = async () => {
  const container = document.getElementById('taskList');
  container.innerHTML = '<div class="dash-list-placeholder">Loading tasks…</div>';
  if (state.demoMode) {
    state.tasks = [];
    filterTasks(state.taskFilter || 'all');
    return;
  }
  const { data, error } = await sb.from('tasks').select('*').order('due_date', { ascending: false });
  if (error) return (container.innerHTML = '<div class="dash-list-placeholder">Unable to load tasks.</div>');
  state.tasks = data || [];
  filterTasks(state.taskFilter || 'all');
};

const renderMessages = async () => {
  const list = document.getElementById('msgRoomList');
  list.innerHTML = `<div class="dash-list-placeholder">${tr('chatLoading', 'Loading chats...')}</div>`;
  if (state.demoMode) {
    list.innerHTML = state.messages.length
      ? state.messages.map((room) => `<div class="msg-room-item ${state.chat.currentRoomId === room.id ? 'active' : ''}" onclick="openChat('${room.id}')"><div class="msg-room-avatar">${(room.room_name || 'R').charAt(0).toUpperCase()}</div><div class="msg-room-info"><div class="msg-room-name">${room.room_name || tr('chatRoom', 'Room')}</div><div class="msg-room-preview">${room.last_message || tr('chatNoMessagesYet', 'No messages yet')}</div></div></div>`).join('')
      : `<div class="dash-list-placeholder">${tr('chatNoRooms', 'No chats available.')}</div>`;
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
  grid.innerHTML = '<div class="dash-list-placeholder">Loading files…</div>';
  if (state.demoMode) {
    grid.innerHTML = '<div class="dash-list-placeholder">No files uploaded yet.</div>';
    return;
  }
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) return (grid.innerHTML = '<div class="dash-list-placeholder">Unable to load files.</div>');
  grid.innerHTML = data.length ? data.map((file) => `<div class="file-item"><div class="file-icon">📄</div><div class="file-name">${file.name}</div><div class="file-size">${file.size || '—'} KB</div></div>`).join('') : '<div class="dash-list-placeholder">No files uploaded yet.</div>';
};

const renderCalendar = async () => {
  document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">Loading calendar…</div>';
  if (state.demoMode) {
    document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">No events scheduled.</div>';
    return;
  }
  const { data, error } = await sb.from('events').select('*').order('starts_at', { ascending: true });
  if (error) return (document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">Unable to load events.</div>');
  if (!data.length) return (document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">No events scheduled.</div>');
  document.getElementById('calendarContainer').innerHTML = `<div class="dash-list-item">${data.map((event) => `<div class="dash-card"><div class="dash-card-title">${event.title}</div><div class="dash-list-sub">${new Date(event.starts_at).toLocaleDateString()} • ${event.location || 'No location'}</div></div>`).join('')}</div>`;
};

const renderGrades = async () => {
  const content = document.getElementById('gradesContent');
  content.innerHTML = '<div class="dash-list-placeholder">Loading grades…</div>';
  if (state.demoMode) {
    content.innerHTML = '<div class="dash-list-placeholder">No grades available.</div>';
    return;
  }
  const { data, error } = await sb.from('grades').select('*').order('updated_at', { ascending: false });
  if (error) return (content.innerHTML = '<div class="dash-list-placeholder">Unable to load grades.</div>');
  content.innerHTML = data.length ? `<table class="grade-table"><thead><tr><th>Course</th><th>Grade</th><th>Notes</th></tr></thead><tbody>${data.map((grade) => `<tr><td>${grade.course_name}</td><td class="grade-val grade-${Math.min(6, Math.max(1, grade.value))}">${grade.value}</td><td>${grade.notes || '—'}</td></tr>`).join('')}</tbody></table>` : '<div class="dash-list-placeholder">No grades available.</div>';
};

const renderLearn = async () => {
  const container = document.getElementById('learnContent');
  if (!container) return;

  const mode = state.ui.studyMode;
  const activeLang = getActiveLanguage();
  const model = window.LEARN_SOURCES || { core: {}, school: [], university: [] };
  const subjects = model[mode] || [];

  if (!subjects.length) {
    container.innerHTML = `<div class="dash-list-placeholder">${tr('learnEmpty','No content available.')}</div>`;
    return;
  }

  const SUBJECT_META = {
    mathematics:          { icon: '📐', color: '#e8a020' },
    physics:              { icon: '⚛️',  color: '#4a90d9' },
    chemistry:            { icon: '⚗️',  color: '#9b59b6' },
    biology:              { icon: '🌿', color: '#27ae60' },
    'computer-science':   { icon: '💻', color: '#2980b9' },
    'language-arts':      { icon: '📝', color: '#e67e22' },
    'english-language':   { icon: '🇬🇧', color: '#c0392b' },
    'german-language':    { icon: '🇩🇪', color: '#f39c12' },
    'french-language':    { icon: '🇫🇷', color: '#2980b9' },
    'spanish-language':   { icon: '🇪🇸', color: '#c0392b' },
    history:              { icon: '📜', color: '#8e6b3e' },
    geography:            { icon: '🌍', color: '#16a085' },
    civics:               { icon: '🏛️',  color: '#2c3e50' },
    economics:            { icon: '📊', color: '#2c3e50' },
    'earth-science':      { icon: '🌎', color: '#16a085' },
    arts:                 { icon: '🎨', color: '#c0392b' },
    health:               { icon: '💚', color: '#27ae60' },
    'religion-and-ethics':{ icon: '⚖️',  color: '#7f8c8d' },
    music:                { icon: '🎵', color: '#8e44ad' },
    'physical-education': { icon: '🏃', color: '#2ecc71' },
    'technology-and-design': { icon: '🔧', color: '#34495e' },
    'media-literacy':     { icon: '📱', color: '#3498db' },
  };
  const getMeta = (id) => SUBJECT_META[id] || { icon: '📚', color: 'var(--accent2)' };

  // Ensure a subject is selected
  if (!state.ui.learnSelectedSubject || !subjects.find(s => s.id === state.ui.learnSelectedSubject)) {
    state.ui.learnSelectedSubject = subjects[0].id;
  }
  const selId = state.ui.learnSelectedSubject;
  const subject = subjects.find(s => s.id === selId) || subjects[0];
  const meta = getMeta(subject.id);

  // Translate subject title for the panel header
  const subjectTitle = await localizeLearnText(subject.title, activeLang);

  // Subject pills — show native English titles for speed (language switching retranslates on next render)
  const pillsHtml = subjects.map(s => {
    const m = getMeta(s.id);
    const active = s.id === selId;
    return `<button class="learn-pill${active ? ' active' : ''}"
      onclick="selectLearnSubject('${s.id}')"
      style="${active ? `background:${m.color};color:#fff;border-color:${m.color}` : `border-color:${m.color}40`}">
      <span style="font-size:16px;line-height:1">${m.icon}</span>
      <span>${s.title}</span>
    </button>`;
  }).join('');

  // Translate all folder content in parallel
  const localizedFolders = await Promise.all((subject.folders || []).map(async (folder) => {
    const [name, description, miniTask] = await Promise.all([
      localizeLearnText(folder.name, activeLang),
      localizeLearnText(folder.description || '', activeLang),
      localizeLearnText(folder.miniTask || '', activeLang)
    ]);
    const keyPoints = folder.keyPoints
      ? await Promise.all(folder.keyPoints.map(kp => localizeLearnText(kp, activeLang)))
      : [];
    const topics = folder.topics
      ? await Promise.all(folder.topics.map(t => localizeLearnText(t, activeLang)))
      : [];
    const sourceNames = (model.core[folder.sourceGroup] || []).join(', ');
    return { ...folder, name, description, miniTask, keyPoints, topics, sourceNames };
  }));

  // Build folder cards
  const foldersHtml = localizedFolders.map((folder, fi) => {
    const kpHtml = folder.keyPoints.length
      ? `<ul class="learn-key-points">${folder.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>`
      : '';
    const topicsHtml = folder.topics.length
      ? `<div class="learn-topics-row">${folder.topics.map(t => `<span class="learn-topic-chip">${t}</span>`).join('')}</div>`
      : '';
    const miniTaskHtml = folder.miniTask
      ? `<div class="learn-mini-task"><strong>${tr('learnTopicTask','Practice task')}:</strong> ${folder.miniTask}</div>`
      : '';
    const sourcesHtml = folder.sourceNames
      ? `<p class="learn-sources-line">${tr('learnTopicSources','Sources')}: ${folder.sourceNames}</p>`
      : '';
    return `
      <details class="learn-folder-card" ${fi === 0 ? 'open' : ''}>
        <summary class="learn-folder-header">
          <span class="learn-folder-num">${fi + 1}</span>
          <span>${folder.name}</span>
        </summary>
        <div class="learn-folder-body">
          ${folder.description ? `<p class="learn-folder-desc">${folder.description}</p>` : ''}
          ${kpHtml}
          ${topicsHtml}
          ${miniTaskHtml}
          ${sourcesHtml}
        </div>
      </details>`;
  }).join('');

  container.innerHTML = `
    <div class="learn-wrap">
      <div class="learn-mode-bar">
        <span>${tr('studyMode','Mode')}: <strong>${mode === 'school' ? tr('studyModeSchool','School') : tr('studyModeUniversity','University')}</strong></span>
      </div>
      <div class="learn-subjects-pills">${pillsHtml}</div>
      <div class="learn-subject-panel">
        <div class="learn-subject-panel-header" style="border-left:4px solid ${meta.color}">
          <span style="font-size:28px;line-height:1">${meta.icon}</span>
          <span class="learn-subject-panel-title">${subjectTitle}</span>
        </div>
        <div class="learn-folder-list">${foldersHtml}</div>
      </div>
    </div>`;
};

window.selectLearnSubject = (id) => {
  state.ui.learnSelectedSubject = id;
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
  container.innerHTML = `
    <div class="card" style="max-width:860px">
      <div class="card-title">${tr('studyModeTitle', 'Study mode')}</div>
      <p class="card-sub" style="margin-bottom:14px">${tr('studyModeDescription', 'Choose whether your learning layout is optimized for school or university.')}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
        <button class="btn ${isSchool ? 'btn-primary' : 'btn-secondary'}" onclick="setStudyMode('school')">${tr('studyModeSchool', 'School')}</button>
        <button class="btn ${!isSchool ? 'btn-primary' : 'btn-secondary'}" onclick="setStudyMode('university')">${tr('studyModeUniversity', 'University')}</button>
      </div>
      <div class="field" style="margin-top:10px">
        <label>${tr('studySchoolStage', 'School stage')}</label>
        <select class="select" onchange="setSchoolStage(this.value)">
          <option value="grade-5-6" ${state.ui.schoolStage === 'grade-5-6' ? 'selected' : ''}>${tr('learnSchoolStage56', 'School stage: Grade 5-6')}</option>
          <option value="grade-7-8" ${state.ui.schoolStage === 'grade-7-8' ? 'selected' : ''}>${tr('learnSchoolStage78', 'School stage: Grade 7-8')}</option>
          <option value="grade-9-10" ${state.ui.schoolStage === 'grade-9-10' ? 'selected' : ''}>${tr('learnSchoolStage910', 'School stage: Grade 9-10')}</option>
          <option value="grade-11-13" ${state.ui.schoolStage === 'grade-11-13' ? 'selected' : ''}>${tr('learnSchoolStage1113', 'School stage: Grade 11-13')}</option>
        </select>
      </div>
      <div class="field" style="margin-top:10px">
        <label>${tr('studyUniSemester', 'University semester range')}</label>
        <select class="select" onchange="setUniSemester(this.value)">
          <option value="semester-1-2" ${state.ui.uniSemester === 'semester-1-2' ? 'selected' : ''}>${tr('learnUniSem12', 'University stage: Semester 1-2')}</option>
          <option value="semester-3-4" ${state.ui.uniSemester === 'semester-3-4' ? 'selected' : ''}>${tr('learnUniSem34', 'University stage: Semester 3-4')}</option>
          <option value="semester-5-6" ${state.ui.uniSemester === 'semester-5-6' ? 'selected' : ''}>${tr('learnUniSem56', 'University stage: Semester 5-6')}</option>
          <option value="semester-7-plus" ${state.ui.uniSemester === 'semester-7-plus' ? 'selected' : ''}>${tr('learnUniSem7Plus', 'University stage: Semester 7+')}</option>
        </select>
      </div>
      <div class="field" style="margin-top:10px">
        <label>${tr('studyExamMode', 'Practice focus')}</label>
        <select class="select" onchange="setExamMode(this.value)">
          <option value="basics" ${state.ui.examMode === 'basics' ? 'selected' : ''}>${tr('studyExamModeBasics', 'Basics first')}</option>
          <option value="balanced" ${state.ui.examMode === 'balanced' ? 'selected' : ''}>${tr('studyExamModeBalanced', 'Balanced')}</option>
          <option value="exam" ${state.ui.examMode === 'exam' ? 'selected' : ''}>${tr('studyExamModeExam', 'Exam prep')}</option>
        </select>
      </div>
      <div class="card-sub">${tr('studyModeCurrent', 'Current mode')}: <strong style="color:var(--text)">${isSchool ? tr('studyModeSchool', 'School') : tr('studyModeUniversity', 'University')}</strong></div>
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

const filterTasks = (filter, button) => {
  state.taskFilter = filter;
  const chips = Array.from(document.querySelectorAll('#page-tasks .filter-chip'));
  chips.forEach((chip) => chip.classList.remove('active'));
  if (button) {
    button.classList.add('active');
  } else {
    const match = chips.find((chip) => chip.textContent.trim().toLowerCase() === filter.toLowerCase());
    if (match) match.classList.add('active');
  }

  const filtered = (state.tasks || []).filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'done') return task.status === 'done';
    if (filter === 'open') return task.status !== 'done';
    if (filter === 'overdue') return task.status === 'overdue';
    return true;
  });

  const container = document.getElementById('taskList');
  if (!container) return;
  container.innerHTML = filtered.length
    ? filtered.map((task) => `<div class="task-item ${task.status === 'overdue' ? 'overdue' : task.status === 'done' ? '' : 'due-soon'}"><div class="task-check ${task.status === 'done' ? 'checked' : ''}" onclick="toggleTaskDone(event, '${task.id}')"></div><div class="task-body"><div class="task-title">${task.title}</div><div class="task-meta"><span>${task.course_name || 'General'}</span><span>Due ${new Date(task.due_date).toLocaleDateString()}</span></div></div><div class="task-badge ${task.status === 'overdue' ? 'overdue' : task.status === 'done' ? 'submitted' : 'due-soon'}">${task.status}</div></div>`).join('')
    : '<div class="dash-list-placeholder">No tasks in this filter.</div>';
};

const renderProfile = () => {
  document.getElementById('profileContent').innerHTML = `<div class="card profile-avatar-wrap"><div class="profile-avatar-large">${state.profile?.full_name?.charAt(0).toUpperCase() || '?'}</div><div class="card-title">${state.profile?.full_name || 'Profile'}</div><p class="card-sub">${state.profile?.role || ''}</p></div><div class="card"><div class="field"><label>Email</label><input class="input" disabled value="${state.user.email}" /></div><div class="field"><label>Role</label><input class="input" disabled value="${state.profile?.role || 'Member'}" /></div></div>`;
};

const renderTeacherTools = () => {
  const container = document.getElementById('page-teacher-tools');
  if (!container) return;
  container.innerHTML = `
      <div class="page-header"><div><h1>Teacher tools</h1><p class="card-sub">Manage class access, lock student modes and distribute study content without giving students lecturer rights.</p></div></div>
      <div class="card"><div class="field"><label>Class control</label><p class="card-sub">Lock student switching between school and university mode and keep the class focused on the current curriculum.</p></div><button class="btn btn-secondary" onclick="Notifications.show('Class mode locked for students.')">Lock student mode</button></div>
      <div class="card"><div class="field"><label>Share study material</label><p class="card-sub">Publish assignments or quick revision notes for your class.</p></div><button class="btn btn-primary" onclick="Notifications.show('Study materials shared with class.')">Share a new resource</button></div>
  `;
};

const renderAdmin = async () => {
  const container = document.getElementById('adminUserList');
  container.innerHTML = '<div class="dash-list-placeholder">Loading users…</div>';
  const { data, error } = await sb.from('profiles').select('*').order('full_name', { ascending: true });
  if (error) return (container.innerHTML = '<div class="dash-list-placeholder">Unable to load users.</div>');
  container.innerHTML = `<table class="user-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>${data.map((profile) => `<tr><td>${profile.full_name}</td><td>${profile.email}</td><td><span class="role-badge ${profile.role}">${profile.role}</span></td></tr>`).join('')}</tbody></table>`;
};

const renderInvites = async () => {
  const container = document.getElementById('inviteList');
  container.innerHTML = '<div class="dash-list-placeholder">Loading invite codes…</div>';
  const { data, error } = await sb.from('invite_codes').select('*').order('created_at', { ascending: false });
  if (error) return (container.innerHTML = '<div class="dash-list-placeholder">Unable to load invites.</div>');
  container.innerHTML = data.length ? `<div class="invite-grid">${data.map((invite) => `<div class="invite-card ${invite.used_at ? 'invite-used' : ''}"><div class="invite-code">${invite.code}</div><div class="invite-meta">Role: ${invite.role}</div><div class="invite-meta">Created: ${new Date(invite.created_at).toLocaleDateString()}</div></div>`).join('')}</div>` : '<div class="dash-list-placeholder">No invite codes yet.</div>';
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
  Notifications.show('Search is coming soon.');
};

const toggleNotifs = () => {
  Notifications.show('Notifications panel not implemented yet.');
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
  Notifications.show('File upload functionality is coming soon.');
};

const openCreateEvent = () => {
  Notifications.show('Event creation coming soon.');
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
    state.demoMode = true;
    state.user = { id: 'demo-user', email: 'demo@lyceon.local' };
    state.profile = { id: 'demo-user', full_name: 'Demo User', role: 'student' };
    localStorage.setItem(DEMO_MODE_KEY, '1');
    showShell();
    Notifications.show(tr('demoModeEnabled', 'Demo mode enabled. Authentication is bypassed for testing.'));
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
  toggleNotifs,
  openChat,
  startNewChat,
  sendChatMessage,
  openFileUpload,
  openCreateEvent,
  toggleTaskDone,
  openCreateUser,
  submitCreateUser,
  closeModal,
  generateInviteCode,
  setStudyMode,
  setSchoolStage,
  setUniSemester,
  setExamMode,
  enterApp,
  markLearnTopic,
  resumeLearnBookmark,
  clearLearnBookmark,
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
