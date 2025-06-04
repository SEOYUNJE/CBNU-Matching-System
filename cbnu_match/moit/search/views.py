from django.db.models import Count
from django.core.paginator import Paginator
from django.shortcuts import render
from .models import Meet
from account.models import Profile


def search(request):
    results = Meet.objects.all().order_by('-id')  # 전체 Meet 객체
    # Paginator 사용: 한 페이지당 8개 항목
    paginator = Paginator(results, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp


    return render(request, 'search/search.html', 
                  {'manner_temp': manner_temp,
                   'page_obj': page_obj,
                   'results': results,
                   })
