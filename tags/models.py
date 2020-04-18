from django.db import models


class Tags(models.Model):
    # ID
    id = models.AutoField(primary_key=True, unique=True)
    # строка название тега
    tag = models.TextField(blank=False, null=False, unique=True)
