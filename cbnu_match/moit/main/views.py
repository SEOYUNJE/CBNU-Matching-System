from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet
import random

def mainpage(request):
    meets = list(Meet.objects.all())
    categories = [
        ("study", "book.svg"),
        ("game", "gamepad.svg"),
        ("exercise", "tennis.svg"),
        ("meals", "meal.svg"),
    ]
    
    meet_study = Meet.objects.filter(category='STUDY')
    meet_game = Meet.objects.filter(category='GAME')
    meet_meals = Meet.objects.filter(category='MEALS')
    meet_exercise = Meet.objects.filter(category='EXERCISE')
    
    # 카테고리 별 사진(1~5 임의로 선정)
    rd_num = random.randint(1, 5)

    authentic = request.user.is_authenticated

    return render(request, 'main/mainpage.html', {
        'meet_study': meet_study,
        'meet_game': meet_game,
        'meet_meals': meet_meals,
        'meet_exercise': meet_exercise,
        'categories': categories,
        'authentic': authentic,
        'rd_num': rd_num,
    })