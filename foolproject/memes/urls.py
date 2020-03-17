from rest_framework import routers
from .api import MemesViewSet
from .api import UnMarkedMemesViewSet

router = routers.DefaultRouter()
router.register('api/memes', MemesViewSet, 'memes')
router.register('api/unmarkedmemes', UnMarkedMemesViewSet, 'unmarkedmemes')
urlpatterns = router.urls
