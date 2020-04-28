from vk_parser.parser import download_memes

FILE_VK_PUBS = 'vk_pubs_list.txt'


def get_vk_pubs_from_file():
    pubs = []
    with open(FILE_VK_PUBS, 'r') as file:
        for line in file:
            pubs.append(line.replace('\n', ''))  # delete spaces
    return pubs


def download_vk_memes(pubs_domains):
    for pub_domain in pubs_domains:
        download_memes([pub_domain], dest_folder='pubs')  # качаем с одного паблика, чтобы после загрузки на сервер удалить


if __name__ == '__main__':
    download_vk_memes(get_vk_pubs_from_file())
