import django
import os
import platform

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from vk_parser.parser import download_memes
from memes.models import Memes
from tags.models import Tags
#from markupUnmarked import markUp

from os import listdir
from os.path import isfile, join

ADD_NEW_MEMES_FOLDER = 'media'
FILE_VK_PUBS = join(ADD_NEW_MEMES_FOLDER, 'vk_pubs_list.txt')


def get_vk_pubs_from_file():
    pubs = []
    tags = []
    with open(FILE_VK_PUBS, 'r') as file:
        for line in file:
            pub_tag = line.replace('\n', '')  # delete spaces
            pubs.append(pub_tag.split(':')[0])
            tags.append(pub_tag.split(':')[1])
    return pubs, tags


def upload_images_to_db(imgs_dest, pub_tag):
    i = 0
    images = listdir(imgs_dest)
    # проходим по всем картинкам в папке
    for file in images:
        i += 1
        os.system("clear" if platform.system() == 'Linux' else "cls")
        print("upload data to db and yd:\n {0}/{1}".format(i + 1, len(images)))
        if isfile(join(imgs_dest, file)):  # убеждаемся что это картинка
            new_meme = Memes(
                textDescription="",
                imageDescription=""
            )
            if pub_tag != '':
                new_meme.tags.add(Tags.objects.get(tag=pub_tag).id)
            new_meme.image.name = join(imgs_dest.replace("/media", ''), file)
            new_meme.save("nodel")

    # удаляем все файлы в папке, в том числе созданные после компрессора
    for file in listdir(imgs_dest):
        os.remove(os.path.join(imgs_dest, file))


def download_vk_memes(pubs_domains, tags):
    for i, pub_domain in enumerate(pubs_domains):  # качаем в папку, предназнач. для паблика мемы и загружаем в бд
        images_path = download_memes([pub_domain], dest_folder='pubs')  # качаем с одного паблика
        print('uploading data to db for: ' + pub_domain)
        upload_images_to_db(images_path, tags[i])  # выгружаем все на сервер

    # после загрузки всех новых мемов, вызываем разметчик
    #markUp()


if __name__ == '__main__':
    download_vk_memes(*get_vk_pubs_from_file())
