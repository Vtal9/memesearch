from . import simplifier
from ..models import TextDescriptions
from ..models import ImageDescriptions
from django.db.models import Q

from memes.models import Memes

BIGRAM_WEIGHT = 1
PHRASE_WEIGHT = 30
DESCRIPTION_WEIGHT = 3

DB_INDEX_TEXT_SAMPLE = {'сапака': "{'id1': [0, 2], 'id2': [0, 2]}", 'ни': "{'id1': [1], 'id2': [1, 5]}",
                        'пака': "{'id1': [3], 'id2': [3]}", 'ана': "{'id1': [4], 'id2': [4]}",
                        'калатна': "{'id1': [5], 'id2': [6]}"}
DB_INDEX_DESCR_SAMPLE = {"сапака": "{'id1', 'id2'}", "фалк": "{'id2'}", "тфикс": "{'id1'}"}


# input = "{'https:dasdasdasdk.comsads/dsd': [0, 1, 2]}"
def parse_db_index(db_index_str, is_descr=False):
    if is_descr:
        simplified_db_index_str = db_index_str.replace('\'', '')[1:-1].replace(',', '')
        result = set(simplified_db_index_str.split(' '))
        if 'None' in result:
            result.remove('None')
        return result
    else:
        id_poss = {}
        s = db_index_str.replace('\'', '')[1:-1].replace('],', ']')

        for token in s.split(']')[:-1]:  # -1 because after ']', next is empty
            temp = token.split(': ')
            id = temp[0].replace(' ', '')
            if id != 'None':
                id_poss[temp[0].replace(' ', '')] = [int(num) for num in temp[1][1:].split(',')]
        return id_poss


def db_query(word, is_descr=False):
    return ImageDescriptions.objects.get(Q(word=word)).index if is_descr else \
        TextDescriptions.objects.get(Q(word=word)).index


def db_result(word, is_descr=False):
    return {word: parse_db_index(db_query(word, is_descr), is_descr)}


def __intersection(*args):
    intersect = set(args[0])
    for arg in args:
        intersect &= set(arg)
    return list(intersect)


def _one_word_query(word, word_index, ids_weight={}):
    if len(word) == 1 and word != 'я':
        return ids_weight

    for id in word_index[word].keys():
        if id in ids_weight:
            ids_weight[id] += len(word_index[word][id])
        else:
            ids_weight[id] = len(word_index[word][id])
    return ids_weight


def _bigram_query(word1, word2, word_index, ids_weight={}):
    try:  # it throws exception if word_i not contains in word_index
        common_ids = __intersection(word_index[word1].keys(), word_index[word2].keys())

        for id in common_ids:
            poss1 = word_index[word1][id]
            poss2 = [pos - 1 for pos in word_index[word2][id]]

            if len(__intersection(poss1, poss2)) != 0:
                if id in ids_weight.keys():
                    ids_weight[id] += BIGRAM_WEIGHT
                else:
                    ids_weight[id] = BIGRAM_WEIGHT  # + 2
    except:
        pass

    return ids_weight


def _phrase_query(phrase, word_index, ids_weight={}):
    try:  # it throws exception if word_i not contains in word_index
        words = phrase.split(' ')
        common_ids = __intersection(*word_index.values())

        for id in common_ids:
            words_pos = []
            for i, word in enumerate(words):
                words_pos.append(pos - i for pos in word_index[word][id])

            if len(__intersection(*words_pos)) != 0:
                if id in ids_weight.keys():
                    ids_weight[id] += PHRASE_WEIGHT * len(words)
                else:
                    ids_weight[id] = PHRASE_WEIGHT * len(words) + len(words)
    except:
        pass

    return ids_weight


def make_query_by_text_query(text_query, queryset):
    if text_query is None or text_query == '':
        return {}

    simplified_text_query = simplifier.simplify_string(text_query)

    words = simplified_text_query.split(' ')
    words_set = set(words)

    if '' in words_set:
        words_set.remove('')

    word_text_index = {}

    for word in words_set:  # optimisation
        try:
            word_text_index.update(db_result(word, is_descr=False))
        except:
            pass

    if len(word_text_index) == 0:
        return None

    ids_weight = {}

    for word in word_text_index.keys():
        ids_weight.update(_one_word_query(word, word_text_index, ids_weight))

    rows = Memes.objects.filter(Q(id__in=list(ids_weight.keys())))
    for row in rows:
        ids_weight[str(row.id)] /= float(len(simplifier.simplify_string(row.textDescription).split(' ')))

    if len(words) > 2:
        i = 0
        while i + 1 < len(words):
            ids_weight.update(_bigram_query(words[i], words[i + 1], word_text_index, ids_weight))
            i += 1
        ids_weight.update(_phrase_query(simplified_text_query, word_text_index, ids_weight))

    return ids_weight


def make_query_by_image_query(image_query, queryset):
    if image_query is None or image_query == '':
        return {}

    simplified_image_query = simplifier.simplify_string(image_query)
    words = simplified_image_query.split(' ')

    ids_weight = {}

    for word in words:
        try:
            ids = parse_db_index(ImageDescriptions.objects.get(word=word), is_descr=True)
            for id in ids:
                if id in ids_weight:
                    ids_weight[id] += DESCRIPTION_WEIGHT
                else:
                    ids_weight[id] = DESCRIPTION_WEIGHT
        except:
            pass

    return ids_weight


def make_query_old(text_query="", image_query="", text_queryset=(), image_queryset=()):
    if text_query == "" and image_query == "":
        return [], "query is empty"

    if text_query == "":  # image_query != ""
        common_ids_from_descr = make_query_by_image_query(image_query, image_queryset)
        return list(set(common_ids_from_descr)), ""

    ids_weight_from_text = make_query_by_text_query(text_query, text_queryset)

    if ids_weight_from_text is None:
        if image_query == "":
            return [], "no text words found in the database"

        common_ids_from_descr = make_query_by_image_query(image_query, image_queryset)
        return list(set(common_ids_from_descr)), ""
    else:
        if image_query != "":
            common_ids_from_descr = set(make_query_by_image_query(image_query, image_queryset))
            for id in common_ids_from_descr:
                if id in ids_weight_from_text.keys():
                    ids_weight_from_text[id] += DESCRIPTION_WEIGHT
                else:
                    ids_weight_from_text[id] = DESCRIPTION_WEIGHT
        ranked_result = sorted(ids_weight_from_text, key=ids_weight_from_text.get, reverse=True)
        ranked_result = list(dict.fromkeys(ranked_result))  # delete duplicates
        return ranked_result, ""


def make_query(text_query="", image_query="", text_queryset=(), image_queryset=()):
    ids_weight_from_descr = make_query_by_image_query(image_query, image_queryset)
    ids_weight_from_text = make_query_by_text_query(text_query, text_queryset)
    result = ids_weight_from_text
    for id in ids_weight_from_descr:
        if id in result.keys():
            result[id] += ids_weight_from_descr[id]
        else:
            result[id] = ids_weight_from_descr[id]
    ranked_result = []
    if result is not None:
        ranked_result = sorted(result, key=result.get, reverse=True)
        ranked_result = list(dict.fromkeys(ranked_result))  # delete duplicates
    return ranked_result, ""
