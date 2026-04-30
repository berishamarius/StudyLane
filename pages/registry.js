(function () {
  window.PAGE_MODULES = window.PAGE_MODULES || {};

  window.registerPageModule = function registerPageModule(id, getHtml) {
    window.PAGE_MODULES[id] = getHtml;
  };

  window.ensurePagesMounted = function ensurePagesMounted() {
    const pageArea = document.getElementById('pageArea');
    if (!pageArea) return;
    if (document.getElementById('page-dashboard')) return;

    const order = [
      'dashboard',
      'courses',
      'course-detail',
      'tasks',
      'messages',
      'files',
      'calendar',
      'grades',
      'teacher-tools',
      'learn',
      'settings',
      'profile',
      'admin',
      'invites'
    ];

    pageArea.innerHTML = order
      .map((id) => {
        const factory = window.PAGE_MODULES[id];
        return factory ? factory() : '';
      })
      .join('');
  };
})();
