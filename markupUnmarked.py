import os
import django
import torch
import sys
import linecache
import tracemalloc

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes, update_index_in_db
from searchEngine.indexer import indexer, info


from memes.ocr_pipeline.craft import CRAFT
from memes.ocr_pipeline.recognition import netInference, copyStateDict


def display_top(snapshot, key_type='lineno', limit=5):
    snapshot = snapshot.filter_traces((
        tracemalloc.Filter(False, "<frozen importlib._bootstrap>"),
        tracemalloc.Filter(False, "<unknown>"),
    ))
    top_stats = snapshot.statistics(key_type)

    print("Top %s lines" % limit)
    for index, stat in enumerate(top_stats[:limit], 1):
        frame = stat.traceback[0]
        print("#%s: %s:%s: %.1f KiB"
              % (index, frame.filename, frame.lineno, stat.size / 1024))
        line = linecache.getline(frame.filename, frame.lineno).strip()
        if line:
            print('    %s' % line)

    other = top_stats[limit:]
    if other:
        size = sum(stat.size for stat in other)
        print("%s other: %.1f KiB" % (len(other), size / 1024))
    total = sum(stat.size for stat in top_stats)
    print("Total allocated size: %.1f KiB" % (total / 1024))


def markUp(n=500):

    # ImageDescriptions.objects.all().delete()
    # TextDescriptions.objects.all().delete()

    tracemalloc.start()
    net = CRAFT()
    net.load_state_dict(copyStateDict(torch.load("memes/ocr_pipeline/craft_mlt_25k.pth", map_location='cpu')))
    net.eval()

    for _ in range(n):
        try:
            meme = Memes.objects.filter(textDescription="").order_by('?')[0]
        except Exception as e:
            break
        print("memeID: " + str(meme.id))
        y = settings.Y
        path = 'media/toMarkup'   # по идее по этому адрсу и будет лежать картинка, можешь поменять адрес как тебе надо
        y.download(meme.fileName, path)
        textDescription = " ".join(netInference(net, path))
        if os.path.isfile(path):
            os.remove(path)
        # Построение нового индекса по добавленному мему
        meme.textDescription = textDescription

        meme.is_mark_up_added = False
        meme.save()  # при сохранении индекс сам обновляется для этого мема
        snapshot = tracemalloc.take_snapshot()
        display_top(snapshot)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        markUp(sys.argv[1])
    else:
        markUp()
