registerPageModule('admin', function adminPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page admin-only" id="page-admin">
      <div class="page-header"><h1 data-i18n="pageAdmin">${_t('pageAdmin','Users & Roles')}</h1></div>
      <div id="adminUserList"></div>
    </section>
  `;
});

registerPageModule('invites', function invitesPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page admin-only" id="page-invites">
      <div class="page-header"><h1 data-i18n="pageInvites">${_t('pageInvites','Invite Codes')}</h1></div>
      <div id="inviteList"></div>
    </section>
  `;
});
