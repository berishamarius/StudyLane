registerPageModule('messages', function messagesPage() {
  const chatsLabel = typeof t === 'function' ? t('chatSidebarTitle') : 'Chats';
  const emptyLabel = typeof t === 'function' ? t('chatSelectPrompt') : 'Select a chat to start messaging';
  return `
    <section class="page msg-page" id="page-messages">
      <div class="msg-sidebar">
        <div class="msg-sidebar-head">
          <span class="msg-sidebar-title">${chatsLabel === 'chatSidebarTitle' ? 'Chats' : chatsLabel}</span>
          <button class="icon-btn" onclick="startNewChat()">+</button>
        </div>
        <div class="msg-room-list" id="msgRoomList">Loading...</div>
      </div>
      <div class="msg-chat-area" id="msgChatArea">
        <div class="msg-empty-state"><p>${emptyLabel === 'chatSelectPrompt' ? 'Select a chat to start messaging' : emptyLabel}</p></div>
      </div>
    </section>
  `;
});
