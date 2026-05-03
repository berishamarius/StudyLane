registerPageModule('learn', function learnPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-learn">
      <div class="page-header"><h1 data-i18n="pageLearn">${_t('pageLearn','Learn')}</h1></div>
      <div id="learnContent">Loading...</div>
    </section>
  `;
});
