from django.shortcuts import render

def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    return render(request, 'chat/room.html', {'room_name': room_name})

# 2025-05-21
# 구동 확인용
def room_by_meet_id(request, meet_id):
    return render(request, 'chat/room.html', {'room_name': f'meet_{meet_id}'})


