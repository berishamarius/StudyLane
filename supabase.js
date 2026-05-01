const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true },
});

// Helper: invoke a Supabase Edge Function with the current user's auth token
const _invokeEdge = async (functionName, body) => {
  const { data: { session } } = await sb.auth.getSession();
  const headers = { 'Content-Type': 'application/json' };
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Edge function ${functionName} failed`);
  }
  return response.json();
};

const EdgeFunctions = {
  // --- Supabase Edge Functions (require auth, run server-side with service role) ---
  generateInvite: (role) => _invokeEdge('generate-invite', { role }),

  adminCreateUser: (email, password, full_name, role, invite_code) =>
    _invokeEdge('admin-create-user', { email, password, full_name, role, invite_code }),

  sendNotification: (payload) => _invokeEdge('send-notification', payload),

  // --- Netlify Functions (stateless, public/semi-public helpers) ---
  getLearningPath: async (mode, focus) => {
    const response = await fetch('/.netlify/functions/get-learning-path', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, focus }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to create learning path');
    }
    return response.json();
  },

  saveStudyPreferences: async (payload) => {
    const { data: { session } } = await sb.auth.getSession();
    const response = await fetch('/.netlify/functions/save-study-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ ...payload, user_id: session?.user?.id ?? payload.user_id }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to save study preferences');
    }
    return response.json();
  },

  listTrustedSources: async () => {
    const response = await fetch('/.netlify/functions/list-trusted-sources');
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to load trusted sources');
    }
    return response.json();
  },
};

const Notifications = {
  show: (message, type = 'info') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => toast.className = 'toast', 3200);
  },
};

const Session = {
  getUser: () => sb.auth.getSession().then(({ data }) => data.session?.user),
  signOut: async () => sb.auth.signOut(),
};
