from searchEngine.indexer import query
from searchEngine.indexer.simplifier import simplify_string


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
    result = query.make_query(text_query=query_text, image_query=query_image)
    return result
