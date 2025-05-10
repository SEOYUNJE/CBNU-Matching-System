from django.db import models

# Create your models here.
class login(models.Model):
    ## 로그인은 최소 길이 상관없이 100자 이내로만, 중복 불가능
    login = models.CharField(max_length=100, unique=True)
    ## EmailField: CharField 상속, 이메일 형식 유효성 검사 진행
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    password_check = models.CharField(max_length=100)
    
class profile(models.Model):
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
    
    profile_img = models.ImageField(upload_to='profile_images/',blank=True,null=True)
    nickname = models.CharField(max_length=100)
    mbti = models.CharField(max_length=4,
                            choices=MBTI_CHOICES,
                            )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        )
    age = models.PositiveIntegerField()
    major = models.CharField(max_length=50)
    self_introduce = models.TextField()    