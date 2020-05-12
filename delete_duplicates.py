import django
import os

from config import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from memes.models import Memes
from converter import convert


# self.request.user.ownImages.add(id_meme)


def delete_meme(meme):
    y = settings.Y
 #   y.remove(meme.fileName, permanently=True)  # не удаляем мем с яндекс диска, чтобы бэкапы норм работали
    Memes.objects.filter(id=meme.id).delete()  # удаляем из бд


# получаем всю нужную информацию с мемов, объединяем, в
# первый мем записываем всю полученную информацию, а остальные удаляем
def union_memes_and_delete_excess(identical_memes):
    tag_ids = set()  # чтобы исключить повторения
    text_descr = ""
    image_descr = ""
    likes = 0
    dislikes = 0
    owners_id = set()

    # получили всю нужную информацию по мемам
    for meme in identical_memes:
        likes += meme.likes
        dislikes += meme.dislikes
        for tag in meme.tags.all():
            tag_ids.add(tag.id)
        if not (meme.imageDescription is None):
            image_descr += meme.imageDescription  # конкатенируем, т.к. для описания не учитываются фразы, биграммы...
        if text_descr == "":  # т.е. берем текст только с одного произвольного мема. мб нужно подругому сделать
            text_descr = meme.textDescription
        for _owner in meme.owner.all():  # добавляем всех пользователей в сет, чтобы потом им присвоить единственный мем
            owners_id.add(_owner.id)

    first_meme = identical_memes[0]

    # для первого мема, нужно удалить из сета(tag_ids) все теги, которые он уже имеет
    for tag in first_meme.tags.all():
        if tag.id in tag_ids:
            tag_ids.remove(tag.id)

    # удаляем id овнеров, которые уже имеют этот first_meme
    for _owner in first_meme.owner.all():
        if _owner.id in owners_id:
            owners_id.remove(_owner.id)

    # всем остальным овнерам добавляем этот first_meme
    for owner_id in owners_id:
        User.objects.get(id=owner_id).ownImages.add(first_meme.id)

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
        print("img_hash: " + img_hash)
        identical_memes = Memes.objects.filter(image_hash=img_hash).all()  # получаем все мемы с этим хешом
        print("identical_memes: " + str(len(identical_memes)))
        union_memes_and_delete_excess(identical_memes)


if __name__ == '__main__':
    delete_duplicates()

    # после этого нужно переиндексировать бд
    convert()
