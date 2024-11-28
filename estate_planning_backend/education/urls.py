from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, VideoViewSet, AIRecommendationViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'recommendations', AIRecommendationViewSet, basename='recommendation')

urlpatterns = [
    path('', include(router.urls)),
] 