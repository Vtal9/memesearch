from django.db import models
import yadisk
from django.db.models import F
import time
from django.conf import settings


# Create your models here.
class Memes(models.Model):
	id = models.AutoField(primary_key = True, unique = True)
	image = models.ImageField(blank = True, null = True)
	fileName = models.TextField(blank = True, null = True)
	url = models.URLField(blank = True, null = True, max_length = 500)
	textDescription = models.TextField(blank = True, null = True)
	imageDescription = models.TextField(blank = True, null = True)

	def save(self, *args, **kwargs):
		y = settings.Y
		name = self.image.url.split(".")
		self.fileName = ".".join(name[:-1]) + "_{}".format(time.time()) + "." + name[-1]
		y.upload(self.image, self.fileName)
		self.url = yadisk.functions.resources.get_download_link(y.get_session(), self.fileName)
		self.image = None

		super(Memes, self).save(*args, **kwargs) 
		if(self.id % 100 == 0):
			y.upload("db.sqlite3", "backup/db_{}.sqlite3".format(self.id))
