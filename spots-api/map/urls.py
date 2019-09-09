from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from map.views import MapView
from map.api import SpotsApi, SpotApi, RatingsApi, VotesApi

app_name = 'map'
urlpatterns = [
    path('', MapView.as_view(), name='index'),

    path('spots/',                              SpotsApi.as_view()),
    path('spots/<int:spot_id>/',                SpotApi.as_view()),
    path('spots/<int:spot_id>/ratings/',        RatingsApi.as_view()),
    path('spots/<int:spot_id>/votes/',          VotesApi.as_view()),
]

if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
