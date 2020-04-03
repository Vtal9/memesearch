from .indexer import indexer
from .models import Images
from .models import TextDescriptions
from .models import ImageDescriptions


def indexate(data_base):
    return indexer.full_index(data_base)
