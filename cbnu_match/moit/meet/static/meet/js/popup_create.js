/* 2025-05-16 */
/* 모임 생성 팝업창 + 로그인 안내 */
/* 작성자: 최은재 */

ddocument.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalOverlay');
  const loginPrompt = document.getElementById('loginPrompt');
  const openBtn = document.querySelector('.create-btn');
  const closeBtn = document.getElementById('closeModal');
  const closeLoginBtn = document.getElementById('closeLoginPrompt');
  const loginBtn = document.getElementById('goToLogin');

  // Django 템플릿에서 렌더링한 로그인 여부
  const isLoggedIn = window.isLoggedIn || false;

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
    const date = document.querySelector('[name="deadline"]').value;
    const maxMember = document.querySelector('[name="max_member"]').value;
    const intro = document.querySelector('[name="meet_introduce"]').value.trim();

    if (!title || !category || !date || !maxMember || !intro) {
      alert("모든 필드를 빠짐없이 입력해주세요.");
      return;
    }

    if (!isLoggedIn) {
      modal.classList.remove('show');
      loginPrompt.classList.add('show');
      return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch('/create_meet/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrfToken
      },
      body: new URLSearchParams({
        title,
        category,
        deadline: date,
        max_member: maxMember,
        meet_introduce: intro
      })
    })
    .then(response => {
      if (response.ok) return response.text();
      else throw new Error("모임 생성 실패");
    })
    .then(data => {
      alert(`${data}님이 모임을 생성했습니다.`);
      modal.classList.remove('show');
    })
    .catch(err => {
      console.error(err);
      alert("에러가 발생했습니다.");
    });
  });

  // [로그인 하러 가기] 클릭 → 로그인 페이지로 이동 (리디렉션 포함)
  loginBtn.addEventListener('click', () => {
    const currentUrl = window.location.pathname;
    const redirectUrl = `/Login/login.html?next=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  });
});
