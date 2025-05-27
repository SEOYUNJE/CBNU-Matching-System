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
    e.preventDefault();
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
    let isNameValid = false;

    id_Input.focus();  // 첫 포커스는 아이디

    // ======= 모든 입력이 유효할 때 버튼 활성화 =======
    function checkAllValid() {
        if (isIdValid && isEmailValid && isPasswordValid && isNameValid) {
            signup_Button.disabled = false;
            console.log('✅ 모든 입력 유효');
        } else {
            signup_Button.disabled = true;
        }
    }

    // 필드의 오류나 추가 정보 표시
    function InfoMessage_On(element, error, isError=true) {
        element.style.color = isError ? 'red' : 'green';

        // error가 여러 개인 경우일 때 처리
        if(Array.isArray(error)) {
            console.log('실행됨');
            element.textContent = error.join('\n');
            element.style.whiteSpace = 'pre-line';
        }
        else {
            console.log('실행됨');
            element.textContent = error;
        }
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
    checkId_Button.addEventListener('click', () => {
        const id = id_Input.value.trim();
        fetch(`/account/check_id/?id=${encodeURIComponent(id)}`)
            .then(res => res.json().then(data => {
                if(!res.ok) {
                    throw new Error(data.error || '서버 오류가 발생했습니다.');
                }
                return;
            }))
            .then(() => {
                InfoMessage_On(id_Message, '사용 가능한 아이디입니다.', false);
                id_Input.readOnly = true;
                isIdValid = true;
                checkAllValid();
                password_Input.focus();
                alert('사용 가능한 아이디입니다.');
            })
            .catch(error => {
                InfoMessage_On(id_Message, error.message);
                isIdValid = false;
                id_Input.focus();
            })
    });

    // ======= 비밀번호 입력 후 서버 유효성 검사 =======
    password_Input.addEventListener('blur', () => {
        const id = id_Input.value.trim();
        const password = password_Input.value.trim();
        const checkPassword = checkPassword_Input.value.trim();

        fetch('/account/check_password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ username: id, password: password })
        })
        .then(response => response.json().then(data => {
            if (!response.ok) {
                throw data.error;
            }
            return;
        }))
        .then(() => {
            if(password === checkPassword) {
                isPasswordValid = true;
            }
            else {
                isPasswordValid = false;
            }
            checkAllValid();
            checkPassword_Input.focus();
        })
        .catch(error => {
            InfoMessage_On(password_Message, error);
            isPasswordValid = false;
            checkAllValid();
        });
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
            isPasswordValid = true;
        } else {
            InfoMessage_On(checkPassword_Message, '비밀번호가 일치하지 않습니다.');
            isPasswordValid = false;
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
    email_Input.addEventListener('input', () => {
        const email = email_Input.value.trim();
        fetch('/account/check_email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json().then(data => {
            if (!response.ok || !data.valid) {
                throw data.error
            }
        }))
        .then(() => {
            InfoMessage_Off(email_Message);
            isEmailValid = true;
            checkAllValid();
        })
        .catch(error => {
            InfoMessage_On(email_Message, error);
            isEmailValid = false;
            checkAllValid();
        });
    });


    signup_Form.addEventListener('submit', function(e) {
        e.preventDefault();

        signup_Button.disabled = true;

        console.log('실행됨');

        fetch('/account/signup/', {
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
        })
        .then(res => res.json().then(data => {
            if(!res.ok) {
                console.log(data.error);
                throw data.error;
            }
            if(data.code === 'failed') {
                throw data.error;
            }
        return;
        }))
        .then(() => {
            alert('회원가입 성공! 프로필 설정 페이지로 이동합니다.');
            window.location.replace('/account/create_profile/');
        })
        .catch(error => {
            const messages = Array.isArray(error)
                ? error.join('\n')
                : typeof error === 'string'
                ? error
                : error?.message || '서버 오류가 발생했습니다.';
            alert(messages);
            signup_Button.disabled = false;
        });

    });  
});
