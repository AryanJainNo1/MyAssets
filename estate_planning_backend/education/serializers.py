from rest_framework import serializers
from .models import Article, Video, AIRecommendation

class ArticleSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'category', 'category_display',
            'author_name', 'thumbnail', 'created_at', 'read_time'
        ]

class VideoSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'url', 'thumbnail',
            'duration', 'category', 'category_display'
        ]

class AIRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRecommendation
        fields = ['id', 'content', 'context', 'created_at', 'is_implemented'] 