function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('preview').src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function useDefaultImage() {
  document.getElementById('preview').src = 'default_profile.png'; // 기본 이미지로 되돌림
  document.getElementById('profile-img-upload').value = ''; // 파일 입력 초기화
}