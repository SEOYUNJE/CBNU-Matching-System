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

<<<<<<< HEAD
# 2025-05-21
# 구동 확인용
def room_by_meet_id(request, meet_id):
    return render(request, 'chat/room.html', {'room_name': f'meet_{meet_id}'})


=======
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
                "user": request.user.id,
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

# def get_meet_api(request):
#     try:
#         meets = Meet.objects.filter(participant=request.user).prefetch_related('participant')

#         meet_list = []
#         for meet in meets:
#             meet_list.append([{
#                 "id": meet.id,
#                 "title": meet.title,
#                 "user": meet.user.id,
#                 "participant": [(p.id ,Profile.objects.get(user=p).nickname) for p in meet.participant.all()],
#             }])
#         data = {
#             "code": "Successed",
#             "meet_list": meet_list,
#         }
#         print(data)
#         return JsonResponse(data)
#     except Exception as e:
#         print(e)
#         data = {
#             "code": "Failed",
#             "message": "서버 오류",
#         }
#         return JsonResponse(data)


# def get_chattingRoomData_api(request):
#     meet_id = request.GET.get('meet_id')
#     try:
#         meet = Meet.objects.get(id=meet_id)
#         profiles = Profile.objects.filter(user__in=meet.participant.all()).annotate(
#             is_me=Case(
#                 When(user=request.user, then=Value(0)),
#                 default=Value(1),
#                 output_field=IntegerField(),
#             ),
#             lower_nickname=Lower('nickname')
#         ).order_by('is_me', 'lower_nickname').values()
        
#         print('===================================')
#         print(request.user)

#         data = {
#             "code": "Successed",
#             "title": meet.title,
#             "user": request.user,
#             'participant': list(profiles)
#         }
#         return JsonResponse(data)
#     except Exception as e:
#         print(e)
#         return JsonResponse({
#             "code": "Error",
#             "message": str(e),
#         })
>>>>>>> 71a9fd5 ((refactor) chat Function)
