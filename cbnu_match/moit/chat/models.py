from django.db import models
<<<<<<< HEAD
from django.conf import settings

class Report(models.Model):
    
    # 신고한 사람
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name = "reports_made",
    )
    
    # 신고당한 사람
    reported_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name= 'reports_received',
    )
    
    # 신고 생성 시간
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 신고 사유
    reason = models.CharField(max_length=50)
    
    # 신고 당한 댓글 
    comment = models.CharField(max_length=500)
    
    # 관리자 승인 여부
    is_approved = models.BooleanField(default=False)
=======
from django.contrib.auth.models import User
from meet.models import Meet

class Chat(models.Model):
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name='chats',)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats', null=True)
    content = models.TextField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.meet}] {self.sender.username}: {self.content[:20]}"
>>>>>>> 71a9fd5 ((refactor) chat Function)
