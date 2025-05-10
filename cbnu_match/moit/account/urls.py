from django.urls import path
from .import views

app_name = 'account'

urlpatterns = [
    # 기본 경로 : localhost:8000/account/
    path('signup/', views.signup, name = 'signup')
]