from django.contrib import admin
from .models import Report
from django.contrib.auth.models import User
from django.db.models import Count

admin.site.register(Report)

# admin한테 신고 당한 유저와 신고 당한 횟수 보여주기 (신고당한 사용자 , 신고 횟수)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'reported_count')

    # 누적 신고 수 계싼
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(reported_count=Count('reports_received'))

    def reported_count(self, obj):
        return obj.reported_count
    
    # 신고 횟수 정렬
    reported_count.admin_order_field = 'reported_count'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
