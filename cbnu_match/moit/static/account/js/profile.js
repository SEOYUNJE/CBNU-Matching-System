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

document.addEventListener('DOMContentLoaded', async () => {
    const nickname_Display = document.getElementById('nickname_Display');
    const gender_Display = document.getElementById('gender_Display');
    const mbti_Display = document.getElementById('mbti_Display');
    const grade_Display = document.getElementById('grade_Display');
    const college_Display = document.getElementById('college_Display');
    const selfIntroduce_Display = document.getElementById('selfIntroduce_Display');
    const profileImage_Display = document.getElementById('profileImage_Display');

    try {
        const response = await fetch('/account/get_profileInfo_api/');
        const data = await response.json()
        console.log(data.profileImageURL);
        if(data.code === 'Successed') {
            nickname_Display.value = data.nickname;
            gender_Display.value = data.gender;
            mbti_Display.value = data.mbti;
            grade_Display.value = data.grade;
            college_Display.value = data.college;
            selfIntroduce_Display.value = data.self_introduce;
            profileImage_Display.src=data.profileImageURL;
        } else {
            throw new Error(data.error)
        }
    }
    catch(error) {
        const message = typeof error === 'string'
            ? error
            : error?.message || '서버 오류가 발생했습니다.';
        alert(message);
    }
})