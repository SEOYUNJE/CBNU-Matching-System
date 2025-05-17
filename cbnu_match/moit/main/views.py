from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def main(request, username):
    return HttpResponse("안녕하세요")
