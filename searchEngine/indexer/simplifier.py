import re

SIMPLIFIED_CHARACTERS = {'о': 'а', 'ё': 'и', 'е': 'и', 'з': 'с', 'ъ': '', 'ь': '', 'й': 'и', 'г': 'к', 'д': 'т',
                         'б': 'п', 'ж': 'ш', 'щ': 'ш', 'в': 'ф'}


def simplify_string(ustr):
    pattern = re.compile(r'[\W_]+')
    result = str(ustr).lower()
    temp = pattern.sub(' ', result)

    words = temp.split(' ')
    res_words = []
    for word in words:
        if len(word) > 3:
            for ch in SIMPLIFIED_CHARACTERS:
                word = word.replace(ch, SIMPLIFIED_CHARACTERS[ch])
        res_words.append(word)

    return " ".join(res_words).replace('ё', 'и').replace('й', 'и')
