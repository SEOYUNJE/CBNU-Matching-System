from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Meet
from chat.models import Chat
from django.contrib.auth.models import User

@receiver(post_save, sender=Meet)
def create_initial_chat(sender, instance, created, **kwargs):
    if created:
        Chat.objects.create(
            meet = instance,
            sender = instance.user,
            content = "초기화 완료!",
        )
