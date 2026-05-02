registerPageModule('messages', function messagesPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page msg-page" id="page-messages">
      <div class="msg-sidebar">
        <div class="msg-sidebar-head">
          <span class="msg-sidebar-title" data-i18n="chatSidebarTitle">${_t('chatSidebarTitle','Chats')}</span>
          <button class="icon-btn" style="width:32px;height:32px;border-radius:10px;font-size:18px;font-weight:300" onclick="startNewChat()" title="${_t('chatNewChat','New chat')}">+</button>
        </div>
        <div class="msg-room-list" id="msgRoomList"></div>
      </div>
      <div class="msg-chat-area" id="msgChatArea">
        <div class="msg-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h3 data-i18n="chatSelectPrompt">${_t('chatSelectPrompt','Select a chat to start messaging')}</h3>
        </div>
      </div>
    </section>
  `;
});
