from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
import openai
from django.conf import settings
from .models import Article, Video, AIRecommendation
from .serializers import ArticleSerializer, VideoSerializer, AIRecommendationSerializer

openai.api_key = settings.OPENAI_API_KEY

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Article.objects.filter(is_published=True)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)

        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )
        return queryset

class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Video.objects.filter(is_published=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

class AIRecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = AIRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIRecommendation.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        # Get user's assets and will data for context
        assets = request.user.asset_set.all()
        wills = request.user.will_set.all()

        # Prepare context for AI
        context = {
            'total_assets': assets.count(),
            'has_will': wills.exists(),
            'asset_types': list(assets.values_list('asset_type', flat=True).distinct()),
        }

        # Generate AI recommendation
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an estate planning assistant."},
                    {"role": "user", "content": f"Based on this user's profile: {context}, provide estate planning recommendations."}
                ]
            )
            
            recommendation = AIRecommendation.objects.create(
                user=request.user,
                content=response.choices[0].message.content,
                context=context
            )
            
            return Response(AIRecommendationSerializer(recommendation).data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 