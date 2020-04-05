from rest_framework import routers
from .api import SearchAPI
from .api import TextDescriptionsViewSet
from .api import ImageDescriptionsViewSet
from django.urls import path

# router = routers.DefaultRouter()
# router.register('api/textDescriptions', TextDescriptionsViewSet, 'textDescriptions')
# router.register('api/imageDescriptions', ImageDescriptionsViewSet, 'imageDescriptions')
# router.register('api/search', SearchAPI.as_view(), 'searchMemes')
#
# urlpatterns = router.urls
# # urlpatterns.append(path('api/search', SearchAPI.as_view()))

urlpatterns = [
    path('api/search/', SearchAPI.as_view())
]
