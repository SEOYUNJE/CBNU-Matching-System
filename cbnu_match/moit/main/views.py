from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet
import random
from random import shuffle

def mainpage(request):
    categories = [
        ("study", "book.svg"),
        ("game", "gamepad.svg"),
        ("exercise", "tennis.svg"),
        ("meals", "meal.svg"),
    ]
    
    categories = Meet.objects.values_list('category', flat=True).distinct()
    selected_meets = []

    for cat in categories:
        qs = Meet.objects.filter(category=cat).order_by('?')
        meet = qs.first()
        if meet:
            selected_meets.append(meet)

    # 4개 뽑았으니 1개 더 뽑기 (중복 카테고리 가능)
    extra_qs = Meet.objects.exclude(id__in=[m.id for m in selected_meets]).order_by('?')
    extra_meet = extra_qs.first()
    if extra_meet:
        selected_meets.append(extra_meet)

    shuffle(selected_meets)
    moit_list = selected_meets[:5]

    authentic = request.user.is_authenticated

    return render(request, 'main/mainpage.html', {
        'moit_list': moit_list,
        'categories': categories,
        'authentic': authentic,
    })