from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from account.models import Profile 

@login_required
def profilepage(request):
    
    profile = Profile.objects.get(user = request.user)
    
    return render(request, 'profilepage/profile.html', {'profile': profile})

@login_required
def edit_profile(request):
    
    if request.method == 'POST':
        
        return redirect('mainpage')
        
    else:
        profile = Profile.objects.get(user = request.user)
    
        return render(request, 'profilepage/edit_profile.html', {'profile': profile})
