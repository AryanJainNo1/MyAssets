from django.db import models
from django.contrib.auth.models import User
from assets.models import Asset

class Will(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('REVOKED', 'Revoked'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    executor = models.CharField(max_length=255)
    executor_contact = models.CharField(max_length=255)
    witness_1_name = models.CharField(max_length=255, blank=True)
    witness_1_signature = models.FileField(upload_to='signatures/', null=True, blank=True)
    witness_2_name = models.CharField(max_length=255, blank=True)
    witness_2_signature = models.FileField(upload_to='signatures/', null=True, blank=True)
    owner_signature = models.FileField(upload_to='signatures/', null=True, blank=True)
    signed_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class Beneficiary(models.Model):
    RELATIONSHIP_CHOICES = [
        ('SPOUSE', 'Spouse'),
        ('CHILD', 'Child'),
        ('PARENT', 'Parent'),
        ('SIBLING', 'Sibling'),
        ('FRIEND', 'Friend'),
        ('OTHER', 'Other'),
    ]

    will = models.ForeignKey(Will, related_name='beneficiaries', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    contact_info = models.CharField(max_length=255)
    percentage_share = models.DecimalField(max_digits=5, decimal_places=2)
    specific_assets = models.ManyToManyField(Asset, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.relationship}"

class WillDocument(models.Model):
    will = models.ForeignKey(Will, related_name='documents', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='will_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title 