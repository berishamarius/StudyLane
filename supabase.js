const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true },
});

const EdgeFunctions = {
  generateInvite: async (role) => {
    const response = await fetch('/.netlify/functions/generate-invite', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create invite');
    }
    return response.json();
  },

  adminCreateUser: async (email, password, full_name, role, invite_code) => {
    const response = await fetch('/.netlify/functions/admin-create-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, role, invite_code }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create user');
    }
    return response.json();
  },

  sendNotification: async (payload) => {
    const response = await fetch('/.netlify/functions/send-notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to send notification');
    }
    return response.json();
  },

  getLearningPath: async (mode, focus) => {
    const response = await fetch('/.netlify/functions/get-learning-path', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, focus }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create learning path');
    }
    return response.json();
  },

  saveStudyPreferences: async (payload) => {
    const response = await fetch('/.netlify/functions/save-study-preferences', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to save study preferences');
    }
    return response.json();
  },

  listTrustedSources: async () => {
    const response = await fetch('/.netlify/functions/list-trusted-sources');
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to load trusted sources');
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
