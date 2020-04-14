from rest_framework import serializers

from accounts.serializers import UserSerializer
from memes.models import Memes
from tags.serializers import TagSerializer


class MemesSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Memes
        fields = '__all__'
        depth = 1
