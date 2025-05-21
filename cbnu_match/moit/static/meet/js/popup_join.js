/* 2025-05-17 */
/* 모임 참가 팝업창 */
/* 작성자: 최은재 */
document.addEventListener('DOMContentLoaded', () => {
  const joinPopup = document.getElementById('joinPopup');
  const closeJoinPopup = document.getElementById('closeJoinPopup');

  // 예시: 카드 중 하나에 클릭 이벤트 연결
  const sampleCards = document.querySelectorAll('.block');
  sampleCards.forEach((card) => {
    card.addEventListener('click', () => {
      // 여기에 실제 데이터 넣기
      document.getElementById('joinTitle').textContent = '같이 찜닭 시켜볼 분';
      document.getElementById('joinDate').textContent = '2025-05-12 (일) 21:00';
      document.getElementById('joinDescription').textContent =
        '찜닭 2인 세트 함께 주문하실 분 구해요. 최소 주문 금액 맞춰야 해요!';
      document.getElementById('joinCategory').textContent = 'MEALS';
      document.getElementById('joinMembers').textContent = '모집인원 2/4';

      joinPopup.classList.add('show');
    });
  });

  closeJoinPopup.addEventListener('click', () => {
    joinPopup.classList.remove('show');
  });

  // 바깥 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === joinPopup) joinPopup.classList.remove('show');
  });
});
