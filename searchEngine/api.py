from .indexer.simplifier import simplify_string
from .models import Images
from .models import TextDescriptions
from .models import ImageDescriptions
from rest_framework import viewsets, permissions, generics
from .serializers import ImagesSerializer
from .serializers import TextDescriptionsSerializer
from .serializers import ImagesDescriptionsSerializer
from django.db.models import Q
from .indexer import indexer, info, query, simplifier
from django.http import HttpResponse, JsonResponse


def split_query(q):
    res = []
    for i in q.split(", "):
        for j in i.split(" "):
            res.append(j)
    return res


def search(query_text, query_image):
    # разбиваем запросы на отдельные слова.
    if query_text is not None:
        text_words = simplify_string(query_text)
    else:
        text_words = ""
        query_text = ""
    if query_image is not None:
        image_words = simplify_string(query_image)
    else:
        image_words = ""
        query_image = ""

    # на данный момент достаем все внутри индексера
    # ищем все картинки в описании которых совпало хотя бы одно слово. получаем список объектов модели
    # queryset_text = TextDescriptions.objects.filter(Q(word__in=text_words))
    # queryset_image = ImageDescriptions.objects.filter(Q(word__in=image_words))

    # получаем список из URL
    # ([urls],"error")
    if query_text == query_image:  # не расширенный поиск, тогда объединяем
        res1 = query.make_query(text_phrase=query_text,
                                descr_words="")
        res2 = query.make_query(text_phrase="",
                                descr_words=query_text)
        result = [list(dict.fromkeys(list(res2[0] + res1[0]))), ""]  # delete duplicates
    else:
        result = query.make_query(text_phrase=query_text,
                                  descr_words=query_image)

    return result

class SearchAPI(generics.GenericAPIView):
    serializer_class = ImagesSerializer

    def get(self, request, *args, **kwargs):

        print(TextDescriptions.objects.all()[0].index)
        # приходит запрос в виде двух строк - слова через пробел, мб запятые, с ключевыми словами
        query_text = self.request.GET.get('qText')
        query_image = self.request.GET.get('qImage')
        result = search(query_text, query_image)

        # записываем их в  response
        if result[1] == "":
            response = JsonResponse([{'id': i} for i in result[0]], safe=False)
        else:
            response = HttpResponse(result[1])
        return response


class TextDescriptionsViewSet(viewsets.ModelViewSet):
    queryset = TextDescriptions.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TextDescriptionsSerializer


class ImageDescriptionsViewSet(viewsets.ModelViewSet):
    queryset = ImageDescriptions.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ImagesDescriptionsSerializer


class OwnMemesViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ImagesSerializer

    def get_queryset(self):
        return self.request.user.ownImages.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MemesViewSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ImagesSerializer


class SearchOwnMemesAPI(generics.GenericAPIView):
    serializer_class = ImagesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, *args, **kwargs):
        # приходит запрос в виде двух строк - слова через пробел, мб запятые, с ключевыми словами
        query_text = self.request.GET.get('qText')
        query_image = self.request.GET.get('qImage')
        result = search(query_text, query_image)
        queryset = request.user.ownImages.filter(Q(id__in=result[0]))

        # записываем их в  response
        if result[1] == "":
            response = JsonResponse([{'id': i.id} for i in queryset], safe=False)
        else:
            response = HttpResponse(result[1])

        return response
