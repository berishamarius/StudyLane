/* ═══════════════════════════════════════════════════════════
   supabase.js  –  StudyLane
   Supabase client, auth helpers, DB helpers
   ═══════════════════════════════════════════════════════════ */

// ── Config ─────────────────────────────────────────────────
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Load Supabase JS v2 from CDN (injected in index.html)
const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth ────────────────────────────────────────────────────
const Auth = {
  async signUp(email, password, meta = {}) {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: meta },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await sb.auth.signOut();
  },

  async session() {
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  async user() {
    const { data } = await sb.auth.getUser();
    return data.user;
  },

  onAuthChange(cb) {
    return sb.auth.onAuthStateChange((_event, session) => cb(session));
  },
};

// ── Invite / School Codes ───────────────────────────────────
const Invites = {
  async validate(code) {
    const { data, error } = await sb
      .from('invite_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('used', false)
      .single();
    if (error || !data) throw new Error('Invalid or already used code');
    return data;
  },

  async consume(code, userId) {
    const { error } = await sb
      .from('invite_codes')
      .update({ used: true, used_by: userId, used_at: new Date().toISOString() })
      .eq('code', code.trim().toUpperCase());
    if (error) throw error;
  },
};

// ── Profiles ────────────────────────────────────────────────
const Profiles = {
  async get(userId) {
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async update(userId, patch) {
    const { error } = await sb
      .from('profiles')
      .update(patch)
      .eq('id', userId);
    if (error) throw error;
  },
};

// ── Courses / Classes ───────────────────────────────────────
const Courses = {
  async list() {
    const { data, error } = await sb
      .from('courses')
      .select('*, course_members(count)')
      .order('name');
    if (error) throw error;
    return data;
  },

  async get(id) {
    const { data, error } = await sb
      .from('courses')
      .select('*, course_members(user_id, role, profiles(full_name, avatar_url))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async join(courseId, userId) {
    const { error } = await sb
      .from('course_members')
      .insert({ course_id: courseId, user_id: userId, role: 'student' });
    if (error) throw error;
  },

  async myList(userId) {
    const { data, error } = await sb
      .from('course_members')
      .select('course_id, role, courses(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map(d => ({ ...d.courses, my_role: d.role }));
  },
};

// ── Tasks / Assignments ─────────────────────────────────────
const Tasks = {
  async list(courseId) {
    const { data, error } = await sb
      .from('tasks')
      .select('*, submissions(count)')
      .eq('course_id', courseId)
      .order('due_at');
    if (error) throw error;
    return data;
  },

  async myTasks(userId) {
    const { data, error } = await sb
      .from('task_assignments')
      .select('*, tasks(*, courses(name, color))')
      .eq('user_id', userId)
      .order('tasks(due_at)');
    if (error) throw error;
    return data;
  },

  async submit(taskId, userId, fileUrl, text) {
    const { error } = await sb
      .from('submissions')
      .upsert({ task_id: taskId, user_id: userId, file_url: fileUrl, text, submitted_at: new Date().toISOString() });
    if (error) throw error;
  },
};

// ── Messages ────────────────────────────────────────────────
const Messages = {
  async list(roomId, limit = 50) {
    const { data, error } = await sb
      .from('messages')
      .select('*, profiles(full_name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.reverse();
  },

  async send(roomId, userId, body) {
    const { error } = await sb
      .from('messages')
      .insert({ room_id: roomId, user_id: userId, body });
    if (error) throw error;
  },

  subscribe(roomId, cb) {
    return sb
      .channel('messages:' + roomId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, payload => cb(payload.new))
      .subscribe();
  },
};

// ── Files ───────────────────────────────────────────────────
const Files = {
  async upload(bucket, path, file) {
    const { data, error } = await sb.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return sb.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
  },

  async list(bucket, folder) {
    const { data, error } = await sb.storage.from(bucket).list(folder);
    if (error) throw error;
    return data;
  },

  getUrl(bucket, path) {
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
};

// ── Calendar ────────────────────────────────────────────────
const Calendar = {
  async upcoming(userId, limit = 20) {
    const { data, error } = await sb
      .from('events')
      .select('*, courses(name, color)')
      .or(`is_global.eq.true,course_id.in.(select course_id from course_members where user_id=${userId})`)
      .gte('start_at', new Date().toISOString())
      .order('start_at')
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async create(event) {
    const { error } = await sb.from('events').insert(event);
    if (error) throw error;
  },
};
