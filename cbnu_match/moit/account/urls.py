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
    path('signup/', signup, name='signup'),
    path('check_id/', check_id, name='check_id'),
    path('check_password/', check_password, name='check_password'),
    path('check_email/', check_email, name='check_email'),
    path('create_profile/', profile, name='create_profile'),
    
    # Profile Page
    path('profile/', profilepage, name='profilepage'),
    path('profile/edit', profilepage_edit, name='edit_profile'),
]