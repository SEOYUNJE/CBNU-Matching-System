from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Count
from .models import Report
from .forms import ReportForm

@login_required
def report_user(request, user_id):

    # annotate로 신고 횟수도 가져오기
    reported_user = get_object_or_404(
        User.objects.annotate(reported_cnt=Count('reports_received')),
        id=user_id
    )

    # 본인 신고 불가
    if request.user.id == reported_user.id:
        return redirect('mainpage')

    # 신고 진행
    if request.method == 'POST':
        form = ReportForm(request.POST)
        if form.is_valid():
            report = form.save(commit=False)
            report.reporter = request.user
            report.reported_user = reported_user
            report.save()
        return JsonResponse({
                'status': 'success',
                'reported_user': reported_user.username,
        })
    else:
        form = ReportForm()
        return render(request, 'report/report_form.html', {
            'form': form,
            'reported_user': reported_user,
        })
