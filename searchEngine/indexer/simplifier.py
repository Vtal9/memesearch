import re

SIMPLIFIED_CHARACTERS = {'о': 'а', 'ё': 'и', 'е': 'и', 'з': 'с', 'ъ': '', 'ь': '', 'й': 'и', 'г': 'к', 'д': 'т',
                         'б': 'п', 'ж': 'ш', 'щ': 'ш', 'в': 'ф'}


def simplify_string(ustr):
    if ustr is None or ustr.replace(' ', '') == '':
        return ''

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

    res = " ".join(res_words).replace('ё', 'и').replace('й', 'и') # костылим

    if res == ' ':  # костылим
        return ''

    if res[0] == ' ':
        res = res[1:]
    if res[-1] == ' ':
        res = res[:-1]

    return res
