from django.core.paginator import Paginator
from django.shortcuts import render
from django.db.models import Q
from .models import Meet
from account.models import Profile

def search(request):
    # 1) GET 파라미터 읽기
    q = request.GET.get('q', '').strip()
    page_number = request.GET.get('page', 1)
    selected_category = request.GET.get('category', '전체')
    selected_sort     = request.GET.get('sort', '최신순')

    meets = Meet.objects.all()
    if q:
        meets = meets.filter(
            Q(title__icontains=q) |
            Q(meet_introduce__icontains=q)
        )

    if selected_category and selected_category != '전체':
        meets = meets.filter(category__iexact=selected_category)

    if selected_sort == '최신순':
        meets = meets.order_by('-created_at')
    elif selected_sort == '마감순':
        meets = meets.order_by('deadline')
    elif selected_sort == '참여자순':
        meets = meets.order_by('-num_participant')
    elif selected_sort == '모집인원순':
        meets = meets.order_by('-max_member')
    else:
        meets = meets.order_by('-id')

    paginator = Paginator(meets, 8)
    page_obj = paginator.get_page(page_number)

    manner_temp = None
    if request.user.is_authenticated:
        manner_temp = Profile.objects.get(user=request.user).manner_temp

    if request.GET.get('ajax') == '1':
        return render(request, 'search/search_LIST.html', {
            'page_obj': page_obj,
            'q': q,
            'selected_category': selected_category,
            'selected_sort': selected_sort,
        })

    return render(request, 'search/search.html', {
        'page_obj': page_obj,
        'q': q,
        'manner_temp': manner_temp,
        'selected_category': selected_category,
        'selected_sort': selected_sort,
    })
