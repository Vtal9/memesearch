from memes.models import Memes
from rest_framework import viewsets, permissions
from .serializers import MemesSerializer

class MemesViewSet(viewsets.ModelViewSet):
	queryset = Memes.objects.all()
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = MemesSerializer


class UnMarkedMemesViewSet(viewsets.ModelViewSet):
	queryset = Memes.objects.filter(imageDescription = "")
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = MemesSerializer