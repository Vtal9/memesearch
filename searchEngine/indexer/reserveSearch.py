from config.settings import DEV_API_KEY, PROJECT_CX, DEV_API_KEY2, PROJECT_CX2
from google_images_search import GoogleImagesSearch


def google_search(query_text, num=5, again=False):
    gis = \
        GoogleImagesSearch(DEV_API_KEY, PROJECT_CX) if not again else GoogleImagesSearch(DEV_API_KEY2, PROJECT_CX2)
    gis.search({'q': '{query} meme'.format(query=query_text), 'num': num})
    return [img._url for img in gis.results()]


def reserve_search(query_text):
    urls = []
    try:
        urls = list(google_search(query_text, again=False))
    except Exception as ex:
        print("GOOGLE SEARCH ERROR: " + str(ex))
        try:
            urls = list(google_search(query_text, again=True))
        except:
            print("some exception in reserve_search")
    return urls
