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

  // Only admins may generate invite codes
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

  const role = VALID_ROLES.has(body.role as string) ? (body.role as string) : 'student';
  // Crypto-safe random code
  const randomBytes = crypto.getRandomValues(new Uint8Array(4));
  const code = `INV-${Array.from(randomBytes).map((b) => b.toString(36)).join('').toUpperCase().slice(0, 6)}`;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('invite_codes').insert([{ code, role, created_by: caller.id }]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ code, role }), {
    status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
