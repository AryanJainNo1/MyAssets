from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):
    CATEGORY_CHOICES = [
        ('BASICS', 'Estate Planning Basics'),
        ('WILLS', 'Wills and Trusts'),
        ('TAXES', 'Estate Taxes'),
        ('INSURANCE', 'Life Insurance'),
        ('ASSETS', 'Asset Management'),
        ('LEGAL', 'Legal Considerations'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    thumbnail = models.ImageField(upload_to='article_thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    read_time = models.IntegerField(help_text='Estimated read time in minutes')

    def __str__(self):
        return self.title

class Video(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    thumbnail = models.ImageField(upload_to='video_thumbnails/', null=True, blank=True)
    duration = models.IntegerField(help_text='Duration in seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    category = models.CharField(max_length=20, choices=Article.CATEGORY_CHOICES)

    def __str__(self):
        return self.title

class AIRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    context = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_implemented = models.BooleanField(default=False)

    def __str__(self):
        return f"Recommendation for {self.user.username}" 