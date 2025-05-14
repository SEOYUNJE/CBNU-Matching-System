from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .forms import ProfileForm
from .models import Profile

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
        
        username = request.POST["username"]
        password = request.POST["password"]
        password_check = request.POST["password_check"]
        email = request.POST["email"]
        
        if password != password_check:
            return render(request, "signup.html", {"password_check_error": "비밀번호가 일치하지 않습니다."})

        try:
            # Django의 비밀번호 유효성 검사기 사용
            validate_password(password)
        except ValidationError as e:
            return render(request, "signup.html", {"password_min_error": e.messages[0]})

        user = User(username=username)

        try:
            # 비밀번호와 사용자 속성의 유사성 검사
            validate_password(password, user)
        except ValidationError as e:
            # 유사성 검사 실패 시 에러 반환
            return render(request, "signup.html", {"password_sim_error": e.messages[0]})

        # 모든 조건 만족 시 유저 생성
        User.objects.create_user(username=username, password=password, email=email)
        return redirect('profile', username=user.username)

    return render(request, "signup.html")

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
            profile.profile_img = form.cleaned_data.get('profile_img')
            
            profile.save()
            return redirect('main')
        else:
            return render(request, 'profile.html', {'form': form, 'errors': form.errors, 'username': username})     
    else:
        form = ProfileForm()
        return render(request, 'profile.html', {'form': form, 'username': username})