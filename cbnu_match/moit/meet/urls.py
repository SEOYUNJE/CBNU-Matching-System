from django.urls import path
from .views import *

urlpatterns = [
    # localhost:8000/meet
    #path("subpage/study")
    #path("subpage/game")
    #path("subpage/exercise")
    #path("subpage/meals")
    #path("research")
    
    path("create_meet/", create_meet, name='create_meet'),
    path("join_meet/<int:meet_id>", join_meet, name='join_meet')
]
