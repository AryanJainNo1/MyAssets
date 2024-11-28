import boto3
import json
from datetime import datetime
from django.conf import settings

class CloudWatchHandler:
    def __init__(self):
        self.client = boto3.client(
            'cloudwatch',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

    def put_metric(self, namespace, metric_name, value, unit, dimensions=None):
        metric_data = {
            'MetricName': metric_name,
            'Value': value,
            'Unit': unit,
            'Timestamp': datetime.utcnow(),
        }
        
        if dimensions:
            metric_data['Dimensions'] = dimensions

        self.client.put_metric_data(
            Namespace=namespace,
            MetricData=[metric_data]
        )

    def log_error(self, error_data):
        self.client.put_log_events(
            logGroupName=f"/estate-planning/{settings.ENVIRONMENT}",
            logStreamName="errors",
            logEvents=[{
                'timestamp': int(datetime.utcnow().timestamp() * 1000),
                'message': json.dumps(error_data)
            }]
        ) 