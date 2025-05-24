from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/profilepage/
    path('', profilepage, name='profilepage'),
]