from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/main/
    path("<str:username>/", main, name="main"),
]