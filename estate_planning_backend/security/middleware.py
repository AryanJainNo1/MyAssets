from django.http import HttpResponseForbidden
import re
from django.conf import settings

class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check for suspicious patterns in request
        if self.contains_sql_injection(request):
            return HttpResponseForbidden("Suspicious request detected")

        response = self.get_response(request)

        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Content-Security-Policy'] = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
        
        return response

    def contains_sql_injection(self, request):
        sql_patterns = [
            r'(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)(\s|$)',
            r'(\s|^)(OR|AND)(\s+)(\d+|\'.*?\')(\s*)(=|>|<)(\s*)(\d+|\'.*?\')',
            r'--',
            r';(\s*)(\w+)(\s*)(=|>|<)',
        ]
        
        params = dict(request.GET.items())
        params.update(dict(request.POST.items()))
        
        for value in params.values():
            if isinstance(value, str):
                for pattern in sql_patterns:
                    if re.search(pattern, value, re.IGNORECASE):
                        return True
        return False 