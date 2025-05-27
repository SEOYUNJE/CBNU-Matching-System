from django.db import models
from django.contrib.auth.models import User
from meet.models import Meet

# 1. 카테고리
class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

# 2. 모임방
class Meet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_meets')
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    meet_introduce = models.TextField()
    max_member = models.PositiveIntegerField()
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    participants = models.ManyToManyField(User, related_name='joined_meets_search', blank=True)

    def __str__(self):
        return f"[{self.category}] {self.title}"

# 3. 채팅 메시지
class Message(models.Model):
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.timestamp.strftime('%H:%M')}"

