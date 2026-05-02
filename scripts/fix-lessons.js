const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

// Fix Today's lessons 
const old = "class=\"dash-stat-label\">Today\u2019s lessons</span>";
const has = c.includes(old);
console.log('Has fancy apostrophe:', has);

// Try regular apostrophe
const old2 = "class=\"dash-stat-label\">Today's lessons</span>";
console.log('Has straight apostrophe:', c.includes(old2));

// Just do a simple regex replace regardless of apostrophe type
c = c.replace(/class="dash-stat-label">Today.s lessons<\/span>/, 
  "class=\"dash-stat-label\">${tr('dashStatLessons',\"Today's lessons\")}</span>");

fs.writeFileSync('app.js', c, 'utf8');
const lines = c.split('\n');
console.log('Line 494:', lines[493]);
