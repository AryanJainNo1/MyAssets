from django.contrib.contenttypes.models import ContentType
from .audit_models import AuditLog
from django.core import serializers
import json

class AuditService:
    @staticmethod
    def log_action(user, action, instance, ip_address, user_agent, changes=None, notes=''):
        content_type = ContentType.objects.get_for_model(instance)
        
        # Convert model instance to JSON for changes
        if changes is None and action in ['CREATE', 'UPDATE']:
            changes = json.loads(serializers.serialize('json', [instance]))[0]['fields']

        AuditLog.objects.create(
            user=user,
            action=action,
            content_type=content_type,
            object_id=instance.id,
            ip_address=ip_address,
            user_agent=user_agent,
            changes=changes,
            notes=notes
        )

    @staticmethod
    def get_object_history(instance):
        content_type = ContentType.objects.get_for_model(instance)
        return AuditLog.objects.filter(
            content_type=content_type,
            object_id=instance.id
        )

    @staticmethod
    def get_user_activity(user, start_date=None, end_date=None):
        queryset = AuditLog.objects.filter(user=user)
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        return queryset 