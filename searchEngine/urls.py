from rest_framework import routers
from .api import SearchAPI
from .api import TextDescriptionsViewSet
from .api import ImageDescriptionsViewSet
from django.urls import path



urlpatterns = [
    path('api/search/', SearchAPI.as_view()),
    path('api/Text/', TextDescriptionsViewSet),
]
