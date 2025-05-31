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

document.addEventListener('DOMContentLoaded', function (e) {
    // ======= 요소 선택 =======
    const id_Input = document.getElementById('id_Input');
    const checkId_Button = document.getElementById('checkId_Button');
    const id_Message = document.getElementById('id_Message');
    const password_Input = document.getElementById('password_Input');
    const password_Message = document.getElementById('password_Message');
    const checkPassword_Input = document.getElementById('checkPassword_Input');
    const checkPassword_Message = document.getElementById('checkPassword_Message');
    const firstName_Input = document.getElementById('firstName_Input');
    const lastName_Input = document.getElementById('lastName_Input');
    const name_Message = document.getElementById('name_Message');
    const email_Input = document.getElementById('email_Input');
    const email_Message = document.getElementById('email_Message');
    const signup_Button = document.getElementById('signup_Button');
    const signup_Form = document.getElementById('signup_Form');

    if (!signup_Button) {
        console.warn('signup_Button 요소가 없습니다.');
        return;
    }

    // ======= 입력 상태 플래그 =======
    let isIdValid = false;
    let isEmailValid = false;
    let isPasswordValid = false;
    let isCheckPasswordValid = false;
    let isNameValid = false;

    id_Input.focus();  // 첫 포커스는 아이디

    // ======= 모든 입력이 유효할 때 버튼 활성화 =======
    function checkAllValid() {
        if (isIdValid && isEmailValid && isPasswordValid && isCheckPasswordValid && isNameValid) {
            console.log(isIdValid + isEmailValid + isCheckPasswordValid + isPasswordValid + isNameValid);
            signup_Button.disabled = false;
            console.log('✅ 모든 입력 유효');
        } else {
            console.log(isIdValid + isEmailValid + isCheckPasswordValid + isPasswordValid + isNameValid);
            signup_Button.disabled = true;
        }
    }

    // 필드의 오류나 추가 정보 표시
    function InfoMessage_On(element, error, isError=true) {
        element.style.color = isError ? 'red' : 'green';
        element.style.whiteSpace = 'pre-line';
        element.textContent = error;
        element.style.display = 'block';
    }

    // 필드의 추가 정보 삭제
    function InfoMessage_Off(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    // ======= 아이디 입력 검사 =======
    id_Input.addEventListener('input', () => {
        // 한글 입력 제한
        id_Input.value = id_Input.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');

        isIdValid = false;
        const id = id_Input.value.trim();

        // 빈칸 검사
        if (!id) {
            checkId_Button.disabled = true;
            InfoMessage_On(id_Message, '아이디를 영어로 입력하세요.');
        } else {
            checkId_Button.disabled = false;
            InfoMessage_Off(id_Message);
        }
    });

    // ======= 아이디 중복 확인 요청 =======
    checkId_Button.addEventListener('click', async () => {
        const id = id_Input.value.trim();

        try {
            const res = await fetch('/account/check_id_api/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ username: id })
            });

            const data = await res.json();

            if (data.code === 'Successed') {
                isIdValid = true;
                id_Input.readOnly = true;
                checkId_Button.disabled = true;
                password_Input.focus();
                InfoMessage_On(id_Message, '사용 가능한 아이디입니다.', false);
            } else if (data.code === 'Failed') {
                isIdValid = false;
                const message = Array.isArray(data.message)
                    ? data.message.join('\n')
                    : data.message || '유효하지 않은 아이디입니다.';
                InfoMessage_On(id_Message, message);
                id_Input.focus();
            } else {
                throw new Error(data.message || '서버 오류!');
            }

        } catch (error) {
            isIdValid = false;
            const message = typeof error === 'string'
                ? error
                : error?.message || '에러가 발생했습니다.';
            InfoMessage_Off(id_Message, message);
            console.error('에러:', error);
        }
    });

    // ======= 비밀번호 입력 후 서버 유효성 검사 =======
    password_Input.addEventListener('blur', async () => {
        const id = id_Input.value.trim();
        const password = password_Input.value.trim();

        try {
            const res = await fetch('/account/check_password_api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ username: id, password: password })
            });

            const data = await res.json();

            if (data.code === 'Successed') {
                isPasswordValid = true;
                InfoMessage_Off(password_Message);
            } else if (data.code === 'Failed') {
                isPasswordValid = false;
                const message = Array.isArray(data.message)
                    ? data.message.join('\n')
                    : data.message || '유효하지 않은 비밀번호입니다.';
                InfoMessage_On(password_Message, message);
            } else {
                isPasswordValid = false;
                throw new Error(data.message || '서버 오류!');
            }

        } catch (error) {
            isPasswordValid = false;
            const message = typeof error === 'string'
                ? error
                : error?.message || '에러가 발생했습니다.';
            InfoMessage_Off(password_Message, message);
            console.error('에러:', error);
        }

        checkAllValid(); // 항상 실행 (성공/실패/에러 여부와 관계없이)
    });


    // ======= 비밀번호 실시간 유효성 검사 =======
    password_Input.addEventListener('input', () => {
        isPasswordValid = false;
        if (password_Input.value.trim() === '') {
            InfoMessage_On(password_Message, '비밀번호를 입력하세요.');
        } else {
            InfoMessage_Off(password_Message);
        }
        checkAllValid();
    });

    // ======= 비밀번호 확인 일치 검사 =======
    checkPassword_Input.addEventListener('input', () => {
        const password = password_Input.value.trim();
        if (checkPassword_Input.value.trim() === password) {
            InfoMessage_Off(checkPassword_Message);
            isCheckPasswordValid = true;
        } else {
            InfoMessage_On(checkPassword_Message, '비밀번호가 일치하지 않습니다.');
            isCheckPasswordValid = false;
        }
        checkAllValid();
    });

    // ======= 이름 + 성 입력 유효성 검사 =======
    function validateNameFields() {
        const firstName = firstName_Input.value.trim();
        const lastName = lastName_Input.value.trim();
        if (firstName && lastName) {
            isNameValid = true;
            InfoMessage_Off(name_Message);
        } else {
            isNameValid = false;
            InfoMessage_On(name_Message, !firstName ? '이름을 입력하세요.' : '성을 입력하세요.');
        }
        checkAllValid();
    }

    firstName_Input.addEventListener('input', validateNameFields);
    lastName_Input.addEventListener('input', validateNameFields);

    // ======= 이메일 유효성 검사 (서버 요청) =======
    email_Input.addEventListener('input', async () => {
        const email = email_Input.value.trim();

        try {
            const res = await fetch('/account/check_email_api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ email: email })
            });

            const data = await res.json();

            if (data.code === 'Successed') {
                isEmailValid = true;
                InfoMessage_Off(email_Message);
            } else if (data.code === 'Failed') {
                isEmailValid = false;
                const message = Array.isArray(data.message)
                    ? data.message.join('\n')
                    : data.message || '유효하지 않은 이메일입니다.';
                InfoMessage_On(email_Message, message);
            } else {
                throw new Error(data.message || '알 수 없는 응답입니다.');
            }

        } catch (error) {
            isEmailValid = false;
            const message = typeof error === 'string'
                ? error
                : error?.message || '서버 오류가 발생했습니다.';
            InfoMessage_On(email_Message, message);
            console.error('이메일 검사 중 오류:', error);
        }
        checkAllValid();
    });

    signup_Form.addEventListener('submit', async function (e) {
        e.preventDefault();

        signup_Button.disabled = true;

        try {
            const response = await fetch('/account/signup_api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    username: id_Input.value.trim(),
                    password: password_Input.value.trim(),
                    first_name: firstName_Input.value.trim(),
                    last_name: lastName_Input.value.trim(),
                    email: email_Input.value.trim(),
                })
            });

            const data = await response.json();

            if (data.code === 'Successed') {
                alert('회원가입 및 로그인 성공!');
                window.location.replace = '/account/create_profile_view/'; // 성공 시 리디렉션
            } else {
                const messages = Array.isArray(data.message)
                    ? data.message.join('\n')
                    : data.message || '알 수 없는 오류가 발생했습니다.';
                alert(messages);
                signup_Button.disabled = false;
            }
        } catch (error) {
            const message = typeof error === 'string'
                ? error
                : error?.message || '서버 오류가 발생했습니다.';
            alert(message);
            signup_Button.disabled = false;
            console.error('회원가입 중 에러:', error);
        }
    });
});
