import os
import django
import torch

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes, update_index_in_db
from searchEngine.indexer import indexer, info


from memes.ocr_pipeline.craft import CRAFT
from memes.ocr_pipeline.recognition import netInference, copyStateDict


def markUp():
    un_marked_up_memes = Memes.objects.filter(textDescription="")

    # ImageDescriptions.objects.all().delete()
    # TextDescriptions.objects.all().delete()

    net = CRAFT()
    net.load_state_dict(copyStateDict(torch.load("memes/ocr_pipeline/craft_mlt_25k.pth", map_location='cpu')))
    net.eval()

    for meme in un_marked_up_memes:
        print("memes " + str(len(un_marked_up_memes)))
        print("memeID: " + str(meme.id))
        y = settings.Y
        path = 'media/toMarkup'   # по идее по этому адрсу и будет лежать картинка, можешь поменять адрес как тебе надо
        y.download(meme.fileName, path)
        textDescription, imageDescription = " ".join(netInference(net, path)), ""
        if os.path.isfile(path):
            os.remove(path)
        # Построение нового индекса по добавленному мему
        meme.textDescription = textDescription

        meme.is_mark_up_added = False
        meme.save() # при сохранении индекс сам обновляется для этого мема


if __name__ == '__main__':
    markUp()
