import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_ROLES = new Set(['student', 'teacher', 'admin']);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Verify caller is an admin via their JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
  const callerClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user: caller } } = await callerClient.auth.getUser();
  if (!caller || caller.user_metadata?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
      status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const { email, password, full_name, invite_code } = body as Record<string, string>;
  const role = VALID_ROLES.has(body.role as string) ? (body.role as string) : 'student';

  if (!email || !password || !full_name) {
    return new Response(JSON.stringify({ error: 'email, password and full_name are required' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });

  if (signUpError || !data.user) {
    return new Response(JSON.stringify({ error: signUpError?.message ?? 'User creation failed' }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Profile is auto-created by DB trigger; only upsert to ensure correctness
  const profile = { id: data.user.id, email, full_name, role, created_at: new Date().toISOString() };
  const { error: dbError } = await supabase.from('profiles').upsert([profile]);

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (invite_code) {
    await supabase
      .from('invite_codes')
      .update({ used_at: new Date().toISOString(), used_by: data.user.id })
      .eq('code', invite_code);
  }

  return new Response(JSON.stringify({ user: profile }), {
    status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
