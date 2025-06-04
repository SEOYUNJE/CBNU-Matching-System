from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet
from account.models import Profile
from django.db.models import Count, F, ExpressionWrapper, IntegerField

def exercise(request):

    # 'EXERCISE' 카테고리 필터링
    meet_queryset = Meet.objects.filter(category='EXERCISE').order_by('-id')
    meet_time = Meet.objects.filter(category='EXERCISE').order_by('deadline')[:4]
    meet_member = (
    Meet.objects
    .filter(category='EXERCISE')
    .annotate(participant_count=Count('participant'))
    .annotate(
        remaining=ExpressionWrapper(
            F('max_member') - F('participant_count'),
            output_field=IntegerField()
        )
    )
    .order_by('remaining')[:4]
)

    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(meet_queryset, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp

    return render(request, 'subpage/subpage_exercise.html', {
        'page_obj': page_obj,
        'meet_time': meet_time,
        'meet_member': meet_member,
        'manner_temp': manner_temp,
    })

def study(request):
    
    # 'STUDY' 카테고리 필터링
    meet_queryset = Meet.objects.filter(category='STUDY').order_by('-id')
    meet_time = Meet.objects.filter(category='STUDY').order_by('deadline')[:4]
    meet_member = (
    Meet.objects
    .filter(category='STUDY')
    .annotate(participant_count=Count('participant'))
    .annotate(
        remaining=ExpressionWrapper(
            F('max_member') - F('participant_count'),
            output_field=IntegerField()
        )
    )
    .order_by('remaining')[:4]
    )

    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(meet_queryset, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp

    return render(request, 'subpage/subpage_study.html', {
        'page_obj': page_obj,
        'meet_time': meet_time,
        'meet_member': meet_member,
        'manner_temp': manner_temp,
    })

def game(request):
    
    # 'GAME' 카테고리 필터링
    meet_queryset = Meet.objects.filter(category='GAME').order_by('-id')
    meet_time = Meet.objects.filter(category='GAME').order_by('deadline')[:4]
    meet_member = (
    Meet.objects
    .filter(category='GAME')
    .annotate(participant_count=Count('participant'))
    .annotate(
        remaining=ExpressionWrapper(
            F('max_member') - F('participant_count'),
            output_field=IntegerField()
        )
    )
    .order_by('remaining')[:4]
    )

    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(meet_queryset, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp

    return render(request, 'subpage/subpage_game.html', {
        'page_obj': page_obj,
        'meet_time': meet_time,
        'meet_member': meet_member,
        'manner_temp': manner_temp,
    })

def meals(request):
    
    # 'MEALS' 카테고리 필터링
    meet_queryset = Meet.objects.filter(category='MEALS').order_by('-id')
    meet_time = Meet.objects.filter(category='MEALS').order_by('deadline')[:4]
    meet_member = (
    Meet.objects
    .filter(category='MEALS')
    .annotate(participant_count=Count('participant'))
    .annotate(
        remaining=ExpressionWrapper(
            F('max_member') - F('participant_count'),
            output_field=IntegerField()
        )
    )
    .order_by('remaining')[:4]
    )

    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(meet_queryset, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp

    return render(request, 'subpage/subpage_meals.html', {
        'page_obj': page_obj,
        'meet_time': meet_time,
        'meet_member': meet_member,
        'manner_temp': manner_temp,
    })