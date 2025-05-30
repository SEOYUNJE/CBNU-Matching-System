from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from meet.models import Meet

def mainpage(request):
    meets = Meet.objects.all()
    categories = [
        ("study", "book.svg"),
        ("game", "gamepad.svg"),
        ("exercise", "tennis.svg"),
        ("meals", "meal.svg"),
    ]
    
    authentic = request.user.is_authenticated
    
    return render(request, 'main/mainpage.html', {
        'meets': meets,
        'categories': categories,
        
    })
