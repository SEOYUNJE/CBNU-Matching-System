from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

class SignupForm(forms.Form):
    username = forms.CharField(label="아이디",
                               widget=forms.TextInput(attrs={'placeholder': '아이디 입력'}))
    email = forms.EmailField(label="이메일",
                             widget=forms.TextInput(attrs={'placeholder': '이메일 입력'}))
    password = forms.CharField(label="비밀번호", widget=forms.TextInput(attrs={'placeholder': '비밀번호 입력'}))
    password_check = forms.CharField(label="비밀번호 확인", widget=forms.TextInput(attrs={'placeholder': '비밀번호 확인'}))
    first_name = forms.CharField(label="성", widget=forms.TextInput(attrs={'placeholder': '성 입력'}))
    last_name = forms.CharField(label="이름", widget=forms.TextInput(attrs={'placeholder': '이름 입력'}))
    
    # valid 검사 전 아이디 중복 체크
    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise ValidationError("이미 사용 중인 아이디입니다.")
        return username ## Error: form.username.errors

    # clean 이전에 먼저 clean_username이 작동
    def clean(self):
        cleaned_data = super().clean() # clean data를 가져온다
        password = cleaned_data.get("password")
        password_check = cleaned_data.get("password_check")
        username = cleaned_data.get("username")

        if password and password_check and password != password_check:
            self.add_error('password_check', "비밀번호가 일치하지 않습니다.")
            # Error: form.password_check.errors
        # 비밀번호 유효성 검사
        if password:
            try:
                validate_password(password, user=User(username=username))
            except ValidationError as e:
                self.add_error('password', e.messages)
            # Error: form.password.erros
# 사용자 정의 Model을 이용한 Form
class ProfileForm(forms.Form):
    
    MBTI_CHOICES = [
    ('ENFJ', 'ENFJ'),
    ('ENFP', 'ENFP'),
    ('ENTJ', 'ENTJ'),
    ('ENTP', 'ENTP'),
    ('ESFJ', 'ESFJ'),
    ('ESFP', 'ESFP'),
    ('ESTJ', 'ESTJ'),
    ('ESTP', 'ESTP'),
    ('INFJ', 'INFJ'),
    ('INFP', 'INFP'),
    ('INTJ', 'INTJ'),
    ('INTP', 'INTP'),
    ('ISFJ', 'ISFJ'),
    ('ISFP', 'ISFP'),
    ('ISTJ', 'ISTJ'),
    ('ISTP', 'ISTP'),
        ]
    GENDER_CHOICES=[('남성','남성'), ('여성', '여성')]
    
    COLLEGE_CHOICES = [
        ('인문대학', '인문대학'),
        ('사회과학대학', '사회과학대학'),
        ('자연과학대학', '자연과학대학'),
        ('경영대학', '경영대학'),
        ('공과대학', '공과대학'),
        ('전자정보대학', '전자정보대학'),
        ('농업생명환경대학', '농업생명환경대학'),
        ('사범대학', '사범대학'),
        ('생활과학대학', '생활과학대학'),
        ('수의과대학', '수의과대학'),
        ('약학대학', '약학대학'),
        ('의과대학', '의과대학'),
        ('간호대학', '간호대학'),
        ('창의융합대학', '창의융합대학'),
        ('충북PRIDE공유대학', '충북PRIDE공유대학'),
        ('예술학과군', '예술학과군'),
    ]
    
    GRADE_CHOICES=[
        ('1학년','1학년'), 
        ('2학년', '2학년'),
        ('3학년', '3학년'),
        ('4학년', '4학년')]
    
    profile_img = forms.ImageField(required=False, label="프로필 이미지")
    
    nickname = forms.CharField(max_length=100,
                               error_messages={
                                'required':'닉네임을 입력해주세요',
                                'max_length': '닉네임은 100자 이내로 작성해주세요',
                                },
                                required=True,
                                label="닉네임",
                                widget=forms.TextInput(attrs={'placeholder': '닉네임을 입력하세요'}),
                                )  
     
    mbti = forms.ChoiceField(choices=MBTI_CHOICES, required=False, label="mbti",
                             )
                            
    gender = forms.ChoiceField(choices=GENDER_CHOICES, required=False, label="성별",
                               )
    
    grade =  forms.ChoiceField(choices=GRADE_CHOICES, required=False, label="학년",
                               )
    college = forms.ChoiceField(choices=COLLEGE_CHOICES, required=False, label="단과대학",
                                )
    
    self_introduce = forms.CharField(max_length=50, required=False, label="한줄 자기소개",

                                     widget=forms.Textarea(attrs={'placeholder': '자기소개를 입력하세요(50자 이내)'}))  
    