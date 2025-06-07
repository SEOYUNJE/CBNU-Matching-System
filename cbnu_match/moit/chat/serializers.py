from rest_framework import serializers
from .models import Chat
from account.models import Profile
from account.serializers import ProfileSerializer

class ChatSerializer(serializers.ModelSerializer):
    sender_profile = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'meet', 'sender_profile', 'content', 'created_at']

    def get_sender_profile(self, obj):
        profile = Profile.objects.get(user=obj.sender)
        return ProfileSerializer(profile).data