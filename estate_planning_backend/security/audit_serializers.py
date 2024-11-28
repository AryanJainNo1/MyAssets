from rest_framework import serializers
from .audit_models import AuditLog, DataAccessLog

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    content_type = serializers.StringRelatedField()

    class Meta:
        model = AuditLog
        fields = '__all__'

class DataAccessLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = DataAccessLog
        fields = '__all__' 