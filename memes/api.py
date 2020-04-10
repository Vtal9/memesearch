import yadisk
from django.conf import settings
from django.http import HttpResponse
from rest_framework import viewsets, permissions, generics

from memes.models import Memes
from .serializers import MemesSerializer


class OwnMemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer

    def get_queryset(self):
        queryset = self.request.user.ownImages.all()
        permission_classes = [
            permissions.AllowAny
        ]
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            self.request.user.ownImages.add(serializer.save().id)


class MemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer

    def get_queryset(self):
        queryset = Memes.objects.all()
        permission_classes = [
            permissions.AllowAny
        ]
        return queryset

    # def patch(self, request, pk):
    #     print("patch")
    #     queryset = Memes.objects.get(pk=pk)
    #     queryset.textDescription += " " + request.textDescription
    #     queryset.imageDescription += " " + request.imageDescription
    #     super(Memes, queryset).save(update_fields=['textDescription, imageDescription'])


class UnMarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.filter(textDescription="", imageDescription="").order_by('?')[0:1]
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


class MarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.exclude(textDescription="", imageDescription="")
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


class NewURLMemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        y = settings.Y
        id_meme = self.request.GET.get('id')

        if id_meme is not None:
            queryset = Memes.objects.get(pk=id_meme)

            queryset.url = yadisk.functions.resources.get_download_link(y.get_session(), queryset.fileName)
            super(Memes, queryset).save(update_fields=['url'])

            return [queryset]


class OwnMemesAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        method = self.request.GET.get('method')
        id_meme = self.request.GET.get('id')
        print(self.request.GET)
        print("method", method)
        if method == "add":
            if self.request.user.is_authenticated:
                print("add")
                self.request.user.ownImages.add(id_meme)
        elif method == "remove":
            if self.request.user.is_authenticated:
                self.request.user.ownImages.remove(id_meme)
        return HttpResponse()
