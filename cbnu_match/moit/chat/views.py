from django.shortcuts import render
from django.http import HttpResponse

def main(request):
    return HttpResponse("안녕하세요")