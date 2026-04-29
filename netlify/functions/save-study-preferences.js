exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const payload = {
      user_id: body.user_id || null,
      study_mode: body.study_mode === 'university' ? 'university' : 'school',
      institution: body.institution || null,
      level: body.level || null,
      updated_at: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, preferences: payload }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Invalid request body' }),
    };
  }
};
