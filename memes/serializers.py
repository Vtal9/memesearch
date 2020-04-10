from rest_framework import serializers

from accounts.serializers import UserSerializer
from memes.models import Memes


class MemesSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Memes
        fields = '__all__'
        depth = 1
