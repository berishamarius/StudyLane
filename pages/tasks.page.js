registerPageModule('tasks', function tasksPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-tasks">
      <div class="page-header">
        <h1 data-i18n="pagePlanner">${_t('pagePlanner','Planner')}</h1>
      </div>
      <div class="planner-grid">
        <div class="planner-section">
          <div class="planner-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span data-i18n="dashCardSchedule">${_t('dashCardSchedule',"Today's schedule")}</span>
          </div>
          <div id="plannerSchedule" class="planner-schedule-list"></div>
        </div>
        <div class="planner-section">
          <div class="planner-section-title" style="justify-content:space-between">
            <span style="display:flex;align-items:center;gap:8px">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              <span data-i18n="pageTasks">${_t('pageTasks','Tasks')}</span>
            </span>
            <div class="task-filter-bar">
              <button class="filter-chip active" onclick="filterTasks('all', this)" data-i18n="hwFilterAll">${_t('hwFilterAll','All')}</button>
              <button class="filter-chip" onclick="filterTasks('open', this)" data-i18n="hwFilterOpen">${_t('hwFilterOpen','Open')}</button>
              <button class="filter-chip" onclick="filterTasks('done', this)" data-i18n="hwFilterDone">${_t('hwFilterDone','Done')}</button>
              <button class="filter-chip" onclick="filterTasks('overdue', this)" data-i18n="hwOverdue">${_t('hwOverdue','Overdue')}</button>
            </div>
          </div>
          <div class="task-list" id="taskList"></div>
        </div>
      </div>
    </section>
  `;
});
