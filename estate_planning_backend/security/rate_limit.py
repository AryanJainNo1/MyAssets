from django.core.cache import cache
from django.http import HttpResponseTooManyRequests
from datetime import datetime, timedelta

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit = 100  # requests per minute
        self.window = 60  # seconds

    def __call__(self, request):
        if not request.path.startswith('/admin/'):  # Don't rate limit admin
            ip = self.get_client_ip(request)
            key = f'rate_limit:{ip}'
            
            # Get current requests count
            requests = cache.get(key, [])
            now = datetime.now()
            
            # Remove requests outside current window
            requests = [req for req in requests 
                      if req > now - timedelta(seconds=self.window)]
            
            if len(requests) >= self.rate_limit:
                return HttpResponseTooManyRequests("Rate limit exceeded")
            
            # Add current request
            requests.append(now)
            cache.set(key, requests, self.window)
        
        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR') 