from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    
    # 구동 확인용으로 추가
    path('room/<int:meet_id>/', views.room_by_meet_id, name='room_by_meet_id'),
]
