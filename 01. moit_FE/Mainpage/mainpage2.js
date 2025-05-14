window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.scroll-grid > section');
    let currentIndex = 0;
    let isScrolling = false;

    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;

        isScrolling = true;
        sections[index].scrollIntoView({ behavior: 'smooth' });

        // 스크롤 애니메이션 끝나기 전까지 휠 입력 막기
        setTimeout(() => {
            isScrolling = false;
            currentIndex = index;
        }, 800);
    }

    document.querySelector('.scroll-grid').addEventListener('wheel', (e) => {
        if (isScrolling) return;

        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        }
    }, { passive: false });
});

// 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', () => {
  const categories = document.querySelectorAll('.cat-item');
  categories.forEach(item => {
    item.addEventListener('click', () => {
      // 선택된 배경 강조
      categories.forEach(c => c.classList.remove('active'));
      item.classList.add('active');

      // 페이지 이동
      const category = item.dataset.category;
      window.location.href = `/category/${category}.html`;
    });
  });
});

// window.addEventListener('load', () => {
//   const grid = document.querySelector('.scroll-grid');
//   if (!grid) return;

//   // 스크롤 리셋을 강제로 두 번 시도 (브라우저 렌더링 딜레이 대응)
//   setTimeout(() => {
//     grid.scrollTop = 0;
//     grid.scrollTo({ top: 0, behavior: 'instant' }); // 일부 브라우저 대응
//   }, 0);

//   // 추가 보장 (레이아웃 렌더 이후 100ms 뒤에도 다시 스냅)
//   setTimeout(() => {
//     grid.scrollTop = 0;
//   }, 100);
// });
