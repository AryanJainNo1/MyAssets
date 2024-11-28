from django.db import models
from django.contrib.auth.models import User

class Asset(models.Model):
    ASSET_TYPES = [
        ('REAL_ESTATE', 'Real Estate'),
        ('VEHICLE', 'Vehicle'),
        ('INVESTMENT', 'Investment'),
        ('BANK_ACCOUNT', 'Bank Account'),
        ('PERSONAL_PROPERTY', 'Personal Property'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('SOLD', 'Sold'),
        ('TRANSFERRED', 'Transferred'),
        ('DEPRECATED', 'Deprecated'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    date_acquired = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    documents = models.ManyToManyField('AssetDocument', blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class AssetDocument(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='asset_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_type = models.CharField(max_length=100)

    def __str__(self):
        return self.name 