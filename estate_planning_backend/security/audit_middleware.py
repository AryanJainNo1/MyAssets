import time
from .audit_models import DataAccessLog
from django.utils.deprecation import MiddlewareMixin

class AuditMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            processing_time = (time.time() - request.start_time) * 1000  # Convert to milliseconds
            
            if hasattr(request, 'user') and request.user.is_authenticated:
                DataAccessLog.objects.create(
                    user=request.user,
                    ip_address=self.get_client_ip(request),
                    endpoint=request.path,
                    method=request.method,
                    response_status=response.status_code,
                    processing_time=processing_time
                )
        
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR') 