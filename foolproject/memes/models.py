from django.db import models

# Create your models here.
class Memes(models.Model):
	#title = models.CharField(max_length=100)
	id = models.AutoField(primary_key = True, unique = True)
	image = models.ImageField()
	textDescription = models.TextField(blank = True, null = True)
	imageDescription = models.TextField(blank = True, null = True)


	def setImage(self, im):
		self.image = im
		return self.id

	def setTextDescription(self, descript):
		self.textDescription = descript
		return

	def setImageDescription(self, descript):
		self.imageDescription = descript
		return


	def getId(self):
		return self.id


	def __str__(self):
		return self.id

	def getTextDescriptionAsList(self):
		return self.textDescription.split(', ')

	def getImageDescriptionASList(self):
		return self.imageDescription.split(', ')

	def save(self, *args, **kwargs):
		super(Memes, self).save(*args, **kwargs) 
		return self.id
