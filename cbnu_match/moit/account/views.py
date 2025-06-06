from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.password_validation import validate_password
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Profile
import random
import json


# 로그인
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
    
# 로그아웃
def signout(request):
    logout(request)
    return redirect('mainpage')

# 아이디 찾기
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

# 사용자 정보 확인
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

# 비밀번호 초기화
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
    
@login_required
def profilepage(request):
    
    profile = Profile.objects.get(user = request.user)
    
    return render(request, 'account/profile.html', {'profile': profile})

@login_required
def profilepage_edit(request):
    if request.method == 'POST':
        return redirect('mainpage')
    else:
        profile = Profile.objects.get(user = request.user)
        return render(request, 'account/edit_profile.html', {'profile': profile})

@login_required
def create_profile_view(request):
    return render(request, 'account/create_profile.html')

@login_required
def get_profile_info(request):
    try:
        target_profile = Profile.objects.get(user=request.user)
        return JsonResponse({
            'status': True,
            'nickname': target_profile.nickname,
            'gender': target_profile.gender,
            'mbti': target_profile.mbti,
            'grade': target_profile.grade,
            'college': target_profile.college,
            'self_introduce': target_profile.self_introduce,
        })
    except Exception as e:
        print(e)
        return JsonResponse({'status': False, 'error': str(e)})
    




# 조인흠 ================================================================
# View 함수 =============================================================
# 회원가입 html Render 함수
def signup_view(request):
    return render(request, 'account/signup.html')

# 프로필 ================================================================
# 프로필 생성 html Render 함수
def create_profile_view(request):
    return render(request, 'account/create_profile.html')

def profile_view(request):
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp
    
    return render(request, 'account/profile.html',{'manner_temp': manner_temp})

def edit_profile_view(request):
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp
        
    return render(request, 'account/edit_profile.html', {'manner_temp': manner_temp})
# API 함수 ==============================================================

# 회원가입 API ===========================================================
@require_POST
def signup_api(request):
    try:
        data = json.loads(request.body)
        
        User.objects.create_user(
            username=data['username'],
            password=data['password'],
            last_name=data['last_name'],
            first_name=data['first_name'],
            email=data['email'],
        )

        signup_user = authenticate(request, username=data['username'], password=data['password'])
        if signup_user is None:
            raise Exception('아이디와 패스워드랑 일치하는 유저가 없습니다.')
        login(request, signup_user)
        return JsonResponse({'code': 'Successed'})
    except ValidationError as e:
        return JsonResponse({'code': 'Failed', 'message': e.messages})
    except Exception as e:
        print(f'서버 오류: {e}')
        return JsonResponse({'code': 'Error', 'message': '서버 오류'})

@require_POST
def check_id_api(request):
    try:
        # 데이터 받아오기
        data = json.loads(request.body)
        id = data['username']
        
        # id Validation 가져오기
        username_validator = UnicodeUsernameValidator()
        username_validator(id)

        # id 중복 체크
        if User.objects.filter(username=id).exists():
            raise ValidationError('이미 사용 중인 아이디입니다.')
        
        # 검사 값 반환
        return JsonResponse({'code': 'Successed'})
    except ValidationError as e:
        return JsonResponse({'code': 'Failed', 'message': e.messages})
    except Exception as e:
        print(f'서버 오류: {e}')
        return JsonResponse({'code': 'error', 'message': '서버 오류!'})
    
@require_POST
def check_password_api(request):
    try:
        # 데이터 받아오기
        data = json.loads(request.body)
        id = data['username']
        password = data['password']

        # 임시 User 객체 생성
        user = User(username=id)

        # 비밀번호 유효성 검사
        validate_password(password, user=user)
        return JsonResponse({'code': 'Successed'})
    except ValidationError as e:
        print(e.messages)
        return JsonResponse({'code': 'Failed', 'message': e.messages})
    except Exception as e:
        print(f'서버 오류: {e}')
        return JsonResponse({'code': 'Error', 'message': '서버 오류'})
    
@require_POST
def check_email_api(request):
    try:
        data = json.loads(request.body)
        email = data['email']
        validate_email(email)
        return JsonResponse({'code': 'Successed'})
    except ValidationError as e:
        return JsonResponse({'code': 'Failed', 'message': e.messages})
    except Exception as e:
        print(f'서버 오류: {e}')
        return JsonResponse({'code': 'Error', 'message': '서버 오류'})
    
# 회원가입 후 프로필 생성 API ==============================================
@require_POST
@login_required
def Save_profile_api(request):
    print('실행됨')
    try:

        profile = Profile.objects.get(user = request.user)

        profile.nickname = (request.user.last_name + request.user.first_name) if not request.POST.get('nickname') else request.POST.get('nickname')
        profile.gender = request.POST.get('gender')
        profile.mbti = request.POST.get('mbti')
        profile.grade = request.POST.get('grade')
        profile.college = request.POST.get('college')
        profile.self_introduce = request.POST.get('selfIntroduce')
        profile.profile_img = profile.profile_img if request.FILES.get('profileImage') is None else request.FILES.get('profileImage')
        profile.save()

        return JsonResponse({'code': 'Successed'})
    except ValidationError as e:
        return JsonResponse({'code': 'Failed', 'message': e.messages})
    except Exception as e:
        print(f'서버 오류: {e}')
        return JsonResponse({'code': 'Error', 'message': '서버 오류'})
    

# 프로필 관련 API =========================================================
@login_required
def get_profileInfo_api(request):
    try:
        target_profile = Profile.objects.get(user=request.user)
        return JsonResponse({
            'code': 'Successed',
            'manner_temp': target_profile.manner_temp,
            'nickname': target_profile.nickname,
            'gender': target_profile.gender,
            'mbti': target_profile.mbti,
            'grade': target_profile.grade,
            'college': target_profile.college,
            'self_introduce': target_profile.self_introduce,
            'profileImageURL': target_profile.profile_img.url,
        })
    except Exception as e:
        print(e)
        return JsonResponse({'code': 'Error', 'error': str(e)})