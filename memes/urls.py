from rest_framework import routers
from .api import OwnMemesViewSet, MemesViewSet
from .api import UnMarkedMemesViewSet
from .api import MarkedMemesViewSet
from .api import NewURLMemesViewSet

router = routers.DefaultRouter()
router.register('api/memes', MemesViewSet, 'memes')
router.register('api/unmarkedmemes', UnMarkedMemesViewSet, 'unmarkedmemes')
router.register('api/markedmemes', MarkedMemesViewSet, 'markedmemes')
router.register('api/new_meme_url', NewURLMemesViewSet, 'newurl')
router.register('api/memes/own', OwnMemesViewSet, 'ownMemes')
urlpatterns = router.urls
