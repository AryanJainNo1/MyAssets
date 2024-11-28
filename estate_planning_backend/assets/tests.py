from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Asset
from decimal import Decimal

class AssetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.asset_data = {
            'name': 'Test Asset',
            'asset_type': 'REAL_ESTATE',
            'value': '100000.00',
            'date_acquired': '2023-01-01',
            'location': 'Test Location',
            'description': 'Test Description'
        }
        
        self.asset = Asset.objects.create(
            user=self.user,
            **self.asset_data
        )

    def test_create_asset(self):
        response = self.client.post('/api/assets/', self.asset_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Asset.objects.count(), 2)

    def test_get_assets(self):
        response = self.client.get('/api/assets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_asset(self):
        update_data = {'value': '150000.00'}
        response = self.client.patch(f'/api/assets/{self.asset.id}/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.asset.refresh_from_db()
        self.assertEqual(self.asset.value, Decimal('150000.00'))

    def test_delete_asset(self):
        response = self.client.delete(f'/api/assets/{self.asset.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Asset.objects.count(), 0) 