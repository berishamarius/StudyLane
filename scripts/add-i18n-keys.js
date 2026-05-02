const fs = require('fs');
const en = JSON.parse(fs.readFileSync('locales/en.json', 'utf8'));

const newKeys = {
  dashWelcome: 'Welcome back',
  student: 'student',
  dashStatTasks: 'Open tasks',
  dashStatLessons: "Today\u2019s lessons",
  dashStatRooms: 'Learning rooms',
  dashStatCourses: 'Courses',
  dashCardSchedule: "Today\u2019s schedule",
  dashCardRooms: 'Learning rooms',
  dashCardUpcoming: 'Upcoming tasks',
  dashCardTasks: 'Open tasks',
  dashCardHomeschool: 'Homeschooling guide',
  learnFolderDesc: 'Description',
  learnKeyPoints: 'Key concepts',
  learnSources: 'Sources',
  learnSelectSubject: 'Select a subject above to start learning',
  learnTopicTask: 'Practice task',
  learnTopicKeyPoints: 'Key concepts',
  learnTopicSources: 'Sources'
};

let added = 0;
Object.keys(newKeys).forEach(k => {
  if (!en[k]) { en[k] = newKeys[k]; added++; }
});

fs.writeFileSync('locales/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('Added', added, 'keys to en.json');
