# meet/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .forms import * 
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def create_meet(request):
    if request.method == 'POST':
        form = CreateMeetForm(request.POST)
        if form.is_valid():
            meet = Meet(
                user=request.user,
                title=form.cleaned_data['title'],
                category=form.cleaned_data['category'],
                deadline=form.cleaned_data['deadline'],
                max_member=form.cleaned_data['max_member'],
                meet_introduce=form.cleaned_data['meet_introduce']
            )
            meet.save()
            meet.participant.add(request.user)

            # JSON 형태로 meet_id 응답
            return JsonResponse({
                'status': 'success',
                'meet_id': meet.meet_id
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': '입력값이 유효하지 않습니다.'
            }, status=400)

    return JsonResponse({
        'status': 'error',
        'message': 'POST 요청만 지원됩니다.'
    }, status=405)


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