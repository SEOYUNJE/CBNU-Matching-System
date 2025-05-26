/* 2025-05-17 */
/* 모임 참가 팝업창 */
/* 작성자: 최은재 */

document.addEventListener('DOMContentLoaded', () => {
  const joinPopup = document.getElementById('joinPopup');
  const closeJoinPopup = document.getElementById('closeJoinPopup');
  const joinBtn = document.querySelector('#joinPopup .submit-btn');
  const loginPrompt = document.getElementById('loginPrompt');
  const loginBtn = document.getElementById('goToLogin');

  const isLoggedIn = false; // 로그인 여부 (추후 Django 템플릿으로 대체)

  // 카드 클릭 → 팝업 열기
  const clickableCards = document.querySelectorAll('.card, .list-item');
  clickableCards.forEach((card) => {
    card.addEventListener('click', () => {
      // 예시 내용 (동적으로 바꿀 예정이면 fetch로 연결?????)
      document.getElementById('joinTitle').textContent = '같이 찜닭 시켜볼 분';
      document.getElementById('joinDate').textContent = '2025-05-12 (일) 21:00';
      document.getElementById('joinDescription').textContent =
        '찜닭 2인 세트 함께 주문하실 분 구해요. 최소 주문 금액 맞춰야 해요!';
      document.getElementById('joinCategory').textContent = 'MEALS';
      document.getElementById('joinMembers').textContent = '모집인원 2/4';

      joinPopup.classList.add('show');
    });
  });

  // [X] 닫기
  closeJoinPopup.addEventListener('click', () => {
    joinPopup.classList.remove('show');
  });

  // 바깥 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === joinPopup) joinPopup.classList.remove('show');
    if (e.target === loginPrompt) loginPrompt.classList.remove('show');
  });

  // [채팅방 입장하기] → 로그인 안된 경우 로그인 팝업 띄우기
  joinBtn.addEventListener('click', () => {
    if (!isLoggedIn) {
      joinPopup.classList.remove('show');
      loginPrompt.classList.add('show');
      return;
    }

    alert("채팅방으로 이동합니다!");
    // location.href = `/chat/room/...`;
    // 연동 후 경로 연결결
  });

  // [로그인 하러 가기] → 실제 로그인 페이지로 이동
  // 여기서 로그인 경로 지정하면 됩니다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  loginBtn.addEventListener('click', () => {
    const currentUrl = window.location.pathname;
    const redirectUrl = `../Login/login.html?next=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  });
});




// document.addEventListener('DOMContentLoaded', () => {
//   const joinPopup = document.getElementById('joinPopup');
//   const closeJoinPopup = document.getElementById('closeJoinPopup');

//   // 예시: 카드 중 하나에 클릭 이벤트 연결
//   const sampleCards = document.querySelectorAll('.block');
//   sampleCards.forEach((card) => {
//     card.addEventListener('click', () => {
//       // 여기에 실제 데이터 넣기
//       document.getElementById('joinTitle').textContent = '같이 찜닭 시켜볼 분';
//       document.getElementById('joinDate').textContent = '2025-05-12 (일) 21:00';
//       document.getElementById('joinDescription').textContent =
//         '찜닭 2인 세트 함께 주문하실 분 구해요. 최소 주문 금액 맞춰야 해요!';
//       document.getElementById('joinCategory').textContent = 'MEALS';
//       document.getElementById('joinMembers').textContent = '모집인원 2/4';

//       joinPopup.classList.add('show');
//     });
//   });

//   closeJoinPopup.addEventListener('click', () => {
//     joinPopup.classList.remove('show');
//   });

//   // 바깥 클릭 시 닫기
//   window.addEventListener('click', (e) => {
//     if (e.target === joinPopup) joinPopup.classList.remove('show');
//   });
// });
