registerPageModule('dashboard', function dashboardPage() {
  return `
    <section class="page active" id="page-dashboard">
      <div class="dash-greeting" id="dashGreeting"></div>
      <div class="dash-stats" id="dashStats"></div>
      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-card-title">Today’s schedule</div>
          <div id="dashSchedule" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">Learning rooms</div>
          <div id="dashRooms" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">Upcoming</div>
          <div id="dashUpcoming" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">Open Tasks</div>
          <div id="dashTasks" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">Homeschooling guide</div>
          <div id="dashHomeschool" class="dash-list-placeholder">Loading...</div>
        </div>
      </div>
    </section>
  `;
});
