registerPageModule('grades', function gradesPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-grades">
      <div class="page-header"><h1 data-i18n="pageGrades">${_t('pageGrades','Grades')}</h1></div>
      <div id="gradesContent"></div>
    </section>
  `;
});
