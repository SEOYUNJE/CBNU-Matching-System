from django.shortcuts import render, redirect, get_object_or_404
from .models import Room, Message
from django.contrib.auth.decorators import login_required

@login_required
def room_list(request):
    if request.method == 'POST':
        room_name = request.POST.get('room_name')
        if room_name:
            Room.objects.create(name=room_name, creator=request.user)
            return redirect('room:room_list')
    rooms = Room.objects.all()
    return render(request, 'room_list.html', {'rooms': rooms})


@login_required
def room_detail(request, room_id):
    room = get_object_or_404(Room, id=room_id)

    # 참여자 등록
    if request.user not in room.participants.all():
        try:
            room.add_participant(request.user)
        except ValueError:
            return render(request, 'room_detail.html', {
                'room': room,
                'messages': room.messages.all(),
                'error': "최대 참여자 수를 초과했습니다."
            })

    # 메시지 전송
    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Message.objects.create(room=room, sender=request.user, content=content)
            return redirect('room_detail', room_id=room_id)

    messages = room.messages.order_by('timestamp')
    return render(request, 'room_detail.html', {'room': room, 'messages': messages})
