from django.db import models
from django.db.models import F, Q
from django.conf import settings
from django.contrib.auth.models import User

import re
import time
import yadisk

from searchEngine.indexer import indexer
from searchEngine.indexer import info
import searchEngine.models as indexer_models
from searchEngine.indexer import simplifier
from searchEngine.indexer import misc


def update_index_in_db(text, descr, new_index_text, new_index_descr):
    stext = simplifier.simplify_string(text)
    sdescr = simplifier.simplify_string(descr)

    text_words = stext.split(' ')
    descr_words = sdescr.split(' ')

    text_index = indexer_models.TextDescriptions.objects.filter(Q(word__in=text_words))
    descr_index = indexer_models.ImageDescriptions.objects.filter(Q(word__in=descr_words))

    updated_text_words = []
    if not (text_index is None):  # otherwise no need to update
        for row in text_index:
            updated_text_words.append(row.word)
            row.index = str(misc.union_text(row.index, new_index_text[row.word]))
            row.save()

    for tword in text_words:
        if not (tword in updated_text_words):
            indexer_models.TextDescriptions.objects.create(word=tword, index=new_index_text[tword])

    updated_descr_words = []
    if not (descr_index is None):  # otherwise no need to update
        for row in descr_index:
            updated_descr_words.append(row.word)
            row.index = str(misc.union_descr(row.index, new_index_descr[row.word]))
            row.save()

    for dword in descr_words:
        if not (dword in updated_descr_words):
            indexer_models.ImageDescriptions.objects.create(word=dword, index=new_index_descr[dword])


# Create your models here.
class Memes(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    image = models.ImageField(blank=True, null=True)
    fileName = models.TextField(blank=True, null=True)
    url = models.URLField(blank=True, null=True, max_length=500)
    textDescription = models.TextField(blank=True, null=True)
    imageDescription = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="ownImages")

    def delete(self):
        pass

    def save(self, *args, **kwargs):
        if self.image != '':
            # Разметка мема (текст)
            # self.textDescription = re.sub("[^а-яa-z0-9 ]+", "", " ".join(getTextFromImage(self.image)).lower())

            # Сохранение мема на яндекс.диск
            y = settings.Y
            name = self.image.url.split(".")
            self.fileName = ".".join(name[:-1]) + "_{}".format(time.time()) + "." + name[-1]
            y.upload(self.image, self.fileName)
            self.url = yadisk.functions.resources.get_download_link(y.get_session(), self.fileName)

            self.image = None

        # Построение нового индекса по добавленному мему
        meme_index = indexer.full_index([info.MemeInfo(self.id, self.textDescription, self.imageDescription)])
        update_index_in_db(self.textDescription, self.imageDescription, meme_index.text_words, meme_index.descr_words)

        super(Memes, self).save(*args, **kwargs)
        if self.id % 100 == 0:
            y.upload("db.sqlite3", "backup/db_{}.sqlite3".format(self.id))
