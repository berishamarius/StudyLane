registerPageModule('learn', function learnPage() {
  const title = typeof t === 'function' ? t('pageLearn') : 'Learn';
  return `
    <section class="page" id="page-learn">
      <div class="page-header"><h1>${title === 'pageLearn' ? 'Learn' : title}</h1></div>
      <div id="learnContent">Loading...</div>
    </section>
  `;
});
