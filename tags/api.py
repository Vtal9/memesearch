from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response

from memes.serializers import MemesSerializer
from tags.models import Tags
from tags.serializers import TagSerializer


# ViewSets

# get all tags
class TagsViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TagSerializer


# get tagged memes by tag ID
class GetMemesByTagViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MemesSerializer

    def get_queryset(self):
        tag_id = self.request.GET.get('id')
        print(tag_id)
        return Tags.objects.get(pk=tag_id).taggedMemes.all()


# APIs

# API for creating new tag
class CreateNewTagAPI(generics.GenericAPIView):
    serializer_class = TagSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tag = serializer.save()
        return Response({
            "tag": TagSerializer(tag, context=self.get_serializer_context()).data,
        })


class DeleteTagAPI(generics.GenericAPIView):
    serializer_class = TagSerializer

    def post(self, request, *args, **kwargs):
        tag_name = self.request.GET.get('tag')
        try:
            tag = Tags.objects.get(tag=tag_name)
            tag.delete()
            return Response("tag deleted successful")
        except:
            print("tag doesn't exist:", tag_name)
            return Response("tag doesn't exist")
