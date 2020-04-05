import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foolproject.settings')
django.setup()

from memes.models import Memes
from searchEngine.indexer import indexer
from searchEngine.indexer.info import MemeInfo
from searchEngine.models import Images, TextDescriptions, ImageDescriptions


def convert():
    marked_up_memes = Memes.objects.exclude(textDescription="")
    infos = []
    # Images.objects.all().delete()
    # ImageDescriptions.objects.all().delete()
    # TextDescriptions.objects.all().delete()
    for meme in marked_up_memes:
        image = Images(id=meme.id)
        image.save()
        infos.append(MemeInfo(meme.id, meme.textDescription, meme.imageDescription))
    indexed = indexer.full_index(infos)
    for word in indexed.text_words:
        word_index = TextDescriptions(word=word, index=indexed.text_words[word])
        word_index.save()
    for word in indexed.descr_words:
        image_index = ImageDescriptions(word=word, index=indexed.descr_words[word])
        image_index.save()


if __name__ == '__main__':
    convert()
