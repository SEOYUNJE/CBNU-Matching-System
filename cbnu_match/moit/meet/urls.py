from django.urls import path
from .views import *

urlpatterns = [
    # localhost:8000/meet
    path("create_meet/<str:username>", create_meet, name='create_meet')
]
