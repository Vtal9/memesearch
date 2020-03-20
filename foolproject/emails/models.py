from django.db import models

# Create your models here.
class Emails(models.Model):
	id = models.AutoField(primary_key = True, unique = True)
	Email = models.TextField()

	def __toStr__(this):
		return this.Email