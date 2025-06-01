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
    
    # 카테고리 별 사진
    meets_image = {
        "study": [f"study{i}.jpg" for i in range(1, 6)],
        "game": [f"game{i}.jpg" for i in range(1, 6)],
        "exercise": [f"exercise{i}.jpg" for i in range(1, 6)],
        "meals": [f"meals{i}.jpg" for i in range(1, 6)],
    }


    selected_meets = {}
    for cat in meets_image.keys():
        cat_meets = [m for m in meets if m.category.lower() == cat]
        if cat_meets:
            selected_meets[cat] = {
                "meet": random.choice(cat_meets),
                "image": random.choice(meets_image[cat]),
            }

    authentic = request.user.is_authenticated

    return render(request, 'main/mainpage.html', {
        'meets': meets,
        'categories': categories,
        'authentic': authentic,
        'selected_meets': selected_meets,
    })