const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

// Fix stat labels
c = c.replace(
  /(<span class="dash-stat-label">)Open Tasks(<\/span>)/,
  '$1${tr(\'dashStatTasks\',\'Open tasks\')}$2'
);
c = c.replace(
  /(<span class="dash-stat-label">)Today's lessons(<\/span>)/,
  '$1${tr(\'dashStatLessons\',\'Today\\\'s lessons\')}$2'
);
c = c.replace(
  /(<span class="dash-stat-label">)Learning rooms(<\/span>)/,
  (m, p1, offset) => {
    // Only replace the first one (in dashStats, not dashRooms)
    return p1 + "${tr('dashStatRooms','Learning rooms')}</span>";
  }
);
c = c.replace(
  /(<span class="dash-stat-label">)Courses(<\/span>)/,
  '$1${tr(\'dashStatCourses\',\'Courses\')}$2'
);

// Fix greeting
c = c.replace(
  "document.getElementById('dashGreeting').textContent = tr('dashWelcome', 'Welcome back') + ', ' + (state.profile?.full_name || tr('student', 'student')) + '!';",
  "document.getElementById('dashGreeting').textContent = `${tr('dashWelcome', 'Welcome back')}, ${state.profile?.full_name || tr('student', 'student')}!`;"
);

fs.writeFileSync('app.js', c, 'utf8');
console.log('Done. Verify:');
const lines = c.split('\n');
lines.slice(491, 500).forEach((l, i) => console.log((492+i) + ': ' + l));
