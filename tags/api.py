from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response

from memes.serializers import MemesSerializer
from tags.models import Tags
from tags.serializers import TagSerializer


class CreateNewTagAPI(generics.GenericAPIView):
    serializer_class = TagSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tag = serializer.save()
        return Response({
            "tag": TagSerializer(tag, context=self.get_serializer_context()).data,
        })


class TagsViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TagSerializer


class GetMemesByTagViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer

    def get_queryset(self):
        tag_id = self.request.GET.get('id')
        print(tag_id)
        return Tags.objects.get(pk=tag_id).taggedMemes.all()
