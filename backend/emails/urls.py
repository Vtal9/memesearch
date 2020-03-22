from rest_framework import routers
from .api import EmailsViewSet

router = routers.DefaultRouter()
router.register('emails', EmailsViewSet, 'emails')
urlpatterns = router.urls
