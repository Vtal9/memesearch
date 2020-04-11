from django.urls import path
from rest_framework import routers

from .api import CreateNewTagAPI, TagsViewSet, GetMemesByTagViewSet

urlpatterns = [
    path('api/create', CreateNewTagAPI.as_view()),
    path('api/all/', TagsViewSet.as_view({'get': 'list'})),
    path('api/tagged', GetMemesByTagViewSet.as_view({'get': 'list'})),
]
