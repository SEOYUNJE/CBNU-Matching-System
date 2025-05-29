from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def exercise(request):
    
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_exercise.html', {'authentic': authentic})

def study(request):
    
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_study.html', {'authentic': authentic})

def game(request):
    
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_game.html', {'authentic': authentic})

def meals(request):
    
    authentic = request.user.is_authenticated
    
    return render(request, 'subpage/subpage_meals.html', {'authentic': authentic})