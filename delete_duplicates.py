import django
import os

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from memes.models import Memes
from converter import convert


# self.request.user.ownImages.add(id_meme)


def delete_meme(meme):
    y = settings.Y
    y.remove(meme.fileName, permanently=True)  # удаляем мем с яндекс диска
    Memes.objects.filter(id=meme.id).delete()  # удаляем из бд


# получаем всю нужную информацию с мемов, объединяем, в
# первый мем записываем всю полученную информацию, а остальные удаляем
def union_memes_and_delete_excess(identical_memes):
    tag_ids = set()  # чтобы исключить повторения
    text_descr = ""
    image_descr = ""
    likes = 0
    dislikes = 0

    # получили всю нужную информацию по мемам
    for meme in identical_memes:
        likes += meme.likes
        dislikes += meme.dislikes
        for tag in meme.tags.all():
            tag_ids.add(tag.id)
        image_descr += meme.imageDescription  # конкатенируем, т.к. для описания не учитываются фразы, биграммы...
        if text_descr == "":  # т.е. берем текст только с одного произвольного мема. мб нужно подругому сделать
            text_descr = meme.textDescription

    first_meme = identical_memes[0]

    # для первого тега, нужно удалить из сета(tag_ids) все теги, которые он уже имеет
    for tag in first_meme.tags.all():
        if tag.id in tag_ids:
            tag_ids.remove(tag.id)

    # устанавливаем полученные значения
    first_meme.likes = likes
    first_meme.dislikes = dislikes
    for id_tag in tag_ids:
        first_meme.tags.add(id_tag)
    first_meme.textDescription = text_descr
    first_meme.imageDescription = image_descr

    first_meme.save()

    # удаляем все остальные мемы из бд и с яд
    for meme in identical_memes[1:]:
        delete_meme(meme)


def find_unique_img_hashes() -> set:
    img_hashes_set = set()  # будут только уникальные значения
    for row in Memes.objects.all():
        img_hashes_set.add(row.image_hash)

    return img_hashes_set


def delete_duplicates():
    # ищем все возможные существующие хеши, чтобы потом поитерировав по этой сету, удалить все лишние
    img_hashes_set = find_unique_img_hashes()

    for img_hash in img_hashes_set:
        identical_memes = Memes.objects.filter(image_hash=img_hash).all()  # получаем все мемы с этим хешом
        union_memes_and_delete_excess(identical_memes)


if __name__ == '__main__':
    delete_duplicates()

    # после этого нужно переиндексировать бд
    convert()
