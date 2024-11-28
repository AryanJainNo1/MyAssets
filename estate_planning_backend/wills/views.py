from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Will, Beneficiary, WillDocument
from .serializers import WillSerializer, BeneficiarySerializer, WillDocumentSerializer

class WillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WillSerializer

    def get_queryset(self):
        return Will.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_beneficiary(self, request, pk=None):
        will = self.get_object()
        serializer = BeneficiarySerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(will=will)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        will = self.get_object()
        serializer = WillDocumentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(will=will)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        will = self.get_object()
        signature_type = request.data.get('type')
        signature_file = request.data.get('signature')
        
        if signature_type == 'owner':
            will.owner_signature = signature_file
        elif signature_type == 'witness1':
            will.witness_1_signature = signature_file
        elif signature_type == 'witness2':
            will.witness_2_signature = signature_file
        
        will.save()
        return Response(WillSerializer(will).data)

class BeneficiaryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BeneficiarySerializer

    def get_queryset(self):
        return Beneficiary.objects.filter(will__user=self.request.user) 