from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from meet.models import Meet



# 1. 카테고리
class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

# 2. 모임방
class Meet(models.Model):
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    now_member = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    participant = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='joined_meets', blank=True)

    # 대주제
    main_filter = models.CharField(maxlenght=10, blank=True)
    # 소주제
    sub_filter = models.CharField(max_length=10, blank=True)

    participants = models.ManyToManyField(User, related_name='joined_meets_search', blank=True)

    def __str__(self):
        return f"[{self.category}] {self.title}"
