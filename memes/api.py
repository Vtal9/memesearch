from memes.models import Memes
from rest_framework import viewsets, permissions
from .serializers import MemesSerializer
from django.http import HttpRequest
import random


class MemesViewSet(viewsets.ModelViewSet):
	serializer_class = MemesSerializer

	
	def get_queryset(self):
		queryset = Memes.objects.all()
		permission_classes = [
			permissions.AllowAny
		]
		
		return queryset



class UnMarkedMemesViewSet(viewsets.ModelViewSet):
	queryset = Memes.objects.filter(imageDescription = "").order_by('?')[0:1]
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = MemesSerializer

class MarkedMemesViewSet(viewsets.ModelViewSet):
	queryset = Memes.objects.exclude(imageDescription = "")
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = MemesSerializer
