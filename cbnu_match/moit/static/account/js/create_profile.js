function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}
document.addEventListener('DOMContentLoaded', function() {
    const profile_Image = document.getElementById('profile_Image');
    const photo_FileInput = document.getElementById('photo_FileInput');
    const choosePhoton_Button = document.getElementById('choosePhoto_Button');
    const defaultPhoto_Button = document.getElementById('defaultPhoto_Button');
    const nickname_Input = document.getElementById('nickname_Input');
    const gender_Select = document.getElementById('gender_Select');
    const mbti_Select = document.getElementById('mbti_Select');
    const grade_Select = document.getElementById('grade_Select');
    const college_Select = document.getElementById('college_Select');
    const selfIntroduce_Text = document.getElementById('selfIntroduce_Text');
    const submit_Button = document.getElementById('createProfile_Button');
    const createProfile_Form = document.getElementById('createProfile_Form');
    
    // 기본 이미지 설정
    let selectedProfileImage_File = STATIC_URLS.defaultImage;

    // 파일 선택(숨겨져 있음)
    choosePhoton_Button.addEventListener('click', () => photo_FileInput.click());

    // 기본 파일 선택
    defaultPhoto_Button.addEventListener('click', () => {
        photo_FileInput.value = '';
        profile_Image.src = STATIC_URLS.defaultImage;
    })

    // 사용자가 원하는 사진을 선택하면 미리 보기로 보여줌!
    photo_FileInput.addEventListener('change', () => {
        const file = photo_FileInput.files[0];
        if(file && file.type.startsWith('image/')) {
            selectedProfileImage_File = photo_FileInput.files[0];
            const url = URL.createObjectURL(file);
            profile_Image.src = url;
        }
    })

    createProfile_Form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submit_Button.disabled = true;
        console.log('실행됨');

        // createProfile_Form은 json 형식으로 보내지 않고 FormData 형식으로 보냄
        const createProfile_FormData = new FormData();

        const data = {
            nickname: nickname_Input.value.trim(),
            gender: gender_Select.value,
            mbti: mbti_Select.value,
            grade: grade_Select.value,
            college: college_Select.value,
            selfIntroduce: selfIntroduce_Text.value,
            profileImage: photo_FileInput.files[0],
        }

        Object.entries(data).forEach(([key, value]) => {
            createProfile_FormData.append(key, value);
        });

        try {
            const response = await fetch('/account/create_profile_api/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
                body: createProfile_FormData,
            });
            const data = await response.json();
            console.log(data.code);
            if (data.code === 'Successed') {
                window.location.replace('/main/');
                alert('프로필 생성을 완료했습니다. 메인 페이지로 이동합니다.');
            } else {
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log(error);
            alert(error.message || '서버 오류!');
            submit_Button.disabled = false;
        }
    })
})