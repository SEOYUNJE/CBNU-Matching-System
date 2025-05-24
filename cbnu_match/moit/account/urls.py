from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    
    # login_view: 사용자 인증 후, login한 user 정보 session에 저장
    # 오류 발생시 message: 아이디 또는 비밀번호가 잘못되었습니다.
    path("login/", login_view, name="login"),
    
    # logout_view: session 내 loing 된 user 정보 삭제
    path('logout/', logout_view, name='logout'),
    
    # signup: 새로운 user 생성 후 DB에 저장
    # 오류 발생 case(아이디 중복, 비밀번호 일치x, 비밀번호 유효성 검사)
    # 이후, profile 이동(이때 username을 전달한다)
    path("signup/", signup, name = "signup"),
    
    # 이메일, 성, 이름 입력 성공 시 username 전달
    path("find_login/", find_login, name = "find_login"),

    # 아이디, 성, 이름 입력 성공 시 새 비밀번호 설정으로 이동(이때 username값 전달)
    path('password_check/', password_check, name = 'password_check'),
    
    # 이때 입력받은 새 비밀번호 말고 그전에 받았던 username도 전달해줘야 함
    # 비밀번호 재설정 한 이후 DB에 저장
    path('password_reset/', password_reset, name = 'password_reset'),
    
    # 프로필 DB 저장 
    path("profile/<str:username>", profile, name= 'profile'),
]