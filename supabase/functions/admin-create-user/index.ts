import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseKey) {
    return new Response('Supabase not configured', { status: 500 });
  }

  const { email, password, full_name, role = 'student', invite_code } = await req.json();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name, role },
  });

  if (signUpError) {
    return new Response(JSON.stringify({ error: signUpError.message }), { status: 500 });
  }

  const profile = { id: user.id, email, full_name, role, created_at: new Date().toISOString() };
  const { error: dbError } = await supabase.from('profiles').insert([profile]);

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
  }

  if (invite_code) {
    await supabase.from('invite_codes').update({ used_at: new Date().toISOString() }).eq('code', invite_code);
  }

  return new Response(JSON.stringify({ user: profile }), { status: 200 });
});
