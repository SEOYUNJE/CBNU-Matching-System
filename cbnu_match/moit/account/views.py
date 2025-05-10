from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import auth
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User

def signup(request):
    ## request.method는 크게 두가지(POST, GET)
    ## 로그인 처럼 개인정보는 POST형태로 외부로 알려지지 않게 한다. 
    if request.method == 'POST':
        ## 비빌번호가 일치하는지 확인한다 
        if request.POST['password'] == request.POST['password_check']:
            ## Create and save a user with the given username, email, and password.
            user = User.objects.create_user(
                username = request.POST['username'],
                password=request.POST['password'],
                email=request.POST['email'],
            )
            auth.login(request, user)
            return redirect('/')
        return render(request, 'signup.html')
    return render(request, 'signup.html')
        