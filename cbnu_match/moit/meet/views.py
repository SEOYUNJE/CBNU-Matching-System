# meet/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
import json

# def subpage(request):
#     return render(request, 'subpage/subpage_ver2.html')
    
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
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': '잘못된 요청'}, status=400)

###############################

# Create your views here.
# @login_required
# def create_meet(request):
    
#     if request.method == 'POST':
        
#         form = CreateMeetForm(request.POST)
#         if form.is_valid():
#             meet = Meet(
#                     user=request.user,
#                     title=form.cleaned_data['title'],
#                     category=form.cleaned_data['category'],
#                     deadline=form.cleaned_data['deadline'],
#                     max_member=form.cleaned_data['max_member'],
#                     meet_introduce=form.cleaned_data['meet_introduce']
#                 )
#             meet.save()
#             meet.participant.add(request.user)
            
#             # 최종 목적지: 마이 페이지 내 채팅방 
            
#             #return redirect('main', username)
#             return HttpResponse(request.user.username)
#         else:
#             return render(request, 'create_meet.html', {'form': form})
#     else:
#         form = CreateMeetForm()
#         return render(request, 'create_meet.html', {'form': form}) 
    
# @login_required
# def join_meet(request, meet_id):
    
#     meet = Meet.objects.get(meet_id = meet_id)
    
#     return render(request, "join_meet.html", {'meet': meet})    