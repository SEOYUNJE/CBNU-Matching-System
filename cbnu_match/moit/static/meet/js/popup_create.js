/* 2025-05-16 */
/* 모임 생성 팝업창 + 로그인 안내 */
/* 작성자: 최은재 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalOverlay');
  const loginPrompt = document.getElementById('loginPrompt');
  const openBtn = document.querySelector('.create-btn');
  const closeBtn = document.getElementById('closeModal');
  const closeLoginBtn = document.getElementById('closeLoginPrompt');
  const loginBtn = document.getElementById('goToLogin');

  const isLoggedIn = false; // Django 템플릿에서 동적으로 대체 예정

  // [모임 생성] 버튼 클릭 → 팝업 열기
  openBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  // [X] 생성 팝업 닫기
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // [X] 로그인 안내 팝업 닫기
  closeLoginBtn.addEventListener('click', () => {
    loginPrompt.classList.remove('show');
  });

  // 바깥 영역 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
    if (e.target === loginPrompt) loginPrompt.classList.remove('show');
  });

  // [입장하기] 버튼 클릭 시: 유효성 검사 + 로그인 여부 확인
  document.getElementById('groupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.querySelector('[name="title"]').value.trim();
    const category = document.querySelector('[name="category"]').value;
    const date = document.querySelector('[name="end_time"]').value;
    const maxMember = document.querySelector('[name="max_member"]').value;
    const intro = document.querySelector('[name="introduction"]').value.trim();

    if (!title || !category || !date || !maxMember || !intro) {
      alert("모든 필드를 빠짐없이 입력해주세요.");
      return;
    }

    if (!isLoggedIn) {
      modal.classList.remove('show');        // 생성 팝업 닫고
      loginPrompt.classList.add('show');     // 로그인 팝업 띄우기
      return;
    }

    const data = {
      title,
      category,
      end_time: date,
      max_member: maxMember,
      introduction: intro
    };

    console.log("[DEBUG] 모임 생성 정보:", data);

    // 추후 장고 연결 예정
    // fetch('/moit/create/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-CSRFToken': csrf_token
    //   },
    //   body: JSON.stringify(data)
    // }).then(...);
  });

  // [로그인 하러 가기] 클릭 → 로그인 페이지로 이동 (리디렉션 포함)
  loginBtn.addEventListener('click', () => {
    const currentUrl = window.location.pathname;
    const redirectUrl = `../Login/login.html?next=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  });
});
