from rest_framework import serializers
from memes.models import Memes
from .models import TextDescriptions
from .models import ImageDescriptions



class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Memes
        fields = ['id']


class TextDescriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextDescriptions
        fields = '__all__'


class ImagesDescriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageDescriptions
        fields = '__all__'


