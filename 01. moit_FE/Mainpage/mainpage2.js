window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.scroll-grid > section');
    let currentIndex = 0;
    let isScrolling = false;

    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;

        isScrolling = true;
        const targetOffset = sections[index].offsetTop;

        window.scrollTo({ top: targetOffset, behavior: 'smooth' });

        setTimeout(() => {
            isScrolling = false;
            currentIndex = index;
        }, 800); // 스크롤 애니메이션 시간과 맞춰야 함
    }

    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        e.preventDefault(); // 브라우저 기본 스크롤 방지

        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        }
    }, { passive: false });
});


