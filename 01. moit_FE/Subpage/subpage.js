document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.filter-buttons button');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      // 모든 탭에서 active 제거
      tabs.forEach(x => x.classList.remove('active'));
      // 클릭된 탭만 active
      btn.classList.add('active');

      // TODO: 필요하다면, active 상태에 따라 카드/목록 필터 로직 추가
    });
  });
});
