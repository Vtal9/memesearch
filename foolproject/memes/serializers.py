from rest_framework import serializers
from memes.models import Memes

class MemesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Memes
		fields = '__all__'
		