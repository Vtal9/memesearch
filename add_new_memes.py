import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from vk_parser.parser import  download_memes
from memes.models import Memes
from markupUnmarked import markUp

from os import listdir
from os.path import isfile, join

ADD_NEW_MEMES_FOLDER = 'media'
FILE_VK_PUBS = join(ADD_NEW_MEMES_FOLDER, 'vk_pubs_list.txt')


def get_vk_pubs_from_file():
    pubs = []
    with open(FILE_VK_PUBS, 'r') as file:
        for line in file:
            pubs.append(line.replace('\n', ''))  # delete spaces
    return pubs


def upload_images_to_db(imgs_dest):
    # проходим по всем картинкам в папке
    for file in listdir(imgs_dest):
        if isfile(join(imgs_dest, file)):  # убеждаемся что это картинка
            new_meme = Memes(
                textDescription="",
                imageDescription=""
            )
            new_meme.image.name = join(imgs_dest.replace("/media", ''), file)
            new_meme.save("nodel")

    os.remove(os.path.join(imgs_dest, '*'))  # удаляем все файлы в папке, в том числе созданные после компрессора


def download_vk_memes(pubs_domains):
    for pub_domain in pubs_domains:  # качаем в папку, предназнач. для паблика мемы и загружаем в бд
        images_path = download_memes([pub_domain], dest_folder='pubs')  # качаем с одного паблика, чтобы после загрузки на сервер удалить
        upload_images_to_db(images_path)

    # после загрузки всех новых мемов, вызываем разметчик
    markUp()

if __name__ == '__main__':
    download_vk_memes(get_vk_pubs_from_file())
