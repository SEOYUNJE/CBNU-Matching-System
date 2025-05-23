document.addEventListener('DOMContentLoaded', () => {
  // 1) 메시지 컨테이너 자동 스크롤
  const messagesContainer = document.querySelector('.chat-room .messages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // 2) 전송 버튼 & 입력 필드 바인딩
  const sendButton = document.querySelector('.chat-input button');
  const inputField = document.querySelector('.chat-input input, .chat-input textarea');

  // 만약 sendButton이나 inputField가 없으면, 아래 로직 자체를 스킵
  if (!sendButton || !inputField) return;

  sendButton.addEventListener('click', () => {
    const text = inputField.value.trim();
    if (!text) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    });
    const html = `
      <div class="msg sent">
        <div class="bubble"><p>${text}</p></div>
        <time>${timeString}</time>
      </div>`;

    const container = document.querySelector('.chat-room .messages');
    if (container) {
      container.insertAdjacentHTML('beforeend', html);
      container.scrollTop = container.scrollHeight;
    }

    inputField.value = '';
  });
});
