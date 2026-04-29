exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sources = [
    { title: 'OpenStax', url: 'https://openstax.org/' },
    { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/' },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org/' },
    { title: 'NCBI Bookshelf', url: 'https://www.ncbi.nlm.nih.gov/books/' },
    { title: 'World Health Organization', url: 'https://www.who.int/' },
    { title: 'Cornell Legal Information Institute', url: 'https://www.law.cornell.edu/' },
    { title: 'OECD Education', url: 'https://www.oecd.org/education/' },
    { title: 'UNESCO', url: 'https://www.unesco.org/' }
  ];

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sources }),
  };
};
