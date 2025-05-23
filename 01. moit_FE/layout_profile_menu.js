     
  document.addEventListener('DOMContentLoaded', () => {
      const profileBtn = document.getElementById('profileBtn');
      const wrapper    = profileBtn.closest('.profile-wrapper');

      // 1) 클릭 시 열고/닫기
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();               // 이벤트 버블링 방지
        wrapper.classList.toggle('open');
      });

      // 2) wrapper 바깥 클릭 시 메뉴 닫기
      document.addEventListener('click', () => {
        wrapper.classList.remove('open');
      });
    });
