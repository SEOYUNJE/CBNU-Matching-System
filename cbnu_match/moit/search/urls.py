from django.urls import path
from .views import *

urlpatterns = [
    # 기본 경로 : localhost:8000/search/
    path('', search, name='search'),
]