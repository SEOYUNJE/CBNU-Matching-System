from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Profile
import random
import json

def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return redirect('mainpage')
        else:
            return render(request, 'account/signin.html', {'error': '아이디 또는 비밀번호가 잘못되었습니다.'})
    else:
        return render(request, 'account/signin.html')
    
def logout_view(request):
    logout(request)
    return redirect('mainpage')
    
def find_login(request):
    if request.method == "POST":
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        
        user = User.objects.filter(first_name=first_name, last_name=last_name,
                            email=email)
        
        if user.exists():
            
            return render(request, 'account/id_find_result.html', {
                    'username': user[0].username,
                    'first_name': user[0].first_name,
                    'last_name': user[0].last_name,
                    })
        else:
            return render(request, "account/id_find.html", {'error': '입력하신 정보와 일치하는 아이디가 없습니다'})
    else:
        return render(request, "account/id_find.html")

def check_id(request):
    id = request.GET.get('id')
    validator = UnicodeUsernameValidator()
    try:
        if User.objects.filter(username = id).exists():
            raise ValidationError ('이미 존재하는 아이디입니다.', code='username_already_exists')
        print(id)
        validator(id)
        return JsonResponse({'valid': True})
    except ValidationError as e:
        return JsonResponse({'valid': False, 'error': e.messages, 'code': e.code}, status=400)

def check_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            id = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': '요청 본문이 올바른 JSON이 아닙니다.'}, status = 400)
        temp = User(username=id, password=password)
        try:
            validate_password(password, user=temp)
        except ValidationError as e:
            return JsonResponse({'error': e.messages}, status=400)
        return JsonResponse({'password': password})

def check_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
        except json.JSONDecodeError:
            return JsonResponse({'valid': False, 'error': '요청 본문이 올바른 JSON이 아닙니다.'})
        try:
            validate_email(email)
        except ValidationError as e:
            return JsonResponse({'valid': False, 'error': e.messages}, status=400)
        return JsonResponse({'valid': True})

def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'code': 'failed','error': '잘못된 요청 형식입니다.'}, status=400)
        try:
            username = data.get('username', '').strip()
            password = data.get('password', '').strip()
            email = data.get('email', '').strip()
            first_name = data.get('first_name', '').strip()
            last_name = data.get('last_name', '').strip()

            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )

            signin_user = authenticate(request, username=username, password=password)
            if signin_user is not None:
                login(request, signin_user)
            else:
                return JsonResponse({'code': 'failed', 'error': '자동 로그인에 실패했습니다.'})
        except Exception as e:
            return JsonResponse({'code': 'failed','error': f'알 수 없는 오류가 발생했습니다.{str(e)}'})
        return JsonResponse({'code': 'successed'})
    return render(request, 'account/signup.html')



def edit_profile(request):
    if request.method == 'POST':
        try:
            # 로그인 검증
            if request.user is None:
                return JsonResponse({'code': 'failed', 'error': '로그인이 필요합니다.'})
            print('로그인 검증 통과')
            # JSON 역질렬화
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'code': 'failed', 'error': '잘못된 요청 형식입니다.'}, status=400)
        target_profile = Profile.objects.get(user=request.user)

        if target_profile is None:
            return JsonResponse({'code': 'failed', 'error': '유효한 사용자가 아닙니다.'})
        
        try:
            print(data)
            if(data.get('nickname') != 'null'):
                print(data.get('nickname'))
                target_profile.nickname=data.get('nickname')
            target_profile.gender=data.get('gender')
            target_profile.mbti=data.get('mbti')
            target_profile.college=data.get('college')
            target_profile.self_introduce=data.get('self_introduce')
            target_profile.profile_img=random.choice(Profile.default_images)
            target_profile.save()
        except Exception as e:
            return JsonResponse({'code': 'failed', 'error': str(e)})
        return JsonResponse({'code': 'successed'})
    return render(request, 'account/create_profile.html')

def check_userinfo(request):
    if request.method == 'POST':
        username = request.POST['username']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        
        user = User.objects.filter(username = username,
                                first_name=first_name, last_name=last_name)
        
        if user.exists():
            return render(request, 'account/pw_new.html', {'username': username})
        else:
            return render(request, "account/pw_set.html", {'error': "입력하신 정보와 일치하는 비밀번호가 없습니다"})
        
    else:
        return render(request, "account/pw_set.html")

def reset_password(request):
    if request.method == 'POST':
        username = request.POST['username']
        new_password = request.POST['new_password']
        new_password_check = request.POST['new_password_check']
                
        user = User.objects.get(username = username)
        user.set_password(new_password)
        user.save()
            
        return redirect('signin')
    else:
        return render(request, "account/pw_new.html")