# meet/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.http import JsonResponse
import json
    
def create_meet(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get('title')
            category = data.get('category')
            deadline = data.get('deadline')
            max_member = data.get('max_member')
            meet_introduce = data.get('meet_introduce')

            # 새로운 Meet Data 생성
            meet = Meet.objects.create(
                user=request.user,
                title=title,
                category=category,
                deadline=deadline,
                max_member=max_member,
                meet_introduce=meet_introduce,
            )
            # 방장도 참여자에 포함시킨다
            meet.participant.add(request.user)
            return JsonResponse({'message': '모임 생성 성공'})
        except Exception as e:
            print('==========================================')
            print(e)
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': '잘못된 요청'}, status=400)


    
def join_meet(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            meet_id = data.get('meet_id')

            # meet_id에 해당하는 모임 가져오기
            meet = Meet.objects.get(id=meet_id)

            # 1) 방장은 참가자로 추가할 수 없음
            if meet.user == request.user:
                return JsonResponse({'error': '방장은 참가자로 추가할 수 없습니다.'}, status=403)

            # 2) 마감일이 지났으면 참가 불가
            if meet.deadline < timezone.now():
                return JsonResponse({'error': '모임 마감일이 지나 참가할 수 없습니다.'}, status=403)

            # 3) 참가자가 이미 최대 인원수이면 참가 불가
            max_member_str = meet.max_member  # '5명'
            max_member_num = int(max_member_str.replace('명', ''))  # 5로 변환
            if meet.participant.count() >= max_member_num:
                return JsonResponse({'error': '모임 인원이 모두 찼습니다.'}, status=403)
            
            # 4) 이미 참여한 모임인지 체크
            if meet.participant.filter(id=request.user.id).exists():
                return JsonResponse({'error': '이미 참여한 모임방입니다.'}, status=403)


            # 참가자 추가
            meet.participant.add(request.user)
            meet.save()

            return JsonResponse({'message': '모임 참가가 성공적으로 이루어졌습니다.'})

        except Meet.DoesNotExist:
            return JsonResponse({'error': '존재하지 않는 모임입니다.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': '잘못된 요청'}, status=400)