from django.db import models


class TextDescriptions(models.Model):
    word = models.TextField(unique=True)
    index = models.TextField()

    def __toStr__(self):
        return self.index


class ImageDescriptions(models.Model):
    word = models.TextField(unique=True)
    index = models.TextField()

    def __toStr__(self):
        return self.index
