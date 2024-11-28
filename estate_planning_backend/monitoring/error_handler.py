import traceback
from .models import ErrorLog
from .cloudwatch import CloudWatchHandler

class ErrorHandler:
    def __init__(self):
        self.cloudwatch = CloudWatchHandler()

    def capture_exception(self, exc, request=None):
        error_data = {
            'level': 'ERROR',
            'message': str(exc),
            'traceback': traceback.format_exc(),
            'endpoint': request.path if request else None,
            'user_id': request.user.id if request and request.user.is_authenticated else None,
        }

        # Log to database
        ErrorLog.objects.create(**error_data)

        # Log to CloudWatch
        self.cloudwatch.log_error(error_data) 