from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .audit_models import AuditLog, DataAccessLog
from .audit_serializers import AuditLogSerializer, DataAccessLogSerializer
from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = AuditLog.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        action = self.request.query_params.get('action', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if action:
            queryset = queryset.filter(action=action)
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)

        return queryset

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        last_30_days = timezone.now() - timedelta(days=30)
        
        stats = {
            'total_actions': AuditLog.objects.count(),
            'actions_by_type': AuditLog.objects.values('action').annotate(count=Count('id')),
            'recent_activity': AuditLog.objects.filter(timestamp__gte=last_30_days).count(),
            'top_users': AuditLog.objects.values('user__username').annotate(count=Count('id'))[:5]
        }
        
        return Response(stats)

class DataAccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DataAccessLogSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = DataAccessLog.objects.all()

    @action(detail=False, methods=['get'])
    def performance_metrics(self, request):
        metrics = {
            'average_response_time': DataAccessLog.objects.aggregate(Avg('processing_time')),
            'endpoint_usage': DataAccessLog.objects.values('endpoint').annotate(count=Count('id')),
            'status_codes': DataAccessLog.objects.values('response_status').annotate(count=Count('id'))
        }
        
        return Response(metrics) 