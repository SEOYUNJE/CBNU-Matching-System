function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}
document.addEventListener('DOMContentLoaded', function(e) {
    e.preventDefault();
    let nickname = 'null';

    document.getElementById('createProfile_Form').addEventListener('submit', function(e) {
        e.preventDefault();
        if(document.getElementById('nickname_Input').value !== '') {
            console.log("실행됨 요깅괴");
            console.log(document.getElementById('nickname_Input').value);
            nickname = document.getElementById('nickname_Input').value;
            console.log(nickname);
        } 

        document.getElementById('createProfile_Button').disabled = false;
        console.log(document.getElementById('college_Select').value);
        fetch('/account/create_profile/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                nickname: nickname,
                gender: document.getElementById('gender_Select').value,
                mbti: document.getElementById('mbti_Select').value,
                college: document.getElementById('college_Select').value,
                self_introduce: document.getElementById('selfIntroduce_Input').value,
            })
        })
        .then(res => res.json().then(data => {
            if(!res.ok) {
                throw data.error;
            }
            if(data.code === 'failed') {
                throw data.error;
            }
            return;
        }))
        .then(() => {
            alert('프로필 생성 성공! 메인 페이지로 이동합니다.');
            window.location.replace('/main/');
        })
        .catch(error => {
            const messages = Array.isArray(error)
                ? error.join('\n')
                : typeof error === 'string'
                ? error
                : error?.message || '서버 오류가 발생했습니다.';
            alert(messages);
        })
    })

})