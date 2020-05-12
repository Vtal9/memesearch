from random import random, randint

import yadisk
from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from memes.models import Memes
from .serializers import MemesSerializer
import memes.algo.img2hash as img2hash
from PIL import Image


# ViewSets

# add to own collection and get all memes from all collection
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


# get all memes and meme by ID
class MemesViewSet(viewsets.ModelViewSet):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = Memes.objects.all()
        return queryset


# get memes that haven't been marked up
class UnMarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.filter(textDescription="", imageDescription="").order_by('?')[0:1]
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


# get memes that have been marked up
class MarkedMemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.exclude(textDescription="", imageDescription="")
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer


# get new url by meme ID
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


# APIs

# API for add and remove meme to own collection
class OwnMemesAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        method = self.request.GET.get('method')
        id_meme = self.request.GET.get('id')

        if method == "add":
            if self.request.user.is_authenticated:
                self.request.user.ownImages.add(id_meme)
        elif method == "remove":
            if self.request.user.is_authenticated:
                self.request.user.ownImages.remove(id_meme)
        return HttpResponse()


# API for update meme mark up
class UpdateMemesAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            text_descr = self.request.GET.get('text')
            image_descr = self.request.GET.get('image')
            id_meme = self.request.GET.get('id')
            meme = Memes.objects.get(pk=id_meme)
            meme.textDescription += " " + text_descr
            meme.imageDescription += " " + image_descr
            meme.is_mark_up_added = True
            meme.save(update_fields=['textDescription', 'imageDescription', 'is_mark_up_added'])
        return HttpResponse()


# API for add Tag to meme
class AddTagToMemeAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        id_meme = self.request.GET.get('id')
        id_tag = self.request.GET.get('tag')
        Memes.objects.get(pk=id_meme).tags.add(id_tag)
        return Response()


# API for like / dislike
class LikingMemeAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        method = self.request.GET.get('method')
        id_meme = self.request.GET.get('id')
        meme = Memes.objects.get(pk=id_meme)

        if method == 'like':
            meme.likes += 1
        else:
            meme.dislikes += 1

        meme.save(update_fields=['likes', 'dislikes', 'ratio', 'rating'])

        return JsonResponse({
            'likes': meme.likes,
            'dislikes': meme.dislikes
        })


# wall API
class WallAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        tags = self.request.GET.get('tags')
        if tags is not None and tags != '':
            tags = tags.split(',')
            memes = Memes.objects.filter(Q(tags__in=tags))
        else:
            memes = Memes.objects.all()

        banned_tags = self.request.GET.get('ban')
        if banned_tags is not None and banned_tags != '':
            banned_tags = banned_tags.split(',')
            memes = memes.exclude(Q(tags__in=banned_tags))

        it = self.request.GET.get('it')
        it = 0 if it is None else int(it)

        size = self.request.GET.get('size')
        size = 15 if size is None else int(size)

        sorted_by = self.request.GET.get('filter')  # time, ratio, rating
        memes = memes.order_by("-" + sorted_by)[it * size: (it + 1) * size]
        return JsonResponse([{
            'id': i.id,
            'url': i.url,
            'likes': i.likes,
            'dislikes': i.dislikes
        } for i in memes], safe=False)


class TinderAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, *args, **kwargs):
        memes = Memes.objects.all()

        banned_tags = self.request.GET.get('ban')
        if banned_tags is not None and banned_tags != '':
            banned_tags = banned_tags.split(',')
            memes = memes.exclude(Q(tags__in=banned_tags))

        meme = memes.get(pk=randint(0, memes.count() - 1))
        return JsonResponse({
            "id": meme.id,
            "url": meme.url,
            "is_mine": 1 if self.request.user.is_authenticated and self.request.user.ownImages.filter(pk=meme.id) else 0
        })


# get all memes and meme by ID
class MemesUploadAPI(generics.GenericAPIView):
    serializer_class = MemesSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def _check_img_uniqueness(self):
        if self.request.data['image'] is not None and self.request.data['image'] != '':
            image_hash = img2hash.hash_from_image(Image.open(self.request.data['image']))

            # проверяем есть ли у нас мем с таким хешом, и если нет, то бросается исключение, которое игнорим.
            # если исключение не бросится, значит мем с таким хешом существует и мы не сохраняем что сейчас имеем
            try:
                print("try")
                existed_meme = Memes.objects.get(Q(image_hash=image_hash))
                print("existed_meme=", existed_meme)
                # print("МЕМ НЕ БУДЕТ ДОБАВЛЕН")
                # TODO: union memes
                return False, existed_meme, image_hash
            except:
                # print("МЕМ БУДЕТ ДОБАВЛЕН")
                return True, None, image_hash  # meme is uniq

    def post(self, request, *args, **kwargs):
        is_uniq_img, existed_meme, meme_hash = self._check_img_uniqueness()  # если true, то мем будет добавлен
        if is_uniq_img:  # self.image_hash мы ставим в функции проверки _check_img_uniq...
            meme = Memes(textDescription=self.request.data['textDescription'],
                         imageDescription=self.request.data['imageDescription'],
                         image=self.request.data['image'],
                         image_hash=meme_hash)
            meme.save()
            return Response({'id': meme.id,
                             'url': meme.url,
                             'meme_already_exist': False
                             })
        else:
            return Response({
                'id': existed_meme.id,
                'url': existed_meme.url,
                'meme_already_exist': True
            })
