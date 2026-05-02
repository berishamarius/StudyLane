registerPageModule('courses', function coursesPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-courses">
      <div class="page-header">
        <h1 data-i18n="pageCourses">${_t('pageCourses','Courses')}</h1>
        <div class="course-actions-bar">
          <button class="course-join-btn" onclick="openJoinCourse()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <span data-i18n="courseJoin">${_t('courseJoin','Join Course')}</span>
          </button>
          <button class="course-create-btn" onclick="openCreateCourse()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span data-i18n="courseCreate">${_t('courseCreate','Create Course')}</span>
          </button>
        </div>
      </div>
      <div class="course-search-bar"><input class="input" id="courseSearch" type="search" placeholder="${_t('searchPlaceholder','Search courses...')}" oninput="filterCourses()" /></div>
      <div class="course-grid" id="courseGrid"></div>
    </section>
  `;
});

registerPageModule('course-detail', function courseDetailPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-course-detail">
      <button class="back-btn" onclick="navigate('courses')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="15 18 9 12 15 6"/></svg>
        <span data-i18n="back">${_t('back','Back')}</span>
      </button>
      <div id="courseDetailContent"></div>
    </section>
  `;
});
