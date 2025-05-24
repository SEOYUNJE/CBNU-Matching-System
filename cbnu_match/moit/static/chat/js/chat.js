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

// ////////////////////////////////팝업창 관련 /////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  // 메시지 자동 스크롤, 전송 버튼 등 기존 코드...

  // 1) 프로필 열람 클릭 이벤트 등록
  document.querySelectorAll('.member-list li, .msg-header').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.querySelector('p')?.textContent?.trim() || '닉네임';
      const img = el.querySelector('img')?.src || '../Images/default.png';

      const modal = document.getElementById('profileModal');
      modal.querySelector('.nickname').textContent = name;
      modal.querySelector('.avatar').src = img;

      modal.querySelector('.manner-value').textContent = '40';
      modal.querySelector('.fill').style.width = '40%';
      modal.querySelector('.intro').textContent = '롤/오버워치/배그 등등 웬만한 게임은 다 잘합니다 ㅎㅎ 초보자랑 같이 하는 것도 좋아해요!';
      modal.querySelector('.gender').textContent = '남자';
      modal.querySelector('.mbti').textContent = 'ENFJ';
      modal.querySelector('.college').textContent = '상경대학';

      modal.classList.remove('hidden');
    });
  });

  // 2) 닫기 버튼 이벤트 등록
  document.querySelector('.profile-modal .close-btn')?.addEventListener('click', () => {
    document.getElementById('profileModal').classList.add('hidden');
  });
});

// 매너온도 설정 - 아직 로직 정하지 않은 상태, 참고용으로 작성
function setMannerBar(score) {
  const maxScore = 1000;
  const maxBarWidth = 150;

  const mannerValue = Math.round((score / maxScore) * 100);      // 표시 숫자
  const fillWidth = Math.round((score / maxScore) * maxBarWidth); // 바 길이(px)

  const modal = document.getElementById('profileModal');
  modal.querySelector('.manner-value').textContent = mannerValue;
  modal.querySelector('.fill').style.width = `${fillWidth}px`;
}

// 나가기 팝업
document.addEventListener('DOMContentLoaded', () => {
  const leaveBtn = document.querySelector('.member-list .leave');
  const leaveModal = document.getElementById('leaveModal');
  const confirmLeave = document.querySelector('.confirm-leave');
  const cancelLeave = document.querySelector('.cancel-leave');

  if (leaveBtn && leaveModal) {
    leaveBtn.addEventListener('click', () => {
      leaveModal.classList.remove('hidden');
    });
    
  // if (leaveBtn && leaveModal) {
  //   leaveBtn.addEventListener('click', () => {
  //     const role = leaveBtn.dataset.role;  // ✅ 역할 가져오기

  //     // ✅ 역할에 따라 메시지 다르게 설정
  //     const message = role === 'leader'
  //       ? '채팅방을 나가면 모임이 삭제됩니다.\n정말 나가시겠습니까?'
  //       : '채팅방을 나가면 모임에서 제외됩니다.\n정말 나가시겠습니까?';

  //     leaveMsg.innerText = message; // ✅ 메시지 적용
  //     leaveModal.classList.remove('hidden');
  //   });


    cancelLeave.addEventListener('click', () => {
      leaveModal.classList.add('hidden');
    });

    confirmLeave.addEventListener('click', () => {

      // 실제 나가기 로직 처리
      // location.href = '/chat/leave'; 또는 fetch POST 등
      // 버튼 클릭 이벤트 발생 후, 방장이 나갔음을 클릭하면 모임 자체가 없어짐??

      alert("채팅방을 나갔습니다.");
      leaveModal.classList.add('hidden');
    });

  }
});

