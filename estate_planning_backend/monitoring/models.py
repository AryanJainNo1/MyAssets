from django.db import models

class PerformanceMetric(models.Model):
    endpoint = models.CharField(max_length=255)
    response_time = models.FloatField()
    status_code = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=10)

    class Meta:
        indexes = [
            models.Index(fields=['endpoint', 'timestamp']),
        ]

class ErrorLog(models.Model):
    ERROR_LEVELS = [
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]

    level = models.CharField(max_length=10, choices=ERROR_LEVELS)
    message = models.TextField()
    traceback = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    endpoint = models.CharField(max_length=255, null=True)
    user_id = models.IntegerField(null=True)

    class Meta:
        indexes = [
            models.Index(fields=['level', 'timestamp']),
        ] 