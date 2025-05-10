from django.urls import path
from .import views

app_name = 'chat'

urlpatterns = [
    # 기본 경로 : localhost:8000/chat/
    path('', views.main, name = 'main')
]
