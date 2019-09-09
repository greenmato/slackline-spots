from django import forms
from django.forms import ModelForm, Textarea

from map.models import Spot, Rating, Vote

class SpotForm(ModelForm):
    class Meta:
        model = Spot
        fields = ['name', 'description', 'latitude', 'longitude']
        widgets = {
            'latitude': forms.HiddenInput(),
            'longitude': forms.HiddenInput(),
        }

class RatingForm(ModelForm):
    class Meta:
        model = Rating
        fields = ['spot', 'rating_type', 'score']
        widgets = {
            'spot': forms.HiddenInput(),
            'rating_type': forms.HiddenInput(),
        }

class VoteForm(ModelForm):
    class Meta:
        model = Vote
        fields = ['positive']
        widgets = {
            'positive': forms.HiddenInput(),
        }
