from memes.models import Memes
from rest_framework import viewsets, permissions
from .serializers import MemesSerializer

class ProductViewSet(viewsets.ModelViewSet):
	queryset = Memes.objects.all()
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = MemesSerializer
