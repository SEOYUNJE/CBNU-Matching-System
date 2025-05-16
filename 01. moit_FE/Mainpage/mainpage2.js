// 2025-05-17
// 리팩토링: 스크롤 끊기는 현상 해결
// 작성자: 최은재 

window.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.scroll-grid > section');
  let currentIndex = 0;
  let isScrolling = false;

  function scrollToSection(index) {
    if (index < 0 || index > sections.length) return;

    isScrolling = true;

    if (index < sections.length) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    setTimeout(() => {
      isScrolling = false;
      currentIndex = index;
    }, 700); // 애니메이션 시간과 맞춰줘야 정확함
  }

  document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;
    const nextIndex = currentIndex + direction;

    scrollToSection(nextIndex);
  }, { passive: false });
});
