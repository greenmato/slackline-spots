
from django.template import loader
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.urls import reverse

from map.models import Spot, Rating, RatingType, Vote
from map.forms import SpotForm, RatingForm, VoteForm
from map.map import Map


# Renders the main spot map page
def index(request):
    # Add a new spot
    if request.method == 'POST':
        form = SpotForm(request.POST)

        if form.is_valid():
            new_spot = Spot(name=request.POST['name'], description=request.POST['description'], latitude=request.POST['latitude'], longitude=request.POST['longitude'])
            new_spot.save()

            return HttpResponseRedirect(reverse('map:success'))
        else:
            return HttpResponseRedirect(reverse('map:failure'))

    # Render the map
    else:
        # TODO only retrieve nearest spots and make them dynamically load as the map moves
        nearby_spots = Spot.objects.all()

        spot_map = Map(nearby_spots)
        spot_map.generate_xml()

        context = {
            'nearby_spots': nearby_spots,
        }

        return render(request, 'map/index.html', context)


# Renders spot information, including forms to vote and rate
def get(request, spot_id):
    spot = get_object_or_404(Spot, pk=spot_id)

    upvote_form = VoteForm(initial={'spot': spot_id, 'positive': True})
    downvote_form = VoteForm(initial={'spot': spot_id, 'positive': False})

    votes = Vote.objects.filter(spot=spot_id)

    score = 0;
    for vote in votes:
        score += 1 if vote.positive else -1

    rating_info = []
    rating_types = RatingType.objects.all()

    for rating_type in rating_types:
        ratings = Rating.objects.filter(spot=spot_id, rating_type=rating_type.id)

        rating_score = 0;
        for rating in ratings:
            rating_score += rating.score

        if len(ratings) != 0:
            rating_score = rating_score / len(ratings)
        else:
            rating_score = "No votes"

        info = (rating_type.name, rating_score, RatingForm(initial={'spot': spot_id, 'rating_type': rating_type}))
        rating_info.append(info)

    context = {
        'spot': spot,
        'upvote_form': upvote_form,
        'downvote_form': downvote_form,
        'score': score,
        'rating_info': rating_info,
    }

    return render(request, 'map/get.html', context)


# Renders the create spot form
def create(request):
    form = SpotForm()

    context = {
        'form': form
    }

    return render(request, 'map/create.html', context)


# Adds a new spot rating
def ratings(request, spot_id):
    if request.method == 'POST':
        form = RatingForm(request.POST)

        if form.is_valid():
            spot = get_object_or_404(Spot, pk=request.POST['spot'])
            rating_type = get_object_or_404(RatingType, pk=request.POST['rating_type'])

            new_rate = Rating(spot=spot, rating_type=rating_type, score=request.POST['score'])
            new_rate.save()
            return HttpResponseRedirect(reverse('map:success'))
        else:
            return HttpResponseRedirect(reverse('map:failure'))
    else:
        # TODO handle invalid method errors
        pass


# Adds a new spot up/down vote
def votes(request, spot_id):
    if request.method == 'POST':
        form = VoteForm(request.POST)

        if form.is_valid():
            spot = get_object_or_404(Spot, pk=request.POST['spot'])

            new_vote = Vote(spot=spot, positive=request.POST['positive'])
            new_vote.save()

            return HttpResponseRedirect(reverse('map:success'))
        else:
            return HttpResponseRedirect(reverse('map:failure'))
    else:
        # TODO handle invalid method errors
        pass


# Render the success page
def success(request):
    return render(request, 'map/success.html')


# Render the failure page
def failure(request):
    return render(request, 'map/failure.html')
