registerPageModule('settings', function settingsPage() {
  const title = typeof t === 'function' ? t('pageSettings') : 'Settings';
  return `
    <section class="page" id="page-settings">
      <div class="page-header"><h1>${title === 'pageSettings' ? 'Settings' : title}</h1></div>
      <div id="settingsContent">Loading...</div>
    </section>
  `;
});
