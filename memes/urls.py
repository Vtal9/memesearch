from django.urls import path
from rest_framework import routers
from .api import OwnMemesViewSet, MemesViewSet, OwnMemesAPI, UpdateMemesAPI
from .api import UnMarkedMemesViewSet
from .api import MarkedMemesViewSet
from .api import NewURLMemesViewSet

router = routers.DefaultRouter()
router.register('api/memes', MemesViewSet, 'memes')
router.register('api/unmarkedmemes', UnMarkedMemesViewSet, 'unmarkedmemes')
router.register('api/markedmemes', MarkedMemesViewSet, 'markedmemes')
router.register('api/new_meme_url', NewURLMemesViewSet, 'newurl')
router.register('api/ownMemes', OwnMemesViewSet, 'ownMemes')
urlpatterns = router.urls
urlpatterns.append(path('api/configureOwnMemes', OwnMemesAPI.as_view()))
urlpatterns.append(path('api/updateMeme', UpdateMemesAPI.as_view()))
