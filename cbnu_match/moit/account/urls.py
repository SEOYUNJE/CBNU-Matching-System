from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    
    path('signin/', signin, name='signin'),
    path("find_id/", find_login, name = "find_id"),
    
    # 비밀번호 재설정
    path('check_userinfo/', check_userinfo, name = 'check_userinfo'),
    path('reset_password/', reset_password, name = 'reset_password'),

    path('logout/', logout_view, name='logout'),

    # 회원가입 밑에 있는 path는 회원가입할 때 사용
    path('signup/', signup, name='signup'),
    path('check_id/', check_id, name='check_id'),
    path('check_password/', check_password, name='check_password'),
    path('check_email/', check_email, name='check_email'),
    path('create_profile/', edit_profile, name='create_profile'),
]