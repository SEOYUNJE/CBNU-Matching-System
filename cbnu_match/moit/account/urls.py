from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    
    path('signin/', signin, name='signin'),
    path("find_login/", find_login, name = "find_login"),
    # 비밀번호 재설정
    path('password_check/', password_check, name = 'password_check'),
    path('password_reset/', password_reset, name = 'password_reset'),

    path('logout/', logout_view, name='logout'),

    # 회원가입 밑에 있는 path는 회원가입할 때 사용
    path('signup/', signup, name='signup'),
    path('check_id/', check_id, name='check_id'),
    path('check_password/', check_password, name='check_password'),
    path('check_email/', check_email, name='check_email'),
    path('create_profile/', edit_profile, name='create_profile'),
]