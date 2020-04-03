class MemeInfo:
    def __init__(self, url, img_text, img_descr):
        self.url = url
        self.img_text = img_text
        self.img_descr = img_descr

    def __str__(self):
        return "{0}, {1}, {2}".format(self.url, self.img_text, self.img_descr)


class IndexInfo:
    def __init__(self, text_words, descr_words):
        self.text_words = text_words
        self.descr_words = descr_words