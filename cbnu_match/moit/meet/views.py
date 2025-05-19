from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect 

# Create your views here.
def create_meet(request, username):
    return HttpResponse("안녕하세요")