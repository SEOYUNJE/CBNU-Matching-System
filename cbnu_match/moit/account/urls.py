from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    path("login/", login_view, name="login"),
    path("signup/", signup, name = "signup"),
    path("find_login/", find_login, name = "find_login"),
    path('password_check/', password_check, name = 'password_check'),
    path('password_reset/', password_reset, name = 'password_reset'),
    path("profile/<str:username>", profile, name= 'profile'),
]