from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/subpage/
    path('exercise/', exercise, name='subpage_exercise'),
    path('game/', game, name='subpage_game'),
    path('meals/', meals, name='subpage_meals'),
    path('study/', study, name='subpage_study'),
]