// 한줄 소개 글자 수 실시간 체크
function checkLength(textarea) {
  const current = textarea.value.length;
  document.getElementById('counter').textContent = `${current} / 100`;
}

// 프로필 이미지 미리보기
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('profilePreview').src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

// 기본 이미지로 복원
function useDefaultImage() {
  document.getElementById('profilePreview').src = 'default_profile.png';
  document.getElementById('profileImage').value = '';
}
