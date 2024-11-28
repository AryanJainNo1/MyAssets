import time
from .models import PerformanceMetric
from .cloudwatch import CloudWatchHandler

class MonitoringMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.cloudwatch = CloudWatchHandler()

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = (time.time() - start_time) * 1000  # Convert to milliseconds

        # Record metric in database
        PerformanceMetric.objects.create(
            endpoint=request.path,
            response_time=duration,
            status_code=response.status_code,
            method=request.method
        )

        # Send metric to CloudWatch
        self.cloudwatch.put_metric(
            namespace='EstatePlanning',
            metric_name='ResponseTime',
            value=duration,
            unit='Milliseconds',
            dimensions=[
                {'Name': 'Endpoint', 'Value': request.path},
                {'Name': 'Method', 'Value': request.method},
            ]
        )

        return response 