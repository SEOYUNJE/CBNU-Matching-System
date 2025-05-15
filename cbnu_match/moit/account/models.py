from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
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
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    profile_img = models.ImageField(upload_to='user_img/',blank=True,null=True)
    nickname = models.CharField(max_length=100) 
    mbti = models.CharField(max_length=4,
                            choices=MBTI_CHOICES,
                            )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        )
    grade =  models.CharField(
        max_length=10,
        choices=GRADE_CHOICES,
        null=True, blank=True
        )
    college = models.CharField(max_length=50,
                               choices=COLLEGE_CHOICES,
                               null=True, blank=True)
    self_introduce = models.CharField(max_length=50)  
    
    def __str__(self):
        return self.user.username  