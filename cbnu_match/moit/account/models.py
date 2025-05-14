from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
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
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    profile_img = models.ImageField(upload_to='profile_images/',blank=True,null=True)
    nickname = models.CharField(max_length=100) 
    mbti = models.CharField(max_length=4,
                            choices=MBTI_CHOICES,
                            )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        )
    age = models.PositiveIntegerField(null=True)
    college = models.CharField(max_length=50,
                               choices=COLLEGE_CHOICES,
                               null=True, blank=True)
    self_introduce = models.CharField(max_length=50)  
    
    def __str__(self):
        return self.user.username  