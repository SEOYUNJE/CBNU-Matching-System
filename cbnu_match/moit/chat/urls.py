from django.urls import path
from .import views

urlpaturlpatterns = [
    # 기본 경로 : localhost:8000/chat/
    path('', views.main, name = 'main')
]
