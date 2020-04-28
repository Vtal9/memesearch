import os
import django

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes
from memes.algo import img2hash
from PIL import Image


def update_hashes():
    all_memes = Memes.objects.all()

    y = settings.Y
    path = 'media/temp'

    for meme in all_memes:
        y.download(meme.fileName, path)
        image_hash = img2hash.hash_from_image(Image.open(path))
        Memes.objects.filter(pk=meme.pk).update(image_hash=image_hash)


if __name__ == '__main__':
    update_hashes()
