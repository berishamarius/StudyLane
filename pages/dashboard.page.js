registerPageModule('dashboard', function dashboardPage() {
  return `
    <section class="page active" id="page-dashboard">
      <div class="dash-greeting" id="dashGreeting"></div>
      <div class="dash-stats" id="dashStats"></div>
      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-card-title">Upcoming</div>
          <div id="dashUpcoming" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">Open Tasks</div>
          <div id="dashTasks" class="dash-list-placeholder">Loading...</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-title">My Courses</div>
          <div id="dashCourses" class="dash-list-placeholder">Loading...</div>
        </div>
      </div>
    </section>
  `;
});
