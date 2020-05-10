from django.urls import path
from rest_framework import routers

from .api import MarkedMemesViewSet, TinderAPI, MemesDownloadAPI
from .api import NewURLMemesViewSet
from .api import OwnMemesViewSet, MemesViewSet, OwnMemesAPI, UpdateMemesAPI, AddTagToMemeAPI, \
    LikingMemeAPI, WallAPI
from .api import UnMarkedMemesViewSet

router = routers.DefaultRouter()
router.register('api/memes', MemesViewSet, 'memes')
router.register('api/unmarkedmemes', UnMarkedMemesViewSet, 'unmarkedmemes')
router.register('api/markedmemes', MarkedMemesViewSet, 'markedmemes')
router.register('api/new_meme_url', NewURLMemesViewSet, 'newurl')
router.register('api/ownMemes', OwnMemesViewSet, 'ownMemes')
urlpatterns = router.urls
urlpatterns.append(path('api/configureOwnMemes', OwnMemesAPI.as_view()))
urlpatterns.append(path('api/updateMeme', UpdateMemesAPI.as_view()))
urlpatterns.append(path('api/addTag', AddTagToMemeAPI.as_view()))
urlpatterns.append(path('api/like', LikingMemeAPI.as_view()))
urlpatterns.append(path('api/wall', WallAPI.as_view()))
urlpatterns.append(path('api/tinder', TinderAPI.as_view()))
urlpatterns.append(path('api/download', MemesDownloadAPI.as_view()))
