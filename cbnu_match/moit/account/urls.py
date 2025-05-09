from django.urls import path
from .import views

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    path('', views.main, name = 'main')
]