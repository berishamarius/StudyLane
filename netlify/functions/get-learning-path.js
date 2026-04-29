exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const mode = body.mode === 'university' ? 'university' : 'school';
    const focus = String(body.focus || '').trim();

    const schoolPlan = [
      'Start with concepts and examples',
      'Practice with guided exercises',
      'Review mistakes and summarize key rules',
      'Take a short self-check quiz'
    ];

    const universityPlan = [
      'Read core theory from trusted textbooks',
      'Solve structured problem sets',
      'Apply methods to case studies or labs',
      'Write a concise weekly summary with references'
    ];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        focus,
        steps: mode === 'university' ? universityPlan : schoolPlan,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Invalid request body' }),
    };
  }
};
