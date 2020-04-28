import requests
import platform
import os
import json


class VkApiPosts:
    def __init__(self, token, version=5.92):
        self.token = token
        self.version = version

    def get_json_data(self, pub_domain, count, offset):
        response = requests.get('https://api.vk.com/method/wall.get',
                                params={
                                    'access_token': self.token,
                                    'v': self.version,
                                    'domain': pub_domain,
                                    'count': count,
                                    'offset': offset
                                })

        try:
            return response.json()['response']
        except:
            print("Error: something went wrong. May be pub is closed")
            return None

    def get_all_json_data(self, pub_domain, max_posts=0):
        try:
            num_posts = int(self.get_json_data(pub_domain, 0, 1)['count'])
        except:
            print("Error: something went wrong. May be pub is closed")
            return None

        if max_posts != 0:
            num_posts = min(num_posts, max_posts)

        all_posts = []

        while (len(all_posts) < num_posts):
            all_posts += self.get_json_data(pub_domain, min(100, num_posts - len(all_posts)), len(all_posts))['items']
            os.system("clear" if platform.system() == 'Linux' else "cls")
          #  print("Getting data from {0}:\n {1}/{2}".format(pub_domain, len(all_posts), num_posts))

        return all_posts

    def image_urls_from_json_post(self, json_post, min_timestamp=0):  # only photos
        # from latest to older memes order
        cur_timestamp = int(json_post['date'])
        if cur_timestamp <= min_timestamp:
            return None, 0
        urls = []
        try:
            for attachment in json_post['attachments']:
                if attachment['type'] == 'photo':
                    urls.append(attachment['photo']['sizes'][-1]['url'])  # best photo has id = -1
        except:
            pass

        return urls, cur_timestamp

    def get_all_photos_urls(self, pub_domain, max_photos=0, from_comments=False, min_timestamp=0):
        latest_timestamp = min_timestamp
        urls_from_posts = []
        urls_from_comments = []
        json_posts = self.get_all_json_data(pub_domain, max_photos)
        for post in json_posts:
            urls_from_this_post, cur_timestamp =\
                self.image_urls_from_json_post(post, min_timestamp=min_timestamp)

            if urls_from_this_post is None:
                continue

            if cur_timestamp > latest_timestamp:
                latest_timestamp = cur_timestamp

            urls_from_posts.extend(urls_from_this_post)

            if from_comments:
                urls_from_comments.extend(self.get_img_urls_from_comments(self.get_post_comments(post)))

        return urls_from_posts, urls_from_comments, latest_timestamp

    def get_most_liked_post(self, pub_domain, max_photos=0):
        json_posts = self.get_all_json_data(pub_domain, max_photos)

        best_post = json_posts[0]
        max_likes = int(json_posts[0]['likes']['count'])

        for post in json_posts:
            if (int(post['likes']['count']) > max_likes):
                max_likes = int(post['likes']['count'])
                best_post = post

        return (best_post, max_likes)

    def get_post_comments(self, post): # json post -> json
        comments = []

        def comments_request(post, count=100, offset=0): # -> json
            response = requests.get('https://api.vk.com/method/wall.getComments',
                                       params={
                                           'access_token': self.token,
                                           'v': self.version,
                                           'owner_id': post['owner_id'],
                                           'post_id': post['id'],
                                           'count': count,
                                           'offset': offset
                                       }).json()
            return response

        comments.extend(comments_request(post)['response']['items']) # first 100 comments

        return comments

    def get_img_urls_from_comments(self, comments): # json -> json
        imgs = []
        for comment in comments:
            try:
                imgs.append(comment['attachments'][0]['photo']['sizes'][-1]['url']) # only first and only photo
            except:
                pass
        return imgs