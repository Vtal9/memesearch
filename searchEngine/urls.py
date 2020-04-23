from memes.api import LikingMemeAPI
from .api import SearchAPI, MemesViewSet
from .api import TextDescriptionsViewSet
from .api import ImageDescriptionsViewSet
from .api import SearchOwnMemesAPI
from django.urls import path

urlpatterns = [
    path('api/search/', SearchAPI.as_view()),
    path('api/Text/', TextDescriptionsViewSet.as_view({'get': 'list'})),
    path('api/Image/', ImageDescriptionsViewSet.as_view({'get': 'list'})),
    path('api/search/own/', SearchOwnMemesAPI.as_view()),
    path('api/all/', MemesViewSet.as_view({'get': 'list'})),
]
