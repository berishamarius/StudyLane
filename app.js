const state = {
  page: 'dashboard',
  user: null,
  profile: null,
  tasks: [],
  messages: [],
  notifications: [],
  courses: [],
  invites: [],
};

const showAuthTab = (tab) => {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
};

const setPageTitle = (title) => {
  document.getElementById('topbarTitle').textContent = title;
};

const navigate = (page) => {
  state.page = page;
  document.querySelectorAll('.page').forEach((section) => section.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach((link) => link.classList.toggle('active', link.dataset.page === page));
  setPageTitle(page.charAt(0).toUpperCase() + page.slice(1));
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
  updateUserChip();
  loadPage(state.page);
};

const showAuth = () => {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
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
  const loginError = document.getElementById('loginError');
  loginError.textContent = '';

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message;
    return;
  }

  await onAuthChange(data.user);
};

const handleRegister = async (event) => {
  event.preventDefault();
  const full_name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const invite_code = document.getElementById('regCode').value.trim();
  const role = document.getElementById('regRole').value;
  const regError = document.getElementById('regError');
  regError.textContent = '';

  try {
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name, role, invite_code } } });
    if (error) throw error;
    Notifications.show('Registration received. Please confirm your email if required.');
  } catch (err) {
    regError.textContent = err.message || 'Unable to register.';
  }
};

const handleSignOut = async () => {
  await sb.auth.signOut();
  state.user = null;
  state.profile = null;
  showAuth();
};

const onAuthChange = async (user) => {
  state.user = user;
  const { data: profile, error } = await sb.from('profiles').select('*').eq('id', user.id).single();
  if (error) return Notifications.show('Unable to load profile', 'error');
  state.profile = profile;
  showShell();
};

const loadProfile = async () => {
  const { data, error } = await sb.from('profiles').select('*').eq('id', state.user.id).single();
  if (!error) state.profile = data;
};

const renderDashboard = async () => {
  document.getElementById('dashGreeting').textContent = `Welcome back, ${state.profile?.full_name || 'student'}!`;
  document.getElementById('dashStats').innerHTML = `<div class="dash-stat"><span class="dash-stat-value">—</span><span class="dash-stat-label">Tasks</span></div><div class="dash-stat"><span class="dash-stat-value">—</span><span class="dash-stat-label">Messages</span></div><div class="dash-stat"><span class="dash-stat-value">—</span><span class="dash-stat-label">Courses</span></div>`;

  const dashUpcoming = document.getElementById('dashUpcoming');
  const dashTasks = document.getElementById('dashTasks');
  const dashCourses = document.getElementById('dashCourses');
  dashUpcoming.textContent = 'Loading…';
  dashTasks.textContent = 'Loading…';
  dashCourses.textContent = 'Loading…';

  const [{ data: tasks }, { data: courses }] = await Promise.all([
    sb.from('tasks').select('*').order('due_date', { ascending: true }).limit(5),
    sb.from('courses').select('*').limit(4),
  ]);

  dashUpcoming.innerHTML = tasks?.length ? tasks.slice(0, 4).map((task) => `<div class="dash-list-item"><span class="dash-dot" style="background:${task.status === 'done' ? '#22c55e' : task.status === 'overdue' ? '#ef4444' : '#7180ff'}"></span><div><div class="dash-list-title">${task.title}</div><div class="dash-list-sub">Due ${new Date(task.due_date).toLocaleDateString()}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No upcoming tasks found.</div>';
  dashTasks.innerHTML = tasks?.length ? tasks.map((task) => `<div class="dash-list-item"><span class="dash-dot" style="background:${task.status === 'done' ? '#22c55e' : '#7180ff'}"></span><div><div class="dash-list-title">${task.title}</div><div class="dash-list-sub">${task.status}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No tasks available.</div>';
  dashCourses.innerHTML = courses?.length ? courses.map((course) => `<div class="dash-list-item"><span class="dash-dot" style="background:linear-gradient(135deg,#7180ff,#7f95ff)"></span><div><div class="dash-list-title">${course.name}</div><div class="dash-list-sub">${course.teacher_name}</div></div></div>`).join('') : '<div class="dash-list-placeholder">No courses yet.</div>';
};

const renderCourses = async () => {
  const grid = document.getElementById('courseGrid');
  courseGrid.innerHTML = '<div class="dash-list-placeholder">Loading courses…</div>';
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
  const { data, error } = await sb.from('tasks').select('*').order('due_date', { ascending: false });
  if (error) return (container.innerHTML = '<div class="dash-list-placeholder">Unable to load tasks.</div>');
  state.tasks = data || [];
  container.innerHTML = state.tasks.length ? state.tasks.map((task) => `<div class="task-item ${task.status === 'overdue' ? 'overdue' : task.status === 'done' ? '' : 'due-soon'}"><div class="task-check ${task.status === 'done' ? 'checked' : ''}" onclick="toggleTaskDone(event, '${task.id}')"></div><div class="task-body"><div class="task-title">${task.title}</div><div class="task-meta"><span>${task.course_name || 'General'}</span><span>Due ${new Date(task.due_date).toLocaleDateString()}</span></div></div><div class="task-badge ${task.status === 'overdue' ? 'overdue' : task.status === 'done' ? 'submitted' : 'due-soon'}">${task.status}</div></div>`).join('') : '<div class="dash-list-placeholder">No tasks found.</div>';
};

const renderMessages = async () => {
  const list = document.getElementById('msgRoomList');
  list.innerHTML = '<div class="dash-list-placeholder">Loading chats…</div>';
  const { data, error } = await sb.from('messages').select('id,room_name,last_message,updated_at').order('updated_at', { ascending: false });
  if (error) return (list.innerHTML = '<div class="dash-list-placeholder">Unable to load chats.</div>');
  state.messages = data || [];
  if (!state.messages.length) {
    list.innerHTML = '<div class="dash-list-placeholder">No chats available.</div>';
    return;
  }
  list.innerHTML = state.messages.map((room) => `<div class="msg-room-item" onclick="openChat('${room.id}')"><div class="msg-room-avatar">${room.room_name.charAt(0).toUpperCase()}</div><div class="msg-room-info"><div class="msg-room-name">${room.room_name}</div><div class="msg-room-preview">${room.last_message || 'No messages yet'}</div></div></div>`).join('');
};

const renderFiles = async () => {
  const grid = document.getElementById('fileGrid');
  grid.innerHTML = '<div class="dash-list-placeholder">Loading files…</div>';
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) return (grid.innerHTML = '<div class="dash-list-placeholder">Unable to load files.</div>');
  grid.innerHTML = data.length ? data.map((file) => `<div class="file-item"><div class="file-icon">📄</div><div class="file-name">${file.name}</div><div class="file-size">${file.size || '—'} KB</div></div>`).join('') : '<div class="dash-list-placeholder">No files uploaded yet.</div>';
};

