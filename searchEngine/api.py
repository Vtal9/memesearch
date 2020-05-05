from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions, generics

from memes.models import Memes
from tags.models import Tags
from .indexer.reserveSearch import reserve_search
from .models import ImageDescriptions
from .models import TextDescriptions
from .search import search
from .serializers import ImagesDescriptionsSerializer
from .serializers import ImagesSerializer
from .serializers import TextDescriptionsSerializer


# APIs

# search by all memes
class SearchAPI(generics.GenericAPIView):
    serializer_class = ImagesSerializer

    def get(self, request, *args, **kwargs):
        # приходит запрос в виде двух строк - слова через пробел, мб запятые, с ключевыми словами
        query_text = self.request.GET.get('qText')
        query_image = self.request.GET.get('qImage')

        # поиск и ранжировка всех мемов подходящих под запрос
        result = search(query_text, query_image)

        extra_urls = []

        # фильтруем по тегам
        query_tags = self.request.GET.get('tags')
        res = result[0]
        if query_tags is not None and query_tags != '':
            tags = query_tags.split(',')
            for tag_id in tags:
                res = [meme.id for meme in Tags.objects.get(pk=tag_id).taggedMemes.filter(Q(id__in=res))]
        else:
            if len(result[0]) < 10:
                extra_urls = reserve_search(query_text)

        # записываем их в  response
        iteration = self.request.GET.get('it')
        iteration = 0 if iteration is None else int(iteration)

        size = self.request.GET.get('size')
        size = 15 if size is None else int(size)

        if result[1] == "":
            response = JsonResponse([{
                'id': i,
                'url': Memes.objects.get(pk=i).url
            } for i in res[iteration * size:(iteration + 1) * size]] + [{
                'url': url
            } for url in extra_urls], safe=False)
        else:
            response = HttpResponse(result[1])
        return response


# search by own memes
class SearchOwnMemesAPI(generics.GenericAPIView):
    serializer_class = ImagesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, *args, **kwargs):
        # приходит запрос в виде двух строк - слова через пробел, мб запятые, с ключевыми словами
        query_text = self.request.GET.get('qText')
        query_image = self.request.GET.get('qImage')

        # поиск и ранжировка всех мемов подходящих под запрос
        result = search(query_text, query_image)
        # фильтруем по своим мемам
        queryset = request.user.ownImages.filter(Q(id__in=result[0]))

        # фильтруем по тегам
        query_tags = self.request.GET.get('tags')
        res = [i.id for i in queryset]
        if query_tags is not None and query_tags != '':
            tags = query_tags.split(',')
            for tag_id in tags:
                res = [meme.id for meme in Tags.objects.get(pk=tag_id).taggedMemes.filter(Q(id__in=res))]
        res_set = set(res)
        res = []
        for i in result[0]:
            if int(i) in res_set:
                res.append(i)
        # записываем их в  response
        iteration = self.request.GET.get('it')
        iteration = 0 if iteration is None else int(iteration)

        size = self.request.GET.get('size')
        size = 15 if size is None else int(size)
        if result[1] == "":
            response = JsonResponse([{
                'id': i,
                'url': Memes.objects.get(pk=i).url
            } for i in res[iteration * size:(iteration + 1) * size]], safe=False)
        else:
            response = HttpResponse(result[1])

        return response


# View Sets
# get table with text description indexes
class TextDescriptionsViewSet(viewsets.ModelViewSet):
    queryset = TextDescriptions.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TextDescriptionsSerializer


# get table with image description indexes
class ImageDescriptionsViewSet(viewsets.ModelViewSet):
    queryset = ImageDescriptions.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ImagesDescriptionsSerializer


# get own collection
class OwnMemesViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ImagesSerializer

    def get_queryset(self):
        return self.request.user.ownImages.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# get all memes that can be found
class MemesViewSet(viewsets.ModelViewSet):
    queryset = Memes.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ImagesSerializer
