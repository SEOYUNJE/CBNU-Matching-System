from django.shortcuts import render
from .models import Meet
from .forms import SearchForm 
from django.core.paginator import Paginator
from django.db.models import Q, Count
from meet.models import Meet

CATEGORY_CHOICES = Meet.CATEGORY_CHOICES 

def search_before(request):
    return render(request, 'search/search_before.html')

# 제목 검색
def search(request):

    query = request.GET.get('query', '')
    category = request.GET.get('category', '')
    created_at = request.GET.get('created_at', '')
    participant = request.GET.get('participant', '')

    # 대주제
    main_type = request.GET.get('main_type', '')
    # 소주제 
    sub_type = request.GET.get('sub_type', '')

    meet_list = Meet.objects.annotate(num_participants=Count('participant'))
    
    # 검색
    if main_type == 'all' or not main_type:
        if query:
            meet_list = meet_list.filter(title__icontains=query)

   # 최신순
    if (main_type) == 'created':
        if (sub_type) == 'Newest':
            meet_list = meet_list.order_by('-created_at')
        if (sub_type) == 'oldest':
            meet_list = meet_list.order_by('created_at')
    # 참가인원
    if (main_type) == 'participant':
        if (sub_type) == 'desc':
            meet_list = meet_list.order_by('-num_participant')
        if (sub_type) == 'asc' :
            meet_list = meet_list.order_by('num_participant')
        # 카테고리
    if main_type == 'category':
        if sub_type: 
            meet_list = meet_list.filter(category=sub_type)       

    paginator = Paginator(meet_list, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'form': SearchForm,
        'results': page_obj,  
        'query': query,
        'main_type': main_type,
        'sub_type': sub_type,
    }

    return render(request, 'search/search.html', context)