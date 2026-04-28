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

  const body = await req.json();
  const role = body.role || 'student';
  const code = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('invite_codes').insert([{ code, role }]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ code, role }), { status: 200 });
});
