registerPageModule('admin', function adminPage() {
  return `
    <section class="page admin-only" id="page-admin">
      <div class="page-header"><h1>Users & Roles</h1></div>
      <div id="adminUserList">Loading...</div>
    </section>
  `;
});

registerPageModule('invites', function invitesPage() {
  return `
    <section class="page admin-only" id="page-invites">
      <div class="page-header"><h1>Invite Codes</h1></div>
      <div id="inviteList">Loading...</div>
    </section>
  `;
});
