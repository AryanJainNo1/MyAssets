from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from .models import Asset, AssetDocument
from .serializers import AssetSerializer, AssetDocumentSerializer

class AssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AssetSerializer

    def get_queryset(self):
        queryset = Asset.objects.filter(user=self.request.user)
        asset_type = self.request.query_params.get('asset_type', None)
        status = self.request.query_params.get('status', None)
        
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        assets = self.get_queryset()
        total_value = assets.aggregate(total=Sum('value'))['total'] or 0
        by_type = assets.values('asset_type').annotate(
            total=Sum('value'),
            count=Count('id')
        )
        
        return Response({
            'total_value': total_value,
            'by_type': by_type,
            'total_count': assets.count()
        })

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        asset = self.get_object()
        file_serializer = AssetDocumentSerializer(data=request.data)
        
        if file_serializer.is_valid():
            document = file_serializer.save()
            asset.documents.add(document)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 