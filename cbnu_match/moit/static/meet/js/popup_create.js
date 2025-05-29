/* 2025-05-16 */
/* 모임 생성 팝업창 + 로그인 안내 */
/* 작성자: 최은재 */

// CSRF 토큰을 쿠키에서 가져오는 함수
function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalOverlay');
  const loginPrompt = document.getElementById('loginPrompt');
  const openBtn = document.querySelector('.create-btn');
  const closeBtn = document.getElementById('closeModal');
  const closeLoginBtn = document.getElementById('closeLoginPrompt');
  const loginBtn = document.getElementById('goToLogin');
  const create_meet_btn = document.getElementById('create_meet_btn');
  const titleInput = document.getElementById('group-title');
  const deadlineInput = document.getElementById('group-date');
  const introduceInput = document.getElementById('group-description');

  // Django 템플릿에서 동적으로 대체 예정
  const isLoggedIn = openBtn.dataset.authentic === 'true';

  // [모임 생성] 버튼 클릭 → 팝업 열기
  // openBtn.addEventListener('click', () => {
  //   modal.classList.add('show');
  // });
  // 2025-05-28
  // 방식 변경함
  // [모임 생성] 버튼 클릭 → 로그인 여부 확인 후 팝업 결정
  openBtn.addEventListener('click', () => {
    if (!isLoggedIn) {
      // 로그인 안되어 있으면 로그인 안내 팝업만 띄움
      loginPrompt.classList.add('show');
    } else {
      // 로그인 되어 있으면 모임 생성 팝업 띄움
      modal.classList.add('show');
    }
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

  // ======= 입력 상태 플래그 =======
    let istitleValid = false;
    let isdeadlineValid = false;
    let isintroduceValid = false;

  // 유효성 검사 통과 시 버튼 활성화
  function checkAllValid() {
        if (istitleValid && isdeadlineValid & isintroduceValid) {
            create_meet_btn.disabled = false;
        } else {
            create_meet_btn.disabled = true;
        }
    }

  // 제목: 빈칸 여부
  titleInput.addEventListener('input', function () {
    istitleValid = titleInput.value.trim().length > 0;
    checkAllValid();
  });

  // 마감일: 빈칸 여부 + 과거일 경우 메시지 출력
  deadlineInput.addEventListener('input', function () {
    const deadlineValue = deadlineInput.value;
    if (!deadlineValue) {
      isdeadlineValid = false;
    }
    else {
      const deadline = new Date(deadlineValue);
      const now = new Date();
    
    if (deadline <= now) {
      isdeadlineValid = false;
      alert("마감일은 현재 시간보다 이후로 설정해주세요.");
      deadlineInput.value = ""; // 잘못된 입력 제거
    }
    else {
      isdeadlineValid = true;
    }
  }
    checkAllValid();
  });

  
  introduceInput.addEventListener('input', function () {
  const value = introduceInput.value.trim();
  const descriptionError = document.getElementById('description-error');
  
  // 1. 글자 수 검사
  if (value.length < 10) {
    descriptionError.textContent = `최소 10자 이상이어야 합니다. (현재: ${value.length}자)`;
    isintroduceValid = false;
  } 
  // 3. 통과
  else {
    descriptionError.textContent = "";
    isintroduceValid = true;
  }

  checkAllValid();
  });

  // [입장하기] 버튼 클릭 시: 유효성 검사 + 로그인 여부 확인
  document.getElementById('groupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    create_meet_btn.disabled = true;

    const title = document.querySelector('[name="title"]').value.trim();
    const category = document.querySelector('[name="category"]').value;
    const deadline = document.querySelector('[name="deadline"]').value;
    const max_member = document.querySelector('[name="max_member"]').value;
    const meet_introduce = document.querySelector('[name="meet_introduce"]').value.trim();


    

    const data = {
      title: title,
      category: category,
      deadline: deadline,
      max_member: max_member,
      meet_introduce: meet_introduce
    };

    fetch('/meet/create_meet/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
      if (data.message) {
          alert("모임이 성공적으로 생성되었습니다.");
          window.location.replace('/main/')
          } 
      else if (data.error) {
          alert(`에러: ${data.error}`);
        }
      })
      .catch(() => {
          alert("서버 오류가 발생했습니다.");
      });
    });

  // [로그인 하러 가기] 클릭 → 로그인 페이지로 이동 (리디렉션 포함)
  loginBtn.addEventListener('click', () => {
    const currentUrl = window.location.pathname;
    const redirectUrl = `../account/account.html?next=${encodeURIComponent(currentUrl)}`;
    window.location.href = redirectUrl;
  });
});
