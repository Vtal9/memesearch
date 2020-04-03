from memes.models import Memes
from rest_framework import viewsets, permissions
from .serializers import MemesSerializer
from django.http import HttpRequest
from django.conf import settings
import yadisk


class MemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer

    def get_queryset(self):
        queryset = Memes.objects.all()
        permission_classes = [
            permissions.AllowAny
        ]
        # print(queryset[0].id)
        return queryset


class UnMarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.filter(textDescription="").order_by('?')[0:1]
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


class MarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.exclude(textDescription="")
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


class NewURLMemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer

    def get_queryset(self):
        y = settings.Y
        id_meme = self.request.GET.get('id')

        if id_meme is not None:
            queryset = Memes.objects.get(pk=id_meme)
            permission_classes = [
                permissions.AllowAny
            ]
            queryset.url = yadisk.functions.resources.get_download_link(y.get_session(), queryset.fileName)
            super(Memes, queryset).save(update_fields=['url'])

            return [queryset]
