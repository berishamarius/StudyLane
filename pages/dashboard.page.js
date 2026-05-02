registerPageModule('dashboard', function dashboardPage() {
  return `
    <section class="page active" id="page-dashboard">
      <!-- Hero -->
      <div class="dash-hero">
        <div class="dash-hero-text">
          <div class="dash-greeting" id="dashGreeting"></div>
          <div class="dash-date-line" id="dashDate"></div>
        </div>
        <div class="dash-quick-actions" id="dashQuickActions"></div>
      </div>

      <!-- Stats -->
      <div class="dash-stats" id="dashStats"></div>

      <!-- Main grid -->
      <div class="dash-main-grid">
        <!-- Left column -->
        <div class="dash-col-main">
          <div class="dash-card">
            <div class="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span data-i18n="dashCardSchedule">Today's schedule</span>
            </div>
            <div id="dashSchedule"></div>
          </div>
          <div class="dash-card">
            <div class="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              <span data-i18n="dashCardUpcoming">Upcoming tasks</span>
            </div>
            <div id="dashUpcoming"></div>
          </div>
        </div>

        <!-- Right column -->
        <div class="dash-col-side">
          <div class="dash-card">
            <div class="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>
              <span data-i18n="dashCardTasks">Open tasks</span>
            </div>
            <div id="dashTasks"></div>
          </div>
          <div class="dash-card dash-card-learn" onclick="navigate('learn')" style="cursor:pointer">
            <div class="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              <span data-i18n="learnContinue">Continue learning</span>
            </div>
            <div id="dashLearnCard" class="dash-learn-cta">
              <p data-i18n="dashToLearn">Open the learning library to study subjects, topics and exercises.</p>
              <button class="btn btn-primary" style="margin-top:10px;font-size:12px;padding:8px 18px" onclick="navigate('learn')" data-i18n="learnStartNow">Start now</button>
            </div>
          </div>
          <div class="dash-card">
            <div class="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span data-i18n="dashCardRooms">Learning rooms</span>
            </div>
            <div id="dashRooms"></div>
          </div>
        </div>
      </div>
    </section>
  `;
});
