/* 2025-05-17 */
/* 모임 참가 팝업창 */
/* 작성자: 최은재 */

document.addEventListener('DOMContentLoaded', () => {
  const joinPopup = document.getElementById('joinPopup');
  const closeJoinPopup = document.getElementById('closeJoinPopup');
  const joinBtn = document.getElementById('enterBtn');
  const loginPrompt = document.getElementById('loginPrompt');

  const btnTime = document.getElementById('btnTime');
  const btnMember = document.getElementById('btnMember');
  const timeList = document.getElementById('timeList');
  const memberList = document.getElementById('memberList');

  const isLoggedIn = joinBtn.dataset.auth === 'True';

  btnTime.addEventListener('click', () => {
    btnTime.classList.add('active');
    btnMember.classList.remove('active');
    timeList.style.display = 'flex';  // 보이기 (수평 형태)
    memberList.style.display = 'none';  // 숨기기
  });

  btnMember.addEventListener('click', () => {
    btnMember.classList.add('active');
    btnTime.classList.remove('active');
    memberList.style.display = 'flex';   // 보이기 (수평 형태)
    timeList.style.display = 'none';    // 숨기기
  });

  // 상단 카드 클릭 → 모임 참가 팝업 창 열기
  // 하단 모임 리스트 클릭 -> 모임 참가 팝업 창 열기 
  const clickableCards = document.querySelectorAll('.card, .list-item');
  clickableCards.forEach((card) => {
    card.addEventListener('click', () => {
      // meet 정보를 카드의 data-* 속성으로 넘긴다
      document.getElementById('joinTitle').textContent = card.dataset.title;
      document.getElementById('joinDate').textContent = `생성일자 ${card.dataset.created}`;
      document.getElementById('joinDescription').textContent = card.dataset.introduce;
      document.getElementById('joinCategory').textContent = card.dataset.category;
      document.getElementById('joinMembers').textContent = `모집인원 ${card.dataset.members}`;
      document.getElementById('joinDeadline').textContent = `마감 ${card.dataset.deadline}`;

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

    const confirmed = window.confirm("채팅방으로 이동하시겠습니까?");
    if (confirmed) {
      window.location.replace('/main/');
    }
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
