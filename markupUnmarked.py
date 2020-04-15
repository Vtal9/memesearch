import os
import django

from foolproject import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foolproject.settings')
django.setup()

from memes.models import Memes, update_index_in_db
from searchEngine.indexer import indexer, info
from searchEngine.indexer.info import MemeInfo
from searchEngine.models import Images, TextDescriptions, ImageDescriptions


def ARTEM_RAZMET_MEM():
    pass

def markUp():
    un_marked_up_memes = Memes.objects.filter(textDescription="", imageDescription="")

    # Images.objects.all().delete()
    # ImageDescriptions.objects.all().delete()
    # TextDescriptions.objects.all().delete()
    for meme in un_marked_up_memes:
        y = settings.Y
        y.download(meme.fileName, 'media/toMarkup') # по идее по этому адрсу и будет лежать картинка, можешь поменять адрес как тебе надо
        textDescription, imageDescription = ARTEM_RAZMET_MEM('media/toMarkup')

        # # Построение нового индекса по добавленному мему
        meme_index = indexer.full_index([info.MemeInfo(meme.id, textDescription, imageDescription)])
        update_index_in_db(meme.textDescription, meme.imageDescription, meme_index.text_words, meme_index.descr_words)

        meme.save()


if __name__ == '__main__':
    markUp()
