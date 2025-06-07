from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_view, name='chat_view'),
    path('get_meet_api/', views.GetMeetList.as_view(), name='get_meet_api'),
    path('get_chat_api/', views.GetChat.as_view(), name='get_chat_api'),
    path('send_message_api/', views.SendMessage.as_view(), name='send_message_api'),
    # path('get_meet_api/', views.get_meet_api, name='get_meet_api'),
    # path('get_chattingRoomData_api/', views.get_chattingRoomData_api, name='get_chattingRoomData_api'),
]
