# urls.py (meet)
from django.urls import path
from .views import * 

# from django.urls import path
# from .views import *

urlpatterns = [

    path('create_meet/', create_meet, name='create_meet'),
    path('join_meet/', join_meet, name='join_meet'),
]

