from django.contrib import admin
from .models import *
from django.db import models
from django.conf import settings
from account.models import *

# Register your models here.
## App Register
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reporter', 'reported_user', 'reason', 'comment', 'created_at','is_approved')
    list_filter = ('reason', 'created_at')
    search_fields = ('reporter__username', 'reported_user__username', 'reason', 'comment')
    ordering = ('-created_at',)
    actions = ['approve_reports']  # 액션 추가

    @admin.action(description='신고 승인 및 매너 온도 차감')
    def approve_reports(self, request, queryset):
        for report in queryset:
            if report.is_approved:
                continue  # 이미 승인된 신고는 건너뜀

            # 동일 댓글에 대해 이미 승인된 신고가 있으면 건너뜀
            existing_approved = Report.objects.filter(
                comment=report.comment,
                is_approved=True
            ).exists()

            if existing_approved:
                continue

            # 승인 처리
            report.is_approved = True
            report.save()

            # 매너 온도 차감
            profile = Profile.objects.get(user=report.reported_user)
            profile.manner_temp = max(0, profile.manner_temp - 20)
            profile.save()