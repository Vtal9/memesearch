from rest_framework import routers
from .api import ProductViewSet

router = routers.DefaultRouter()
router.register('api/memes', ProductViewSet, 'memes')

urlpatterns = router.urls
