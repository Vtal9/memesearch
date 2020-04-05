from . import simplifier
from . import info


# output = ({word1:url, word2:url}, {word11:url, [pos1, pos2], word2:url, [pos1, pos2]})
def _make_index(imeme):
    descr_index = {}
    for word in simplifier.simplify_string(imeme.img_descr).split(' '):  # simple index
        descr_index[word] = imeme.id

    # input = "word1 word2 ..."
    # output = {word1: [pos1, pos2], word2: [pos3, pos4], ...}
    simplified_splitted_text = simplifier.simplify_string(imeme.img_text).split(' ')
    output_index = {}
    for index, word in enumerate(simplified_splitted_text):
        if word in output_index.keys():
            output_index[word].append(index)
        else:
            output_index[word] = [index]

    text_index = {}
    for word in output_index.keys():
        text_index[word] = {imeme.id: output_index[word]}

    return descr_index, text_index


def full_index(imemes):  # list of MemeInfo
    descr_total_index = {}
    text_total_index = {}

    for imeme in imemes:
        descr_index, text_index = _make_index(imeme)
        for word in descr_index.keys():
            if word in descr_total_index.keys():
                descr_total_index[word].add(descr_index[word])
            else:
                descr_total_index[word] = {descr_index[word]}

        for word in text_index.keys():
            if word in text_total_index.keys():
                text_total_index[word].update(text_index[word])
            else:
                text_total_index[word] = text_index[word]

    return info.IndexInfo(descr_words=descr_total_index, text_words=text_total_index)
