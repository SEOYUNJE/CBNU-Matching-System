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

def main(request):
    return HttpResponse("안녕하세요")

def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            user.save()
            login(request,user)
            return HttpResponseRedirect(reverse('main'))
        else:
            return render(request, 'index.html', {'error': 'Invalid username or password'})
    else:
        return render(request, 'index.html')
    
def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password"],
            )
            return redirect("profile", username=user.username)
        else:
            return render(request, "signup.html", {'form': form})
    else:
        form = SignupForm()
        return render(request, "signup.html", {'form': form})

    
def profile(request, username):
    if request.method == 'POST':
        form= ProfileForm(request.POST, request.FILES)
        if form.is_valid(): # form 유효성 검사(필수 사항 작성 여부 확인)
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            
            profile.nickname = form.cleaned_data['nickname']
            profile.mbti = form.cleaned_data['mbti']
            profile.gender = form.cleaned_data['gender']
            profile.age = form.cleaned_data['age']
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
            return render(request, 'profile.html', {'form': form, 'errors': form.errors, 'username': username})     
    else:
        form = ProfileForm()
        return render(request, 'profile.html', {'form': form, 'username': username})