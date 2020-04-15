from django.db import models


class Images(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)

    def __toStr__(self):
        return self.id


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
