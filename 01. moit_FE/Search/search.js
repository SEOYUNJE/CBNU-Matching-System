// 전역 변수로 현재 선택된 카테고리 저장
let selectedCategory = '전체';

// 애니메이션 설정
const ANIMATION = {
  duration: 600,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

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
  
  // 모든 아이템 페이드 아웃
  resultItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
  });

  // 필터링 적용 및 페이드 인
  setTimeout(() => {
    resultItems.forEach((item, index) => {
      const itemCategory = item.querySelector('.tag').textContent.toLowerCase();
      if (category === '전체' || itemCategory === category.toLowerCase()) {
        item.style.display = 'block';
        // 순차적으로 페이드 인
        setTimeout(() => {
          item.style.transition = 'all 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      } else {
        item.style.display = 'none';
      }
    });
  }, 200);
}

document.addEventListener('DOMContentLoaded', function() {
  const searchSection = document.getElementById('searchSection');
  const searchForm = document.getElementById('searchForm');
  const resultSection = document.getElementById('resultSection');
  const categoryTags = document.getElementById('categoryTags');
  const categoryDropdown = document.getElementById('categoryDropdown');
  const categoryBtn = document.querySelector('.category-btn');
  
  // 검색창 관련 요소들
  const searchTitle = document.querySelector('.search-title');
  const searchBox = document.querySelector('.search-box');

  // 애니메이션 전환 설정 (검색 전 카테고리 제외)
  [searchSection, searchTitle, searchBox].forEach(el => {
    if (el) {
      el.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
    }
  });

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
    
    // 부드러운 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 모든 전환 요소 준비
    searchSection.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
    categoryDropdown.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;
    resultSection.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;

    // 동시 전환 시작
    requestAnimationFrame(() => {
      // 검색창 섹션 전환
      searchSection.style.transform = 'translateY(-10px)';
      searchSection.style.opacity = '0.9';
      searchSection.classList.add('shrink');
      
      // 검색창 요소들 전환
      searchTitle.classList.add('small');
      searchBox.classList.add('small');
      
      // 카테고리 태그 페이드아웃
      categoryTags.classList.add('fade-out');

      // 약간의 시차를 두고 나머지 요소들 전환
      setTimeout(() => {
        // 검색창 위치 복원
        searchSection.style.transform = 'translateY(0)';
        searchSection.style.opacity = '1';

        // 드롭다운 표시
        categoryDropdown.classList.remove('hidden');
        categoryDropdown.style.opacity = '1';
        categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;

        // 결과 섹션 표시
        resultSection.style.display = 'block';
        resultSection.classList.remove('hidden');
        resultSection.style.opacity = '1';

        // 결과 아이템 순차적 표시
        const resultItems = resultSection.querySelectorAll('.list-item');
        resultItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.transition = `all ${ANIMATION.duration * 0.6}ms ${ANIMATION.easing}`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 200 + (index * 100));
        });

        // 필터링 적용
        filterResults(selectedCategory);
      }, 100);
    });
  });

  // 검색 취소 기능 (ESC 키)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !resultSection.classList.contains('hidden')) {
      // 모든 전환 요소 준비
      searchSection.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
      categoryDropdown.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;
      resultSection.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;

      // 동시 전환 시작
      requestAnimationFrame(() => {
        // 결과 섹션 페이드 아웃
        resultSection.style.opacity = '0';
        
        // 드롭다운 페이드 아웃
        categoryDropdown.style.opacity = '0';
        
        // 검색창 섹션 전환
        searchSection.style.transform = 'translateY(-10px)';
        searchSection.style.opacity = '0.9';

        setTimeout(() => {
          // 결과 섹션 숨기기
          resultSection.classList.add('hidden');
          resultSection.style.display = 'none';
          
          // 드롭다운 숨기기
          categoryDropdown.classList.add('hidden');
          
          // 검색창 섹션 원래 크기로
          searchSection.classList.remove('shrink');
          searchTitle.classList.remove('small');
          searchBox.classList.remove('small');
          
          requestAnimationFrame(() => {
            searchSection.style.transform = 'translateY(0)';
            searchSection.style.opacity = '1';
            
            // 카테고리 태그 페이드인
            categoryTags.classList.remove('fade-out');
          });
        }, 150);
      });

      // 검색어 초기화
      document.querySelector('input[type="text"]').value = '';
    }
  });
});

