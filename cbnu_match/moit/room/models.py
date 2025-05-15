from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    name = models.CharField(max_length=100)
    creater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_room')
    participants = models.ManyToManyField(User, related_name='rooms', blank=True)
    max_participants = models.PositiveIntegerField(default=8)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def add_participant(self, user):
        if self.participants.count() >= self.max_participants:
            return ValueError("최대 참여자 수(8명)을 초과할 수 없습니다.")
    
class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.content[:20]}'
