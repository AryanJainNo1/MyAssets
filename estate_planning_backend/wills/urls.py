from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WillViewSet, BeneficiaryViewSet

router = DefaultRouter()
router.register(r'wills', WillViewSet, basename='will')
router.register(r'beneficiaries', BeneficiaryViewSet, basename='beneficiary')

urlpatterns = [
    path('', include(router.urls)),
] 