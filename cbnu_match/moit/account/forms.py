from django import forms
from django.contrib.auth.models import User

class ProfileForm(forms.Form):
    
    MBTI_CHOICES = [
        ('INTJ', 'INTJ'),
        ('INTP', 'INTP'),
        ('ENTJ', 'ENTJ'),
        ('ENTP', 'ENTP'),
        ('INFJ', 'INFJ'),
        ('INFP', 'INFP'),
        ('ENFJ', 'ENFJ'),
        ('ENFP', 'ENFP'),
        ('ISTJ', 'ISTJ'),
        ('ISFJ', 'ISFJ'),
        ('ESTJ', 'ESTJ'),
        ('ESFJ', 'ESFJ'),
        ('ISTP', 'ISTP'),
        ('ISFP', 'ISFP'),
        ('ESTP', 'ESTP'),
        ('ESFP', 'ESFP'),
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
    
    age = forms.IntegerField(required=False, label="나이", min_value=0, 
                             error_messages={
                                'min_value':'나이가 0보다 작습니다',
                                },
                              widget=forms.NumberInput(attrs={'placeholder': '나이를 입력하세요'})
                             )
    
    college = forms.ChoiceField(choices=COLLEGE_CHOICES, required=False, label="단과대학",
                                )
    
    self_introduce = forms.CharField(max_length=50, required=False, label="한줄 자기소개",
                                     error_messages={
                                        'max_length':'입력 가능한 글자 수를 초과했습니다',
                                    },
                                     widget=forms.Textarea(attrs={'placeholder': '자기소개를 입력하세요(50자 이내)'}))  
    