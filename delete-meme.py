import os

import django
from django.db.models import Q


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes


MEMES_TO_DELETE = [48]


def delete_tags():
    Memes.objects.filter(Q(id__in=MEMES_TO_DELETE)).delete()


if __name__ == '__main__':
    delete_tags()
