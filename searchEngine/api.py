from .indexer.simplifier import simplify_string
from .models import Images
from .models import TextDescriptions
from .models import ImageDescriptions
from rest_framework import viewsets, permissions
from .serializers import ImagesSerializer
from .serializers import TextDescriptionsSerializer
from .serializers import ImagesDescriptionsSerializer
from django.db.models import Q
from .indexer import indexer, info, query, simplifier
from django.http import HttpResponse


def splitQuery(str):
    res = []
    for i in str.split(", "):
        for j in i.split(" "):
            res.append(j)
    return res


def droptTables():
    TextDescriptions.objects.all().delete()
    ImageDescriptions.objects.all().delete()


def reIndexate(SAMPLE):
    queryset = Images.objects.all()

    SAMPLE = []

    for i in queryset:
        SAMPLE.append(info.MemeInfo(i.image, i.vector, ""))  # wrong

        index = indexer.full_index(SAMPLE)

    droptTables()

    for i in index.text_words.keys():
        if (i != ''):
            new_word = TextDescriptions.objects.create(word=i, index=index.text_words[i])
            new_word.save()

    for i in index.descr_words.keys():
        if (i != ''):
            new_word = ImageDescriptions.objects.create(word=i, index=index.text_words[i])
            new_word.save()


class ImagesViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ImagesSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            # приходит запрос в виде двух строк - слова через пробел, мб запятые, с ключевыми словами
            query_text = self.request.GET.get('qText')
            query_image = self.request.GET.get('qImage')

            # разбиваем запросы на отдельные слова.
            if query_text is not None:
                text_words = simplify_string(query_text)
            else:
                text_words = ""
            if query_image is not None:
                image_words = simplify_string(query_image)
            else:
                image_words = ""

            # ищем все картинки в описании которых совпало хотя бы одно слово. получаем список объектов модели
            queryset_text = TextDescriptions.objects.filter(Q(word__in=text_words))
            queryset_image = ImageDescriptions.objects.filter(Q(word__in=image_words))

            # получаем список из URL
            # ([urls],"error")
            result = query.make_query(text_phrase=query_text,
                                      descr_words=query_image)

            # записываем их в  response

            if result[1] == "":
                response = HttpResponse([{'url': i} for i in result[0]])
            else:
                response = HttpResponse(result[1])
            queryset = Images.objects.all()
            # return response
            return queryset

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


