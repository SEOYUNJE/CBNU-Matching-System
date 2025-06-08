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
from .models import Chat, Report

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

# 신고 내용 저장(신고 사유, 신고 대상 댓글, 신고 대상 사용자)
def report_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # 신고 사유, 신고당한 사람, 댓글 
            reason = data.get('reason')
            comment = data.get('comment')
            
            report_chat = Chat.objects.get(content = comment)
            reported_user = report_chat.sender
            # 신고 이력 확인하기 
            is_duplicate = Report.objects.filter(
                reporter=request.user,
                reported_user=reported_user,
                comment=comment,
            ).exists()

            if is_duplicate:
                return JsonResponse({'error': '신고를 중복해서 할 수 없습니다.'}, status=409)

            # 이미 제재된 댓글인지 확인하기 
            approved_exist = Report.objects.filter(
                reported_user=reported_user,
                comment=comment,
                is_approved=True
            ).exists()

            if approved_exist:
                return JsonResponse({'error': '이미 신고 처리가 진행되었습니다.'}, status=409)

            # 새로운 Report Data 생성
            Report.objects.create(
                reporter=request.user,
                reported_user=reported_user,
                comment=comment,
                reason=reason,
            )

            return JsonResponse({'message': '신고가 성공적으로 접수되었습니다'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': '잘못된 요청'}, status=400)
