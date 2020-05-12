import os
import django
import torch
import sys

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes, update_index_in_db
from searchEngine.indexer import indexer, info


from memes.ocr_pipeline.craft import CRAFT
from memes.ocr_pipeline.recognition import netInference, copyStateDict


def markUp(n=500):

    # ImageDescriptions.objects.all().delete()
    # TextDescriptions.objects.all().delete()

    net = CRAFT()
    net.load_state_dict(copyStateDict(torch.load("memes/ocr_pipeline/craft_mlt_25k.pth", map_location='cpu')))
    net.eval()

    y = settings.Y
    for _ in range(n):
        print('net size', sys.getsizeof(net))
        try:
            meme = Memes.objects.filter(textDescription="").order_by('?')[0]
        except Exception as e:
            break
        print("memeID: " + str(meme.id))
        path = 'media/toMarkup'   # по идее по этому адрсу и будет лежать картинка, можешь поменять адрес как тебе надо
        y.download(meme.fileName, path)
        print('y size', sys.getsizeof(y))
        textDescription = " ".join(netInference(net, path))
        print('text descr size', sys.getsizeof(textDescription))
        if os.path.isfile(path):
            os.remove(path)
        # Построение нового индекса по добавленному мему
        meme.textDescription = textDescription

        meme.is_mark_up_added = False
        meme.save()  # при сохранении индекс сам обновляется для этого мема
        print('meme size', sys.getsizeof(meme))


if __name__ == '__main__':
    if len(sys.argv) > 1:
        markUp(sys.argv[1])
    else:
        markUp()
