from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet
import random

def mainpage(request):
    meets = list(Meet.objects.all())

    rand_meets = random.sample(meets, k=5)

    category_images = {
        "study": [f"book_{i}.svg" for i in range(1, 6)],
        "game": [f"gamepad_{i}.svg" for i in range(1, 6)],
        "exercise": [f"tennis_{i}.svg" for i in range(1, 6)],
        "meals": [f"meal_{i}.svg" for i in range(1, 6)],
    }

    selected_images = {
        cat: random.choice(imgs)
        for cat, imgs in category_images.items()
    }

    authentic = request.user.is_authenticated

    return render(request, 'main/mainpage.html', {
        'meets': meets,
        'rand_meets': rand_meets,
        'selected_images': selected_images,
        'authentic': authentic,
    })