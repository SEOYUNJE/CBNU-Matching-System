from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def exercise(request):
    return render(request, 'subpage/subpage_exercise.html')

def study(request):
    return render(request, 'subpage/subpage_study.html')

def game(request):
    return render(request, 'subpage/subpage_game.html')

def meals(request):
    return render(request, 'subpage/subpage_meals.html')