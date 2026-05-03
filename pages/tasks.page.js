registerPageModule('tasks', function tasksPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-tasks">
      <div class="page-header">
        <h1 data-i18n="pagePlanner">${_t('pagePlanner','Planer')}</h1>
      </div>
      <div id="plannerContent" class="planer-content-root"></div>
    </section>
  `;
});
