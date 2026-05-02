const fs = require('fs');
const backtick = '`';
const content = `registerPageModule('dashboard', function dashboardPage() {
  return ${backtick}
    <section class="page active" id="page-dashboard">
      <div class="dash-greeting" id="dashGreeting"></div>
      <div class="dash-stats" id="dashStats"></div>
      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-card-title" data-i18n="dashCardSchedule">Today's schedule</div>
          <div id="dashSchedule" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title" data-i18n="dashCardRooms">Learning rooms</div>
          <div id="dashRooms" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title" data-i18n="dashCardUpcoming">Upcoming tasks</div>
          <div id="dashUpcoming" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title" data-i18n="dashCardTasks">Open tasks</div>
          <div id="dashTasks" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title" data-i18n="dashCardHomeschool">Homeschooling guide</div>
          <div id="dashHomeschool" class="dash-list-placeholder">Loading...</div>
        </div>
      </div>
    </section>
  ${backtick};
});
`;
fs.writeFileSync('pages/dashboard.page.js', content, 'utf8');
console.log('dashboard.page.js written');
