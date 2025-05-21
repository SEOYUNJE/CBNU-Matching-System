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

  // Django 템플릿에서 렌더링한 로그인 여부
  const isLoggedIn = window.isLoggedIn || false;


  // [1] 모임 생성 버튼은 무조건 팝업 열림
  openBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  // [2] 팝업 닫기
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // [3] 로그인 안내 팝업 닫기
  closeLoginBtn.addEventListener('click', () => {
    loginPrompt.classList.remove('show');
  });

  // [4] 바깥 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
    if (e.target === loginPrompt) loginPrompt.classList.remove('show');
  });

  // [5] 모임 생성 폼 제출
  document.getElementById("groupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // 로그인 안 했으면 안내 팝업 띄우고 리턴
    if (!isLoggedIn) {
      modal.classList.remove('show');
      loginPrompt.classList.add('show');
      return;
    }

    // 로그인 되어 있을 경우에만 fetch 진행
    const formData = new FormData(this);

    fetch("/meet/create_meet/", {
      method: "POST",
      headers: {
        "X-CSRFToken": document.querySelector('[name=csrf-token]').content,
      },
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        const meetId = data.meet_id;
        window.location.href = `/chat/room/${meetId}/`;
      } else {
        alert("모임 생성 실패: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("서버 오류 발생");
    });
  });

  // [6] 로그인 버튼 클릭 시 로그인 페이지 이동
  loginBtn.addEventListener('click', () => {
    const currentUrl = window.location.pathname;
    const redirectUrl = `/account/login/?next=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  });
});





  // document.getElementById('groupForm').addEventListener('submit', function (e) {
  //   e.preventDefault();

  //   const title = document.querySelector('[name="title"]').value.trim();
  //   const category = document.querySelector('[name="category"]').value;
  //   const date = document.querySelector('[name="deadline"]').value;
  //   const maxMember = document.querySelector('[name="max_member"]').value;
  //   const intro = document.querySelector('[name="meet_introduce"]').value.trim();

  //   if (!title || !category || !date || !maxMember || !intro) {
  //     alert("모든 필드를 빠짐없이 입력해주세요.");
  //     return;
  //   }

  //   if (!isLoggedIn) {
  //     modal.classList.remove('show');
  //     loginPrompt.classList.add('show');
  //     return;
  //   }

  //   const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  //   fetch('/create_meet/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'X-CSRFToken': csrfToken
  //     },
  //     body: new URLSearchParams({
  //       title,
  //       category,
  //       deadline: date,
  //       max_member: maxMember,
  //       meet_introduce: intro
  //     })
  //   })
  //   .then(response => {
  //     if (response.ok) return response.text();
  //     else throw new Error("모임 생성 실패");
  //   })
  //   .then(data => {
  //     alert(`${data}님이 모임을 생성했습니다.`);
  //     modal.classList.remove('show');
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     alert("에러가 발생했습니다.");
  //   });
  // });
