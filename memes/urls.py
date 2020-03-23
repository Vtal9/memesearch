from rest_framework import routers
from .api import MemesViewSet
from .api import UnMarkedMemesViewSet
from .api import MarkedMemesViewSet


router = routers.DefaultRouter()
router.register('api/memes', MemesViewSet, 'memes')
router.register('api/unmarkedmemes', UnMarkedMemesViewSet, 'unmarkedmemes')
router.register('api/markedmemes', MarkedMemesViewSet, 'markedmemes')
urlpatterns = router.urls
