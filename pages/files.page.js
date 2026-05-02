registerPageModule('files', function filesPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-files">
      <div class="page-header"><h1 data-i18n="pageFiles">${_t('pageFiles','Files')}</h1></div>
      <div class="file-grid" id="fileGrid"></div>
    </section>
  `;
});
