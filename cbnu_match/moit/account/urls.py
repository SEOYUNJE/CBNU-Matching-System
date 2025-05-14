from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    path("", main, name='main'),
    path("login/", login, name="login"),
    path("signup/", signup, name = "signup"),
    path("profile/<str:username>", profile, name= "profile"),
]