  // 전역 변수로 현재 선택된 카테고리 저장
  let selectedCategory = '전체'; // 카테고리 1
  let selectedCategory2 = '최신순'; // 카테고리 2
  let input_txt = "" // 입력값

  // 애니메이션 설정
  const ANIMATION = {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  };

  // 카테고리 태그 클릭 이벤트 처리
  // (이전에는 전역에서 처리했지만, AJAX 호출을 위해 DOMContentLoaded 내부로 옮겼습니다)
  // document.querySelectorAll('.category-tag').forEach(tag => {
  //   tag.addEventListener('click', function() {
  //     // 이전 선택 해제
  //     document.querySelector('.category-tag.active')?.classList.remove('active');
  //     // 새로운 선택 표시
  //     this.classList.add('active');
  //     // 선택된 카테고리 저장
  //     selectedCategory = this.textContent;
      
  //     // 검색 결과가 표시된 상태라면 필터링 적용
  //     if (!document.getElementById('resultSection').classList.contains('hidden')) {
  //       filterResults(category1, category2, input_txt);
  //     }
  //   });
  // });

  // 검색 결과 필터링 함수
  function filterResults(category, category2, input_txt) {
  const resultItems = Array.from(document.querySelectorAll('.list-item'));
  // 모든 아이템 페이드 아웃
  // 그전 검색했던 건 사라지게 한다. 
  resultItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
  });

  // 필터링 적용 및 페이드 인
  // 새로운 카테고리 해당 모임 display
  setTimeout(() => {

    // Category1 선택값에 따른 정렬 

    const filteredItems = resultItems.filter((item) => {
      const itemCategory = item.querySelector('.tag').textContent.toLowerCase();
      const itemTitle = item.querySelector('.item-title')?.textContent.toLowerCase();

      const matchCategory = category === '전체' || itemCategory === category.toLowerCase();
      const matchTitle = itemTitle.includes(input_txt);

      return matchCategory && matchTitle;
    });

    // Category2 선택값에 따른 정렬 
    // Category2: 최신순(create_at)
    const sortOption = category2; 
      if (sortOption === '최신순') {
        filteredItems.sort((a, b) => {
        const dateA = new Date(a.dataset.created);
        const dateB = new Date(b.dataset.created);
        return dateB - dateA;
      });
    } 
    // Category2: 마감일순 (임박한 순)
    else if (sortOption === '마감순') {
      filteredItems.sort((a, b) => {
      // 마감일 텍스트에서 날짜 정보만 추출해서 Date 객체로 변환
      const getDeadlineDate = (item) => {
        const dateText = item.querySelector('.bi-calendar-event').parentElement.textContent.trim();
        const match = dateText.match(/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{2})/);
        if (!match) return new Date(8640000000000000); // 날짜 없으면 아주 먼 미래로 처리

        const now = new Date();
        const [, month, day, hour, minute] = match.map(Number);
        return new Date(now.getFullYear(), month - 1, day, hour, minute);
      };

      const dateA = getDeadlineDate(a);
      const dateB = getDeadlineDate(b);

      return dateA - dateB;
      });
    }
    // Category2: 참여자순 (많은 순)
    else if (sortOption === '참여자순') {
        filteredItems.sort((a, b) => {
          const getParticipants = (item) => {
          const text = item.querySelector('.bi-person-fill').parentElement.textContent.trim(); // "3/10" 같은 문자열
          const match = text.match(/(\d+)\s*\/\s*(\d+)/);
          if (!match) return 0;
            return Number(match[1]); // 현재 참여자 수 반환
          };
        return getParticipants(b) - getParticipants(a); // 참여자 많은 순서
        });
      } 
    // Category2: 모집인원순 (많은 순)
    else if (sortOption === '모집인원순') {
        filteredItems.sort((a, b) => {
          const getMaxMembers = (item) => {
          const text = item.querySelector('.bi-person-fill').parentElement.textContent.trim(); // "3/10" 같은 문자열
          const match = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (!match) return 0;
        return Number(match[2]); // 모집인원 수 반환
      };
      return getMaxMembers(b) - getMaxMembers(a); // 모집 인원 많은 순서
      });
    }

    const container = document.querySelector('.list-layout');
    
    // 먼저 전체 숨김 처리
    resultItems.forEach(item => {
      item.style.display = 'none';
    });

    // 정렬된 아이템만 순차 출력
    filteredItems.forEach((item, index) => {
      container.appendChild(item); // 이 부분이 순서를 바꿔줌
      item.style.display = 'block';
      setTimeout(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 0);
}

  document.addEventListener('DOMContentLoaded', function() {
    const searchSection = document.getElementById('searchSection');
    // SearchForm: 검색어 클릭 시 애니메이션 적용
    const searchForm = document.getElementById('searchForm');
    const resultSection = document.getElementById('resultSection');
    const categoryTags = document.getElementById('categoryTags');
    // 카테고리: 전체, MEALS, STUDY, GAME, EXERCISE
    const categoryDropdown = document.getElementById('categoryDropdown');
    // 카테고리2: 최신순, 오래된순, 참가자 많은순, 참가자 적은순
    const categoryDropdown2 = document.getElementById('categoryDropdown2');
    const categoryBtn = document.querySelector('.category-btn');
    const categoryBtn2 = document.querySelector('.category-btn2');
    
    // 검색창 관련 요소들
    const searchTitle = document.querySelector('.search-title');
    const searchBox = document.querySelector('.search-box');

    const resultContainer  = resultSection.querySelector('.container');

    // 애니메이션 전환 설정 (검색 전 카테고리 제외)
    [searchSection, searchTitle, searchBox, categoryTags].forEach(el => {
      if (el) el.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
    });

    // AJAX 페이징을 클릭 이벤트트
    function bindPaginationHandlers() {
      const paginationForms = resultContainer.querySelectorAll('.pagination form');
      paginationForms.forEach(paginationForm => {
        const btn = paginationForm.querySelector('button');
        btn.addEventListener('click', function (e) {
          e.preventDefault();

          // 페이지 번호
          const pageNum = paginationForm.dataset.page;
          if (!pageNum) return;

          const actionUrl = searchForm.getAttribute('action');
          const formData = new URLSearchParams(new FormData(searchForm));

          formData.set('category', selectedCategory);
          formData.set('sort', selectedCategory2);

          formData.set('page', pageNum);
          formData.set('ajax', '1');

          fetch(`${actionUrl}?${formData.toString()}`, {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          })
            .then(response => response.text())
            .then(html => {
              resultContainer.innerHTML = html;
              const newUrlParams = new URLSearchParams(window.location.search);
              newUrlParams.set('category', selectedCategory);
              newUrlParams.set('sort', selectedCategory2);
              newUrlParams.set('page', pageNum);
              const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
              window.history.pushState({ path: newUrl }, '', newUrl);
              bindPaginationHandlers();
            })
            .catch(err => {
              console.error('페이지네이션 AJAX 오류: ', err);
            });
        });
      });
    }

    bindPaginationHandlers();

    // 검색 전 카테고리 태그 클릭 이벤트
    document.querySelectorAll('.category-tag').forEach(tag => {
      tag.addEventListener('click', function() {
        document.querySelector('.category-tag.active')?.classList.remove('active');
        this.classList.add('active');
        selectedCategory = this.textContent;

        // hidden input 업데이트
        document.getElementById('categoryInput').value = selectedCategory;
        // 현재 검색어값 업데이트
        input_txt = searchForm.querySelector('input[name="q"]').value.trim();
        // 카테고리만 선택해도 AJAX로 결과 요청 (page를 1로 초기화)
        const actionUrl = searchForm.getAttribute('action');
        const formData = new URLSearchParams(new FormData(searchForm));
        formData.set('category', selectedCategory);
        formData.set('sort', selectedCategory2);
        formData.set('page', 1);
        formData.set('ajax', '1');
        fetch(`${actionUrl}?${formData.toString()}`, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
          .then(response => response.text())
          .then(html => {
            resultContainer.innerHTML = html;
            const newUrlParams = new URLSearchParams(window.location.search);
            newUrlParams.set('category', selectedCategory);
            newUrlParams.set('sort', selectedCategory2);
            newUrlParams.set('page', 1);
            const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            bindPaginationHandlers();
          })
          .catch(err => {
            console.error('카테고리 AJAX 오류: ', err);
          });
      });
    });

    // 검색 후 카테고리1 옵션 클릭 이벤트
    document.querySelectorAll('.category-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelector('.category-option.active')?.classList.remove('active');
        this.classList.add('active');
        selectedCategory = this.textContent;
        categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;
        categoryDropdown.classList.remove('active');

        // hidden input 업데이트
        document.getElementById('categoryInput').value = selectedCategory;
        // 현재 검색어값 업데이트
        input_txt = searchForm.querySelector('input[name="q"]').value.trim();
        // 카테고리만 선택해도 AJAX로 결과 요청 (page를 1로 초기화)
        const actionUrl = searchForm.getAttribute('action');
        const formData = new URLSearchParams(new FormData(searchForm));
        formData.set('category', selectedCategory);
        formData.set('sort', selectedCategory2);
        formData.set('page', 1);
        formData.set('ajax', '1');
        fetch(`${actionUrl}?${formData.toString()}`, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
          .then(response => response.text())
          .then(html => {
            resultContainer.innerHTML = html;
            const newUrlParams = new URLSearchParams(window.location.search);
            newUrlParams.set('category', selectedCategory);
            newUrlParams.set('sort', selectedCategory2);
            newUrlParams.set('page', 1);
            const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            bindPaginationHandlers();
          })
          .catch(err => {
            console.error('카테고리 AJAX 오류: ', err);
          });
      });
    });
    // 검색 후 카테고리2 옵션 클릭 이벤트
    document.querySelectorAll('.category-option2').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelector('.category-option2.active')?.classList.remove('active');
        this.classList.add('active');
        selectedCategory2 = this.textContent;
        categoryBtn2.innerHTML = `${selectedCategory2} <i class="bi bi-chevron-down"></i>`;
        categoryDropdown2.classList.remove('active');

        // hidden input 업데이트
        document.getElementById('sortInput').value = selectedCategory2;
        // 현재 검색어값 업데이트
        input_txt = searchForm.querySelector('input[name="q"]').value.trim();
        // 정렬만 선택해도 AJAX로 결과 요청 (page를 1로 초기화)
        const actionUrl = searchForm.getAttribute('action');
        const formData = new URLSearchParams(new FormData(searchForm));
        formData.set('category', selectedCategory);
        formData.set('sort', selectedCategory2);
        formData.set('page', 1);
        formData.set('ajax', '1');
        fetch(`${actionUrl}?${formData.toString()}`, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
          .then(response => response.text())
          .then(html => {
            resultContainer.innerHTML = html;
            const newUrlParams = new URLSearchParams(window.location.search);
            newUrlParams.set('category', selectedCategory);
            newUrlParams.set('sort', selectedCategory2);
            newUrlParams.set('page', 1);
            const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            bindPaginationHandlers();
          })
          .catch(err => {
            console.error('정렬 AJAX 오류: ', err);
          });
      });
    });

    // 카테고리1 드롭다운 토글
    categoryBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      categoryDropdown.classList.toggle('active');
      const icon = categoryDropdown.classList.contains('active') ? 'up' : 'down';
      this.querySelector('i').className = `bi bi-chevron-${icon}`;
    });
    // 카테고리2 드롭다운 토글
    categoryBtn2.addEventListener('click', function(e) {
      e.stopPropagation();
      categoryDropdown2.classList.toggle('active');
      const icon = categoryDropdown2.classList.contains('active') ? 'up' : 'down';
      this.querySelector('i').className = `bi bi-chevron-${icon}`;
    });

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
      if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('active');
        categoryBtn.querySelector('i').className = 'bi bi-chevron-down';
      }
      if (!categoryDropdown2.contains(e.target)) {
        categoryDropdown2.classList.remove('active');
        categoryBtn2.querySelector('i').className = 'bi bi-chevron-down';
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

      input_txt = this.querySelector('input').value.trim();
      // hidden input에 검색어는 따로 보관하지 않으므로 formData에서 읽음

      // 모든 전환 요소 준비
      searchSection.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
      categoryDropdown.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;
      categoryDropdown2.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`
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

          // 카테고리1 드롭다운 표시
          categoryDropdown.classList.remove('hidden');
          categoryDropdown.style.opacity = '1';
          categoryBtn.innerHTML = `${selectedCategory} <i class="bi bi-chevron-down"></i>`;

          // 카테고리2 드롭다운 표시
          categoryDropdown2.classList.remove('hidden');
          categoryDropdown2.style.opacity = '1';
          categoryBtn2.innerHTML = `${selectedCategory2} <i class="bi bi-chevron-down"></i>`;

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

          // 카테고리나 정렬, 검색어가 변경되었으니 AJAX 요청
          const actionUrl = searchForm.getAttribute('action');
          const formData = new URLSearchParams(new FormData(searchForm));
          formData.set('category', selectedCategory);
          formData.set('sort', selectedCategory2);
          formData.set('page', 1);
          formData.set('ajax', '1');

          fetch(`${actionUrl}?${formData.toString()}`, {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          })
            .then(response => response.text())
            .then(html => {
              resultContainer.innerHTML = html;
              const newUrlParams = new URLSearchParams(window.location.search);
              newUrlParams.set('category', selectedCategory);
              newUrlParams.set('sort', selectedCategory2);
              newUrlParams.set('page', 1);
              if (input_txt) newUrlParams.set('q', input_txt);
              const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
              window.history.pushState({ path: newUrl }, '', newUrl);
              bindPaginationHandlers();
            })
            .catch(err => {
              console.error('검색 AJAX 오류: ', err);
            });
        }, 100);
      });
    });

    // 검색 취소 기능 (ESC 키)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !resultSection.classList.contains('hidden')) {
        // 모든 전환 요소 준비
        searchSection.style.transition = `all ${ANIMATION.duration}ms ${ANIMATION.easing}`;
        categoryDropdown.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;
        categoryDropdown2.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;
        resultSection.style.transition = `opacity ${ANIMATION.duration}ms ${ANIMATION.easing}`;

        // 동시 전환 시작
        requestAnimationFrame(() => {
          // 결과 섹션 페이드 아웃
          resultSection.style.opacity = '0';
          
          // 드롭다운 페이드 아웃
          categoryDropdown.style.opacity = '0';
          categoryDropdown2.style.opacity = '0';
          
          // 검색창 섹션 전환
          searchSection.style.transform = 'translateY(-10px)';
          searchSection.style.opacity = '0.9';

          setTimeout(() => {
            // 결과 섹션 숨기기
            resultSection.classList.add('hidden');
            resultSection.style.display = 'none';
            
            // 드롭다운 숨기기
            categoryDropdown.classList.add('hidden');
            categoryDropdown2.classList.add('hidden');
            
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
    
    searchTitle.addEventListener('click', () => {
    if (searchTitle.classList.contains('small')) {
        window.location.reload();
      }
    });

  });
