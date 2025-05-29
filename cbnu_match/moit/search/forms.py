from django import forms
from meet.models import Meet

CATEGORY_CHOICES = Meet.CATEGORY_CHOICES 

MAIN_TYPE_CHOICES = [
    ('', '-- 필터터 --'),
    ('created', '만든 날짜'),
    ('participant', '인원수'),
    ('category', '카테고리'),
    ('all', '전체'),
]

class SearchForm(forms.Form):
    query = forms.CharField(
        required=False,
        label='',
        widget=forms.TextInput(attrs={
            'placeholder': '검색어를 입력하세요...',
            'class': 'search-input'
        })
    )

    main_type = forms.ChoiceField(
        required=False,
        choices=MAIN_TYPE_CHOICES,
        widget=forms.Select(attrs={'class': 'main-type-select'})
    )

    sub_type = forms.ChoiceField(
        required=False,
        choices=[('', '-- 선택 --')] + Meet.CATEGORY_CHOICES,
        widget=forms.Select(attrs={'class': 'sub-type-select'})
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        main_type = self.data.get('main_type') or ''

        if main_type == 'created':
            self.fields['sub_type'].choices = [
                ('Newest', '최신순'),
                ('oldest', '오래된순'),
            ]
        elif main_type == 'participant':
            self.fields['sub_type'].choices = [
                ('desc', '많은순'),
                ('asc', '적은순'),
            ]
        elif main_type == 'category':
            self.fields['sub_type'].choices = CATEGORY_CHOICES
        else:
            self.fields['sub_type'].choices = []
