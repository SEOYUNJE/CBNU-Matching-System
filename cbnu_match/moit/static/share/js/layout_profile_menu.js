     
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

    const mannerElem = document.getElementById('manner');
    if (mannerElem) {
    const mannerTemp = mannerElem.dataset.temp;
    const bar = document.getElementById('mannerBar');
    const emoji = document.getElementById('mannerEmoji');

    bar.style.width = `${mannerTemp}%`;

    if (mannerTemp > 80) {
      bar.style.backgroundColor = '#4CAF50';
      emoji.textContent = '😄 최고예요!';
    } else if (mannerTemp > 60) {
      bar.style.backgroundColor = '#8BC34A';
      emoji.textContent = '😊 좋아요';
    } else if (mannerTemp > 40) {
      bar.style.backgroundColor = '#FFC107';
      emoji.textContent = '😐 보통이에요';
    } else if (mannerTemp > 20) {
      bar.style.backgroundColor = '#FF9800';
      emoji.textContent = '😟 아쉬워요';
    } else {
      bar.style.backgroundColor = '#F44336';
      emoji.textContent = '😠 매우 낮아요';
    }
}