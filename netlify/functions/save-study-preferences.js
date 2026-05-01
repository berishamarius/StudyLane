const { createClient } = require('@supabase/supabase-js');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Supabase not configured' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  // Validate caller identity via Bearer token
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  let userId = body.user_id || null;
  if (authHeader.startsWith('Bearer ')) {
    const callerClient = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || '');
    const { data: { user } } = await callerClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (user?.id) userId = user.id;
  }

  if (!userId) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized: user_id could not be determined' }),
    };
  }

  const payload = {
    user_id: userId,
    study_mode: body.study_mode === 'university' ? 'university' : 'school',
    institution: body.institution ? String(body.institution).slice(0, 255) : null,
    level: body.level ? String(body.level).slice(0, 100) : null,
    updated_at: new Date().toISOString(),
  };

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase
    .from('study_preferences')
    .upsert([payload], { onConflict: 'user_id' });

  if (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, preferences: payload }),
  };
};
