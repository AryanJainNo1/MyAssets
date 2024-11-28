from django.db import models
from .encryption import FieldEncryption

class EncryptedFieldMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.encryption = FieldEncryption()

    def get_prep_value(self, value):
        if value is not None:
            return self.encryption.encrypt(value)
        return value

    def from_db_value(self, value, expression, connection):
        if value is not None:
            return self.encryption.decrypt(value)
        return value

class EncryptedTextField(EncryptedFieldMixin, models.TextField):
    pass

class EncryptedCharField(EncryptedFieldMixin, models.CharField):
    pass 