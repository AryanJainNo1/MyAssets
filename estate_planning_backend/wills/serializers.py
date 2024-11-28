from rest_framework import serializers
from .models import Will, Beneficiary, WillDocument
from assets.serializers import AssetSerializer

class WillDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WillDocument
        fields = ['id', 'title', 'file', 'uploaded_at']

class BeneficiarySerializer(serializers.ModelSerializer):
    specific_assets = AssetSerializer(many=True, read_only=True)
    relationship_display = serializers.CharField(source='get_relationship_display', read_only=True)

    class Meta:
        model = Beneficiary
        fields = [
            'id', 'name', 'relationship', 'relationship_display',
            'contact_info', 'percentage_share', 'specific_assets', 'notes'
        ]

class WillSerializer(serializers.ModelSerializer):
    beneficiaries = BeneficiarySerializer(many=True, read_only=True)
    documents = WillDocumentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Will
        fields = [
            'id', 'title', 'status', 'status_display', 'executor',
            'executor_contact', 'witness_1_name', 'witness_1_signature',
            'witness_2_name', 'witness_2_signature', 'owner_signature',
            'signed_date', 'created_at', 'updated_at', 'notes',
            'beneficiaries', 'documents'
        ]
        read_only_fields = ['created_at', 'updated_at'] 