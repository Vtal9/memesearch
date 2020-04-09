from django.db import models
from django.contrib.auth.models import User


class Images(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)
    # owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="ownImages")

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
