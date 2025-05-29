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

  // 검색 폼 제출 이벤트 - 개선된 애니메이션
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 부드러운 스크롤을 위해 약간의 딜레이 추가
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    // UI 변경을 단계적으로 적용
    // 1단계: 카테고리 태그 페이드아웃 (가장 먼저)
    categoryTags.classList.add('fade-out');
    
    // 2단계: 검색 섹션 크기 변경 (카테고리가 사라진 후)
    setTimeout(() => {
      searchSection.classList.add('shrink');
      document.querySelector('.search-title').classList.add('small');
      document.querySelector('.search-box').classList.add('small');
    }, 100);

    // 3단계: 드롭다운 표시 및 결과 영역 준비
    setTimeout(() => {
      categoryDropdown.classList.remove('hidden');
      categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;
    }, 200);

    // 4단계: 검색 결과 표시 (모든 애니메이션 완료 후)
    setTimeout(() => {
      resultSection.classList.remove('hidden');
      resultSection.style.display = 'block';
      // 결과 표시 후 필터링 적용
      setTimeout(() => {
        filterResults(selectedCategory);
      }, 100);
    }, 350);
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

  // 검색 취소 기능 (선택사항 - ESC 키로 초기 상태로 돌아가기)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !resultSection.classList.contains('hidden')) {
      resetSearchState();
    }
  });

  function resetSearchState() {
    // 검색 결과 숨기기
    resultSection.classList.add('hidden');
    setTimeout(() => {
      resultSection.style.display = 'none';
    }, 300);

    // 검색 섹션 원래 상태로
    setTimeout(() => {
      searchSection.classList.remove('shrink');
      document.querySelector('.search-title').classList.remove('small');
      document.querySelector('.search-box').classList.remove('small');
      
      // 카테고리 UI 원래 상태로
      categoryDropdown.classList.add('hidden');
      categoryTags.classList.remove('fade-out');
      
      // 검색어 초기화
      document.querySelector('input[type="text"]').value = '';
    }, 100);
  }
});