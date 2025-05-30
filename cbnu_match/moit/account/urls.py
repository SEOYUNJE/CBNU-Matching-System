from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    
    path('signin/', signin, name='signin'),
    path("find_id/", find_login, name = "find_id"),
    
    # 비밀번호 재설정
    path('check_userinfo/', check_userinfo, name = 'check_userinfo'),
    path('reset_password/', reset_password, name = 'reset_password'),

    path('logout/', signout, name='signout'),

    # 회원가입 밑에 있는 path는 회원가입할 때 사용
    path('create_profile/', create_profile_view, name='create_profile_view'),
    
    # Profile Page
    path('profile/', profile_view, name='profile_view'),
    path('get_profile_info/', get_profile_info, name='get_profile_info'),
    path('profile/edit', profilepage_edit, name='edit_profile'),

    # 조인흠 수정 =========================================================
    # VIEW
    path('signup_view/', signup_view, name='signup_view'),
    path('create_profile_view/', create_profile_view, name='create_profile_view'),

    # API
    path('signup_api/', signup_api, name='signup_api'),
    path('check_id_api/', check_id_api, name='check_id_api'),
    path('check_password_api/', check_password_api, name='check_password_api'),
    path('check_email_api/', check_email_api, name='check_email_api'),
    path('create_profile_api/', create_profile_api, name='create_profile_api'),
]