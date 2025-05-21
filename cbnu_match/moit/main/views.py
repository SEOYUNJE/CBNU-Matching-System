from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

def main(request):
    return render(request, 'main.html')
