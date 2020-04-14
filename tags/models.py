from django.db import models


class Tags(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    tag = models.TextField(blank=False, null=False, unique=True)
