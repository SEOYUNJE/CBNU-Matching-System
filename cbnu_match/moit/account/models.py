from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    MBTI_CHOICES = [
    ('공개 안 함', '공개 안 함'),
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
    GENDER_CHOICES=[
        ('공개 안 함', '공개 안 함'),
        ('남성','남성'), 
        ('여성', '여성'),
    ]
    
    COLLEGE_CHOICES = [
        ('공개 안 함', '공개 안 함'),
        ('간호대학', '간호대학'),
        ('경영대학', '경영대학'),
        ('공과대학', '공과대학'),
        ('농업생명환경대학', '농업생명환경대학'),
        ('사회과학대학', '사회과학대학'),
        ('사범대학', '사범대학'),
        ('생활과학대학', '생활과학대학'),
        ('수의과대학', '수의과대학'),
        ('약학대학', '약학대학'),
        ('예술학과군', '예술학과군'),
        ('의과대학', '의과대학'),
        ('인문대학', '인문대학'),
        ('자연과학대학', '자연과학대학'),
        ('전자정보대학', '전자정보대학'),
        ('창의융합대학', '창의융합대학'),
        ('충북PRIDE공유대학', '충북PRIDE공유대학'),
    ]
    
    GRADE_CHOICES=[
        ('공개 안 함', '공개 안 함'),
        ('1학년','1학년'), 
        ('2학년', '2학년'),
        ('3학년', '3학년'),
        ('4학년', '4학년'),
    ]

    default_images = [
        'default1.jpg',
        'default2.jpg',
        'default3.jpg',
        'default4.jpg',
        'default5.jpg',
        'default6.jpg',
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
    )

    profile_img = models.ImageField(
        upload_to='',
        null=True
    )

    nickname = models.CharField(
        max_length=100,
        null=True,
    )

    mbti = models.CharField(
        max_length=6, 
        choices=MBTI_CHOICES,
        default='공개 안 함',
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='공개 안 함',
    )

    grade =  models.CharField(
        max_length=10,
        choices=GRADE_CHOICES,
        default='공개 안 함',
    )

    college = models.CharField(
        max_length=50,
        choices=COLLEGE_CHOICES,
        default='공개 안 함',
    )

    self_introduce = models.TextField(
        max_length=200,
        null=True,
        blank = True,
    )  
    
    def __str__(self):
        return self.user.username  