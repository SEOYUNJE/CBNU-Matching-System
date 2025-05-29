// 전역 변수로 현재 선택된 카테고리 저장
let selectedCategory = '전체';

// 카테고리 태그 클릭 이벤트 처리
document.querySelectorAll('.category-tag').forEach(tag => {
  tag.addEventListener('click', function() {
    // 이전 선택 해제
    document.querySelector('.category-tag.active')?.classList.remove('active');
    // 새로운 선택 표시
    this.classList.add('active');
    // 선택된 카테고리 저장
    selectedCategory = this.textContent;
    
    // 검색 결과가 표시된 상태라면 필터링 적용
    if (!document.getElementById('resultSection').classList.contains('hidden')) {
      filterResults(selectedCategory);
    }
  });
});

// 검색 결과 필터링 함수
function filterResults(category) {
  const resultItems = document.querySelectorAll('.list-item');
  
  resultItems.forEach(item => {
    const itemCategory = item.querySelector('.tag').textContent.toLowerCase();
    if (category === '전체' || itemCategory === category.toLowerCase()) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const searchSection = document.getElementById('searchSection');
  const searchForm = document.getElementById('searchForm');
  const resultSection = document.getElementById('resultSection');
  const categoryTags = document.getElementById('categoryTags');
  const categoryDropdown = document.getElementById('categoryDropdown');
  const categoryBtn = document.querySelector('.category-btn');
  
  let selectedCategory = '전체';

  // 검색 전 카테고리 태그 클릭 이벤트
  document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      document.querySelector('.category-tag.active')?.classList.remove('active');
      this.classList.add('active');
      selectedCategory = this.textContent;
    });
  });

  // 검색 후 카테고리 옵션 클릭 이벤트
  document.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelector('.category-option.active')?.classList.remove('active');
      this.classList.add('active');
      selectedCategory = this.textContent;
      categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;
      categoryDropdown.classList.remove('active');
      filterResults(selectedCategory);
    });
  });

  // 카테고리 드롭다운 토글
  categoryBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    categoryDropdown.classList.toggle('active');
    const icon = categoryDropdown.classList.contains('active') ? 'up' : 'down';
    this.querySelector('i').className = `bi bi-chevron-${icon}`;
  });

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener('click', function(e) {
    if (!categoryDropdown.contains(e.target)) {
      categoryDropdown.classList.remove('active');
      categoryBtn.querySelector('i').className = 'bi bi-chevron-down';
    }
  });

  // 검색 폼 제출 이벤트
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 스크롤을 맨 위로 이동
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // UI 변경
    searchSection.classList.add('shrink');
    document.querySelector('.search-title').classList.add('small');
    document.querySelector('.search-box').classList.add('small');
    
    // 카테고리 UI 전환
    categoryTags.style.display = 'none';
    categoryDropdown.classList.remove('hidden');
    categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;

    // 검색 결과 표시
    setTimeout(() => {
      resultSection.classList.remove('hidden');
      resultSection.style.display = 'block';
      filterResults(selectedCategory);
    }, 300);
  });

  // 검색 결과 필터링 함수
  function filterResults(category) {
    const resultItems = document.querySelectorAll('.list-item');
    resultItems.forEach(item => {
      const itemCategory = item.querySelector('.tag').textContent;
      if (category === '전체' || itemCategory === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
});