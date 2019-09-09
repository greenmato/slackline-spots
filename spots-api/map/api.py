from abc import ABC, ABCMeta, abstractmethod
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from map.models import Spot
from map.models import Vote
from map.forms import SpotForm, VoteForm

class BaseApi(View):
    __metaclass__ = ABCMeta

    def _response(self, body):
        response = {'data': body}
        return JsonResponse(response)

    def _error_response(self, status, error):
        response = {'error': error}
        return JsonResponse(response, status=status)


class BaseSpotsApi(BaseApi):
    __metaclass__ = ABCMeta

    def _spot_to_dict(self, spot):
        spot_dict = model_to_dict(spot)
        spot_dict['score'] = spot.get_score()

        return spot_dict

# @method_decorator(csrf_exempt, name='dispatch')
class SpotsApi(BaseSpotsApi):
    def get(self, request):
        # TODO: only retrieve nearest spots and make them dynamically load as the map moves
        nearby_spots = Spot.objects.all()
        nearby_spots = list(map(self._spot_to_dict, nearby_spots))

        return self._response(nearby_spots)

    def post(self, request):
        form = SpotForm(request.POST)

        if form.is_valid():
            new_spot = Spot(
                name=request.POST['name'],
                description=request.POST['description'],
                latitude=request.POST['latitude'],
                longitude=request.POST['longitude']
            )
            new_spot.save()

            return self._response(self._spot_to_dict(new_spot))

        return self._error_response(422, 'Invalid input.')

class SpotApi(BaseSpotsApi):
    def get(self, request, spot_id):
        spot = get_object_or_404(Spot, pk=spot_id)

        return self._response(self._spot_to_dict(spot))

# @method_decorator(csrf_exempt, name='dispatch')
class RatingsApi(BaseApi):
    def get(self, request, spot_id):
        spot = get_object_or_404(Spot, pk=spot_id)

        ratings = Rating.objects.filter(spot=spot_id, rating_type=rating_type.id)

        pass

    def post(self, request, spot_id):
        spot = get_object_or_404(Spot, pk=spot_id)

        pass

# @method_decorator(csrf_exempt, name='dispatch')
class VotesApi(BaseApi):
    def get(self, request, spot_id):
        spot = get_object_or_404(Spot, pk=spot_id)

        return self._response(spot.get_score())

    def post(self, request, spot_id):
        spot = get_object_or_404(Spot, pk=spot_id)
        form = VoteForm(request.POST)

        if form.is_valid():
            new_vote = Vote(spot=spot, positive=request.POST['positive'])
            new_vote.save()

            return self._response(model_to_dict(new_vote))

        return self._error_response(422, 'Invalid input.')
