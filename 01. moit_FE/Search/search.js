  document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();  // 실제 제출 막기

    const searchSection = document.getElementById("searchSection");
    const searchTitle = document.querySelector(".search-title");
    const searchBox = document.querySelector(".search-box");

    // 작아지는 애니메이션 효과
    searchSection.classList.add("shrink");
    searchTitle.classList.add("small");
    searchBox.classList.add("small");

    // 검색결과 노출
    document.getElementById("resultSection").classList.remove("hidden");
  });