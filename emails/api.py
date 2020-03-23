from emails.models import Emails
from rest_framework import viewsets, permissions
from .serializers import EmailsSerializer

class EmailsViewSet(viewsets.ModelViewSet):
	queryset = Emails.objects.all()
	permission_classes = [
		permissions.AllowAny
	]
	serializer_class = EmailsSerializer
