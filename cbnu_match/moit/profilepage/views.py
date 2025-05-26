from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def profilepage(request):
    return render(request, 'profilepage/profile.html')

def edit_profile(request):
    return render(request, 'profilepage/edit_profile.html')
