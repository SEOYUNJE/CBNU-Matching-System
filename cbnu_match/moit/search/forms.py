from django import forms

class SearchForm(forms.Form):
    query = forms.CharField(
        required=False,
        label='',
        widget=forms.TextInput(attrs={
            'placeholder': '검색어를 입력하세요...',
            'class': 'search-input'
        })
    )
