from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Case, When, Value, IntegerField
from django.db.models.functions import Lower
from account.models import Profile
from meet.models import Meet
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from meet.serializers import MeetSerializer
from .serializers import ChatSerializer
from .models import Chat

# view 함수
def chat_view(request):
    return render(request, 'chat/chat.html')

# api 함수
# user가 참여한 meet data를 가져오는 api 함수
class GetMeetList(APIView):
    def get(self, request):
        try:
            user = request.user
            meet_list = Meet.objects.filter(participant=user).order_by('deadline')
            serializer = MeetSerializer(meet_list, many=True, context={'request': request})
            data = {
                "code": "Successed",
                "meet_list": serializer.data,
                "user": user.id,
            }
            return Response(data)
        except Exception as e:
            data = {
                "code": "Failed",
                "message": str(e),
            }
            return Response(data)
        
class GetChat(APIView):
    def get(self, request):
        try:
            meet_id = request.GET.get('meet_id')
            chats = Chat.objects.filter(meet_id=meet_id).order_by('created_at')[:30]
            serializer = ChatSerializer(chats, many=True)
            data = {
                "code": "Successed",
                "data": serializer.data,
            }
            return Response(data)
        except Exception as e:
            data = {
                "code": "Failed",
                "message": str(e),
            }
            return Response(data)
        
class SendMessage(APIView):
    def post(self, request):
        try:
            data = json.load(request.body)
            meet_id = data.get('meet_id')
            message = data.get('message')


        except Exception as e:
            data = {
                'code': 'Failed',
                'message': str(e),
            }
            return Response(data)