import re

SIMPLIFIED_CHARACTERS = {'о': 'а', 'ё': 'и', 'е': 'и', 'з': 'с', 'ъ': '', 'ь': '', 'й': 'и', 'г': 'к', 'д': 'т',
                         'б': 'п', 'ж': 'ш', 'щ': 'ш', 'в': 'ф'}


def simplify_string(ustr):
    pattern = re.compile(r'[\W_]+')
    result = str(ustr).lower()
    result = pattern.sub(' ', result)

    for ch in SIMPLIFIED_CHARACTERS:
        result = result.replace(ch, SIMPLIFIED_CHARACTERS[ch])

    return result
