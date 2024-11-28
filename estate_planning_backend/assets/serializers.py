from rest_framework import serializers
from .models import Asset, AssetDocument

class AssetDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetDocument
        fields = ['id', 'name', 'file', 'uploaded_at', 'document_type']

class AssetSerializer(serializers.ModelSerializer):
    documents = AssetDocumentSerializer(many=True, read_only=True)
    asset_type_display = serializers.CharField(source='get_asset_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'asset_type', 'asset_type_display', 
            'value', 'date_acquired', 'status', 'status_display',
            'location', 'description', 'documents', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 