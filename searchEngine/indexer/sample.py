from . import indexer
from . import info
from . import query

if __name__ == '__main__':
    SAMPLE = []
    SAMPLE.append(info.MemeInfo("url1", "собака не собака, пока она голодна", "собака, твикс"))
    SAMPLE.append(info.MemeInfo("url2", "собака не собака, пока она не голодна", "волк, собака"))

    index = indexer.full_index(SAMPLE)
    print(index.text_words)
    print(query.make_query(text_phrase="собака пока голодна", descr_words=""))
