import os

import django
from django.db.models import Q

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from tags.models import Tags

TAGS_TO_DELETE = ['м', 'кот', 'Другое', 'Расизм']


def delete_tags():
    Tags.objects.filter(Q(tag__in=TAGS_TO_DELETE)).delete()


if __name__ == '__main__':
    delete_tags()
