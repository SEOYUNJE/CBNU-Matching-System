document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".snap-section");
  let current = 0;
  let isScrolling = false;

  function scrollToSection(index) {
      if (index < 0 || index >= sections.length) return;

      isScrolling = true;
      const target = sections[index];
      const start = window.scrollY;
      const end = target.offsetTop;
      const distance = end - start;
      const duration = 700;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          isScrolling = false;
          current = index;
        }
      }

      requestAnimationFrame(animation);
  }

  window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0 && current < sections.length - 1) {
      scrollToSection(current + 1);
    } else if (e.deltaY < 0 && current > 0) {
      scrollToSection(current - 1);
    }
  });
});