const renderCalendar = async () => {
  document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">Loading calendar…</div>';
  const { data, error } = await sb.from('events').select('*').order('starts_at', { ascending: true });
  if (error) return (document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">Unable to load events.</div>');
  if (!data.length) return (document.getElementById('calendarContainer').innerHTML = '<div class="dash-list-placeholder">No events scheduled.</div>');
  document.getElementById('calendarContainer').innerHTML = `<div class="dash-list-item">${data.map((event) => `<div class="dash-card"><div class="dash-card-title">${event.title}</div><div class="dash-list-sub">${new Date(event.starts_at).toLocaleDateString()} • ${event.location || 'No location'}</div></div>`).join('')}</div>`;
};

const renderGrades = async () => {
  const content = document.getElementById('gradesContent');
  content.innerHTML = '<div class="dash-list-placeholder">Loading grades…</div>';
  const { data, error } = await sb.from('grades').select('*').order('updated_at', { ascending: false });
  if (error) return (content.innerHTML = '<div class="dash-list-placeholder">Unable to load grades.</div>');
  content.innerHTML = data.length ? `<table class="grade-table"><thead><tr><th>Course</th><th>Grade</th><th>Notes</th></tr></thead><tbody>${data.map((grade) => `<tr><td>${grade.course_name}</td><td class="grade-val grade-${Math.min(6, Math.max(1, grade.value))}">${grade.value}</td><td>${grade.notes || '—'}</td></tr>`).join('')}</tbody></table>` : '<div class="dash-list-placeholder">No grades available.</div>';
};

const renderProfile = () => {
  document.getElementById('profileContent').innerHTML = `<div class="card profile-avatar-wrap"><div class="profile-avatar-large">${state.profile?.full_name?.charAt(0).toUpperCase() || '?'}</div><div class="card-title">${state.profile?.full_name || 'Profile'}</div><p class="card-sub">${state.profile?.role || ''}</p></div><div class="card"><div class="field"><label>Email</label><input class="input" disabled value="${state.user.email}" /></div><div class="field"><label>Role</label><input class="input" disabled value="${state.profile?.role || 'Member'}" /></div></div>`;
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

const openChat = (roomId) => {
  document.getElementById('msgChatArea').innerHTML = `<div class="msg-chat-header">Chat room ${roomId}</div><div class="msg-chat-messages">Messages will appear here.</div><div class="msg-chat-input-wrap"><textarea class="msg-chat-input" placeholder="Write a message..."></textarea><button class="btn btn-primary">Send</button></div>`;
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
  await sb.from('tasks').update({ status: updatedStatus }).eq('id', taskId);
  renderTasks();
};

const init = async () => {
  const { data: { session }, error } = await sb.auth.getSession();
  if (error) return Notifications.show('Auth error.');

  if (session?.user) {
    state.user = session.user;
    await loadProfile();
    showShell();
  } else {
    showAuth();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  showAuthTab('login');
  init();
});
