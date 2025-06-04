from django.db.models import Count
from django.core.paginator import Paginator
from django.shortcuts import render
from .models import Meet
from .forms import SearchForm

CATEGORY_CHOICES = Meet.CATEGORY_CHOICES

def search_before(request):
    return render(request, 'search/search.html')

def search(request):
    query = request.GET.get('query', '')
    category = request.GET.get('category', '')  # 카테고리
    sort_type = request.GET.get('sort_type', '')    # 정렬방식

    meet_list = Meet.objects.annotate(num_participant=Count('participant'))

    # 제목 검색 
    if query:
        meet_list = meet_list.filter(title__icontains=query)

    # 카테고리 필터링
    if category:
        meet_list = meet_list.filter(category=category)

    # 정렬 조건
    if sort_type == 'Newest':
        meet_list = meet_list.order_by('-created_at')
    elif sort_type == 'oldest':
        meet_list = meet_list.order_by('created_at')

    if sort_type == 'desc':
        meet_list = meet_list.order_by('-num_participant')
    elif sort_type == 'asc':
        meet_list = meet_list.order_by('num_participant')

    # 페이지네이션
    paginator = Paginator(meet_list, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'form': SearchForm,
        'results': page_obj,
        'query': query,
        'category': category,
        'sort_type' : sort_type
    }

    return render(request, 'search/search.html', context)
