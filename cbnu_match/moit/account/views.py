from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .forms import ProfileForm, SignupForm
from .models import Profile
import random

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return redirect('main')
        else:
            return render(request, 'account/login.html', {'error': '아이디 또는 비밀번호가 잘못되었습니다.'})
    else:
        return render(request, 'account/login.html')
    
def logout_view(request):
    logout(request)
    return redirect('main')
    
def find_login(request):
    if request.method == "POST":
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        
        user = User.objects.filter(first_name=first_name, last_name=last_name,
                            email=email)
        
        if user.exists():
            
            return render(request, 'account/config_login.html', {
                    'username': user[0].username,
                    'login_date': user[0].date_joined,
                    })
        else:
            return render(request, "account/find_login.html", {'error': 'No account was found matching the information you entered'})
    else:
        return render(request, "account/find_login.html")

def password_check(request):
    if request.method == 'POST':
        username = request.POST['username']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        
        user = User.objects.filter(username = username,
                                first_name=first_name, last_name=last_name)
        
        if user.exists():
            return render(request, 'account/reset_password.html', {'username': username})
        else:
            return render(request, "account/check_password.html", {'error': "We couldn't find a password that matches the information you provided"})
        
    else:
        return render(request, "account/check_password.html")

def password_reset(request):
    if request.method == 'POST':
        username = request.POST['username']
        new_password = request.POST['new_password']
        new_password_check = request.POST['new_password_check']
                
        if new_password == new_password_check:
            user = User.objects.get(username = username)
            user.set_password(new_password)
            user.save()
            
            return redirect('login')
        else:
            return render(request, "account/reset_password.html", {'error': "비밀번호가 일치하지 않습니다"})
        
    else:
        return render(request, "account/reset_password.html")

def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password"],
                first_name=form.cleaned_data["first_name"],
                last_name=form.cleaned_data["last_name"],
            )
            return redirect("profile", username=user.username)
        else:
            return render(request, "account/signup.html", {'form': form})
    else:
        form = SignupForm()
        return render(request, "account/signup.html", {'form': form})

    
def profile(request, username):
    if request.method == 'POST':
        form= ProfileForm(request.POST, request.FILES)
        if form.is_valid(): # form 유효성 검사(필수 사항 작성 여부 확인)
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            
            profile.nickname = form.cleaned_data['nickname']
            profile.mbti = form.cleaned_data['mbti']
            profile.gender = form.cleaned_data['gender']
            profile.grade = form.cleaned_data['grade']
            profile.college = form.cleaned_data['college']
            profile.self_introduce = form.cleaned_data['self_introduce']
            
            if form.cleaned_data.get('profile_img'):
                profile.profile_img = form.cleaned_data['profile_img']
            else:
                random_default = f"default{random.randint(1, 6)}.jpg"
                profile.profile_img = random_default
        
            profile.save()
            return redirect('login')
        else:
            return render(request, 'account/profile.html', {'form': form, 'errors': form.errors, 'username': username})     
    else:
        form = ProfileForm()
        return render(request, 'account/profile.html', {'form': form, 'username': username})