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

// 빈칸을 검사하는 함수
function isEmpty(element) {
    const value = element.value;
    return value.trim() === "";
}

document.addEventListener('DOMContentLoaded', async () => {
  const profile_Image=document.getElementById('profile_Image');
  const photo_FileInput=document.getElementById('photo_FileInput');
  const nickname_Input=document.getElementById('nickname_Input');
  const gender_Input=document.getElementById('gender_Select')
  const mbti_Select=document.getElementById('mbti_Select');
  const college_Select=document.getElementById('college_Select');
  const selfIntroduce_Textarea=document.getElementById('selfIntroduce_Textarea');
  const submit_Button=document.getElementById('submit_Button');
  const editProfile_Form=document.getElementById('editProfile_Form');
  // 사용자 프로필 정보 요청 및 처리
  try {
    const response = await fetch('/account/get_profileInfo_api/');
    const data = await response.json()
    if(data.code === 'Successed') {
        nickname_Input.value = data.nickname;
        gender_Input.value = data.gender;
        mbti_Select.value = data.mbti;
        //grade_Display.value = data.grade;
        college_Select.value = data.college;
        selfIntroduce_Textarea.value = data.self_introduce;
        profile_Image.src=data.profileImageURL;
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

  editProfile_Form.addEventListener('submit', async function(e)  {
    e.preventDefault();
    console.log('실행됨');
    submit_Button.disabled=true;

    const editProfile_FormData=new FormData();

    const data = {
      nickname: nickname_Input.value.trim(),
      gender: gender_Input.value,
      mbti: mbti_Select.value,
      college: college_Select.value,
      selfIntroduce: selfIntroduce_Textarea.value,
      profileImage: photo_FileInput.files[0],
    }

    Object.entries(data).forEach(([key, value]) => {
      editProfile_FormData.append(key, value);
    });

    try {
      const response = await fetch('/account/create_profile_api/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: editProfile_FormData,
      });

      const data = await response.json();

      if (data.code === 'Successed') {
          window.location.replace('/account/profile_view');
          console.log('설동ㅇ');
      } 
      else {
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
