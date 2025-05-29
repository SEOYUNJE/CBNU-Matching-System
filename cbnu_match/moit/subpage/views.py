from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet

def exercise(request):
    authentic = request.user.is_authenticated

    # 'EXERCISE' 카테고리 필터링
    meet_queryset = Meet.objects.filter(category='EXERCISE').order_by('-id')

    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(meet_queryset, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'subpage/subpage_exercise.html', {
        'authentic': authentic,
        'page_obj': page_obj,
    })

def study(request):
    
    meet_list = Meet.objects.filter(category='STUDY')
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_study.html', 
                  {'authentic': authentic,
                   'meet_list': meet_list})

def game(request):
    
    meet_list = Meet.objects.filter(category='GAME')
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_game.html', 
                  {'authentic': authentic,
                   'meet_list': meet_list})

def meals(request):
    
    meet_list = Meet.objects.filter(category='MEALS')
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_meals.html', 
                  {'authentic': authentic,
                   'meet_list': meet_list})