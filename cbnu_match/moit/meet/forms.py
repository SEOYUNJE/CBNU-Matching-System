from django import forms


class CreateMeetForm(forms.Form):
    CATEGORY_CHOICES = [
        ('STUDY', 'STUDY'),
        ('GAME', 'GAME'),
        ('EXERCISE', 'EXERCISE'),
        ('MEALS', 'MEALS'),
    ]
    MEMBER_CHOICES = [
        ('1명', '1명'),
        ('2명', '2명'),
        ('3명', '3명'),
        ('4명', '4명'),
        ('5명', '5명'),
        ('6명', '6명'),
        ('7명', '7명'),
        ('8명', '8명'),
    ]
    
    title = forms.CharField(max_length=100,
                            widget=forms.TextInput(attrs={'placeholder': '모임 제목을 작성해주세요'}))
    category = forms.ChoiceField(choices=CATEGORY_CHOICES)
    deadline = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'})
    )
    max_member = forms.ChoiceField(choices=MEMBER_CHOICES)
    meet_introduce = forms.CharField(widget=forms.Textarea(attrs={'placeholder': '자세한 모임 설명을 작성해주세요'}))