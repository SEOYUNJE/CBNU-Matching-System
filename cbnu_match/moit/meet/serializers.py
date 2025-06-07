from rest_framework import serializers
from .models import Meet
from account.models import Profile
from account.serializers import ProfileSerializer

class MeetSerializer(serializers.ModelSerializer):
    host_profile = serializers.SerializerMethodField()
    participants_profile = serializers.SerializerMethodField()

    class Meta:
        model = Meet
        fields =[
            'id', 'title', 'category', 'created_at', 'deadline',
            'max_member', 'meet_introduce', 'host_profile', 'participants_profile'
        ]
    
    def get_host_profile(self, obj):
        profile = Profile.objects.get(user=obj.user)
        return ProfileSerializer(profile).data
    
    def get_participants_profile(self, obj):
        request_user = self.context['request'].user
        all_participant = list(obj.participant.all())

        me = [p for p in all_participant if p == request_user]
        others = sorted(
            [p for p in all_participant if p != request_user],
            key=lambda x: x.profile.nickname    
        )

        ordered_participant = me + others
        return ProfileSerializer(
            [u.profile for u in ordered_participant], many=True
        ).data