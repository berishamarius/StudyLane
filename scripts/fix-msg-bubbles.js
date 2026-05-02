const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

const sendBtn = `<button class="msg-send-btn" onclick="sendChatMessage()" title="Send">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>`;

// Fix bubble rendering: replace both occurrences
const oldBubble = `return \`<div class="msg-bubble \${mine ? 'mine' : 'theirs'}">\${item.sender_name ? \`<div class="msg-bubble-sender">\${item.sender_name}</div>\` : ''}<div>\${item.content || ''}</div><div class="msg-bubble-time">\${item.created_at ? new Date(item.created_at).toLocaleString() : ''}</div></div>\`;`;

const newBubble = `return \`<div class="msg-bubble-wrap \${mine ? 'mine' : 'theirs'}"><div class="msg-bubble \${mine ? 'mine' : 'theirs'}">\${item.sender_name && !mine ? \`<div class="msg-bubble-sender">\${item.sender_name}</div>\` : ''}<div>\${item.content || ''}</div></div><div class="msg-bubble-time \${mine ? '' : 'theirs'}">\${item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ''}</div></div>\`;`;

let count = 0;
while (c.includes(oldBubble)) {
  c = c.replace(oldBubble, newBubble);
  count++;
}
console.log('Replaced bubble HTML', count, 'times');

// Fix send button (btn btn-primary) → msg-send-btn with SVG
const oldSend1 = `<button class="btn btn-primary" onclick="sendChatMessage()">\${tr('chatSend', 'Send')}</button>`;
const oldSend2 = `<button class="btn btn-primary" onclick="sendChatMessage()">Send</button>`;
const newSendBtn = `<button class="msg-send-btn" onclick="sendChatMessage()" title="\${tr('chatSend','Send')}"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>`;

c = c.replace(oldSend1, newSendBtn);
c = c.replace(oldSend2, newSendBtn);
console.log('Send buttons updated');

fs.writeFileSync('app.js', c, 'utf8');
console.log('Done');
