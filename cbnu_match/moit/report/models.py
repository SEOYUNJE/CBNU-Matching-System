from django.db import models
from django.contrib.auth.models import User

class Report(models.Model):
    # 신고자
    report_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='report_user')

    # 신고 대상 유저
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_user')
    
    # 신고 사유 유형 (욕설, 노쇼, 도배)
    REASON_CHOICES = [
        ('욕설', '욕설'),
        ('노쇼', '노쇼'),
        ('도배', '도배'),
    ]

    reason_type = models.CharField(max_length=30, choices=REASON_CHOICES)
    
    # 신고 사유 - 자유 입력
    report_reason = models.TextField()

    # 신고 시각
    created_at = models.DateTimeField(auto_now_add =True)

    # 한 번에 한 명의 유저만 신고 가능 (같은 유저 여러 번 신고 불가)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["report_user", "reported_user"], name="only_one_report"
            )
        ]

    def __str__(self):
        return f'{self.reported_user.username} , {self.reason_type}'
