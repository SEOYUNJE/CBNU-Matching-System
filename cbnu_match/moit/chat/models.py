from django.db import models
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