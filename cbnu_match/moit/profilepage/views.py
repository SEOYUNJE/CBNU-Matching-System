from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def profilepage(request):
    return render(request, 'profilepage/mypage.html')
