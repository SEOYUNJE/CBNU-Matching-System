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
import json

# def login_view(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request,user)
#             return redirect('mainpage')
#         else:
#             return render(request, 'account/login.html', {'error': '아이디 또는 비밀번호가 잘못되었습니다.'})
#     else:
#         return render(request, 'account/login.html')
    
<<<<<<< HEAD
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
=======
# def logout_view(request):
#     logout(request)
#     return redirect('main')
>>>>>>> b8a1c51 (Text)

def signin(request):
    print("실행됨")
    return render(request, 'account/signin.html')

def signup(request):
    return render(request, 'account/signup.html')

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

    
    # exists = User.objects.filter(username=id).exists()
    # return JsonResponse({'exists': exists})

def check_password(request):
    if request.method == 'POST':
<<<<<<< HEAD
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
            
            profile.profile_img = form.cleaned_data['profile_img']

            default_images = [
            'default1.jpg',
            'default2.jpg',
            'default3.jpg',
            'default4.jpg',
            'default5.jpg',
            'default6.jpg',
            ]

            if form.cleaned_data.get('profile_img'):
                profile.profile_img = form.cleaned_data['profile_img']
            else:
                profile.profile_img = random.choice(default_images)
=======
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
>>>>>>> b8a1c51 (Text)
        
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
    print("실행됨")
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
            target_profile.nickname=data.get('nickname')
            target_profile.gender=data.get('gender')
            target_profile.mbti=data.get('mbti')
            target_profile.college=data.get('college')
            target_profile.self_introduce=data.get('self_introduce')
            target_profile.save()
        except Exception as e:
            return JsonResponse({'code': 'failed', 'error': str(e)})
        return JsonResponse({'code': 'successed'})
    return render(request, 'account/create_profile.html')
# def find_login(request):
#     if request.method == "POST":
#         first_name = request.POST['first_name']
#         last_name = request.POST['last_name']
#         email = request.POST['email']
        
#         user = User.objects.filter(first_name=first_name, last_name=last_name,
#                             email=email)
        
#         if user.exists():
            
#             return render(request, 'account/id_find_result.html', {
#                     'username': user[0].username,
#                     'first_name': user[0].first_name,
#                     'last_name': user[0].last_name,
#                     })
#         else:
#             return render(request, "account/id_find.html", {'error': '입력하신 정보와 일치하는 아이디가 없습니다'})
#     else:
#         return render(request, "account/id_find.html")

# def password_check(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         first_name = request.POST['first_name']
#         last_name = request.POST['last_name']
        
#         user = User.objects.filter(username = username,
#                                 first_name=first_name, last_name=last_name)
        
#         if user.exists():
#             return render(request, 'account/pw_new.html', {'username': username})
#         else:
#             return render(request, "account/pw_set.html", {'error': "입력하신 정보와 일치하는 비밀번호가 없습니다"})
        
#     else:
#         return render(request, "account/pw_set.html")

# def password_reset(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         new_password = request.POST['new_password']
#         new_password_check = request.POST['new_password_check']
                
#         user = User.objects.get(username = username)
#         user.set_password(new_password)
#         user.save()
            
#         return redirect('login')
#     else:
#         return render(request, "account/pw_new.html")

# def signup(request):
#     if request.method == "POST":
#         form = SignupForm(request.POST)
#         if form.is_valid():
#             user = User.objects.create_user(
#                 username=form.cleaned_data["username"],
#                 email=form.cleaned_data["email"],
#                 password=form.cleaned_data["password"],
#                 first_name=form.cleaned_data["first_name"],
#                 last_name=form.cleaned_data["last_name"],
#             )
#             return redirect("profile", username=user.username)
#         else:
#             return render(request, "account/signup.html", {'form': form})
#     else:
#         form = SignupForm()
#         return render(request, "account/signup.html", {'form': form})

    
# def profile(request, username):
#     if request.method == 'POST':
#         form= ProfileForm(request.POST, request.FILES)
#         if form.is_valid(): # form 유효성 검사(필수 사항 작성 여부 확인)
#             user = User.objects.get(username=username)
#             profile = Profile.objects.get(user=user)
            
#             profile.nickname = form.cleaned_data['nickname']
#             profile.mbti = form.cleaned_data['mbti']
#             profile.gender = form.cleaned_data['gender']
#             profile.grade = form.cleaned_data['grade']
#             profile.college = form.cleaned_data['college']
#             profile.self_introduce = form.cleaned_data['self_introduce']
            
#             if form.cleaned_data.get('profile_img'):
#                 profile.profile_img = form.cleaned_data['profile_img']
#             else:
#                 random_default = f"default{random.randint(1, 6)}.jpg"
#                 profile.profile_img = random_default
        
#             profile.save()
#             return redirect('login')
#         else:
#             return render(request, 'account/profile.html', {'form': form, 'errors': form.errors, 'username': username})     
#     else:
#         form = ProfileForm()
#         return render(request, 'account/profile.html', {'form': form, 'username': username})