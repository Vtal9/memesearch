import requests
import shutil
import random
import sys
import os
import time
import platform

from . import vk_api_posts

VK_APP_TOKEN = '5a6b8abf5a6b8abf5a6b8abfe85a0458ab55a6b5a6b8abf0425e3ae56122e2996f6c968'


def download_image_from_url(img_url, destination, img_name=''):
    if destination[-1] != '/':
        destination += '/'

    response = requests.get(img_url, stream=True)

    destination += img_name if img_name != '' else str(random.randint(0, 1e8)) + ".jpg"

    with open(destination, 'wb+') as img_file:
        response.raw.decode_content = True
        shutil.copyfileobj(response.raw, img_file)
        del response


def get_pub_domains_from_file(filename):
    pub_domains = []

    with open(filename, 'r') as file:
        for line in file:
            pub_domains.append(line.replace(' ', '').replace('\n', ''))

    return pub_domains


def init_vk_api_posts():
    if VK_APP_TOKEN == '':
        print("Error: fill the token")
        exit(0)

    return vk_api_posts.VkApiPosts(VK_APP_TOKEN)


def get_input_data_from_args():
    pub_domains = []
    max_photos = 0

    if len(sys.argv) == 1 or len(sys.argv) > 3:
        print("Usage: python <program_name> [<pub_domain> <max_photos> | @<file_that_contains_pubs>]")
    elif len(sys.argv) == 2:
        if (sys.argv[1][0] == '@'):
            filename = sys.argv[1][1:].replace(' ', '')
            pub_domains = get_pub_domains_from_file(filename)
        else:
            pub_domains.append(sys.argv[1])
    else:
        pub_domains = [sys.argv[1]]
        max_photos = int(sys.argv[2])

    return pub_domains, max_photos


def download_memes(pub_domains, max_photos=0, dest_folder=''):  # max_photos=3 for debug
    vkPosts = init_vk_api_posts()  # it throws exit, if token is empty
    destination = "./empty"

    for pub_domain in pub_domains:
        min_timestamp = 0
        destination = os.path.join("./media", os.path.join(dest_folder, pub_domain.replace(' ', '')))
        memes_dest = os.path.join(destination, "memes")
        timestamp_dest = os.path.join(destination, 'timestamp.txt')
        try:
            os.mkdir(destination)  # create folder for this public
            os.mkdir(memes_dest)  # create folder for memes
            with open(timestamp_dest, 'w+') as file:  # create file for timestamp saving
                file.write("0")  # init timestamp
                min_timestamp = 0
        except:  # there are this folders
            with open(timestamp_dest, 'r') as file:
                min_timestamp = int(file.readline())

        # urls from posts and comments
        from_posts_with_timestamp, from_comments, latest_timestamp =\
            vkPosts.get_all_photos_urls_with_timestamps(
                pub_domain,
                max_photos,
                from_comments=False,
                min_timestamp=min_timestamp
            )


        for i, elem in enumerate(from_posts_with_timestamp):
            post_urls, posts_timestamp = elem
            for j, url in enumerate(post_urls):
                try:
                    download_image_from_url(url, memes_dest, "{img_name}.jpg".format(img_name=str(i) + "_" + str(j)))
                    os.system("clear" if platform.system() == 'Linux' else "cls")
                    print("Downloading images from {0}:\n {1}/{2}".format(pub_domain, i + 1, len(from_posts_with_timestamp)))
                except:
                    with open(timestamp_dest, 'w+') as file:
                        file.write(str(posts_timestamp))
                    time.sleep(10)  # sleep 10sec

#        for i, url in enumerate(from_posts):
#            download_image_from_url(url, memes_dest, "{img_name}.jpg".format(img_name=str(i)))
#            os.system("clear" if platform.system() == 'Linux' else "cls")
#            print("Downloading images from {0}:\n {1}/{2}".format(pub_domain, i + 1, len(from_posts)))

        with open(timestamp_dest, 'w+') as file:
            file.write(str(latest_timestamp))

    return memes_dest


if __name__ == '__main__':
    pub_domains, max_photos = get_input_data_from_args()
    download_memes(pub_domains, max_photos)


