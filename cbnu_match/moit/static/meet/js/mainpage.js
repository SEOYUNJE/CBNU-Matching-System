// 2025-05-17
// 스크롤 & 인디케이터 최종 리팩토링
// 작성자: 최은재

window.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.scroll-grid > section');
  const indicatorDots = document.querySelectorAll('.scroll-indicator .dot');
  let currentIndex = 0;
  let isScrolling = false;

  function updateIndicator(index) {
    indicatorDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function scrollToSection(index) {
    if (index < 0 || index > sections.length) return;

    isScrolling = true;

    const safeIndex = Math.min(index, sections.length - 1);
    updateIndicator(safeIndex); // 바로 색상 갱신

    if (index < sections.length) {
      if (index === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 맨 위
      } else {
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // 마지막 이후 → footer
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    setTimeout(() => {
      isScrolling = false;
      currentIndex = index;
    }, 700);
  }

  document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;
    const nextIndex = currentIndex + direction;
    scrollToSection(nextIndex);
  }, { passive: false });

  indicatorDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!isScrolling && index !== currentIndex) {
        scrollToSection(index);
      }
    });
  });

  updateIndicator(0);
});
