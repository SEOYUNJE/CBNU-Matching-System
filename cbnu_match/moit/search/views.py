from django.shortcuts import render
from django.db.models import Q
from .models import Meet
from django.core.paginator import Paginator

def search_before(request):
    return render(request, 'search/search_before.html')


def search(request):
    query = request.GET.get('query', '')
    meet_list = Meet.objects.all()

    if query:
        meet_list = meet_list.filter(
            Q(title__icontains=query) |
            Q(category__name__icontains=query)
        )

    paginator = Paginator(meet_list, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'results': page_obj,
        'query': query,
    }
    return render(request, 'search/search.html', context)
