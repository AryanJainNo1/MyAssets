from cryptography.fernet import Fernet
from django.conf import settings
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class FieldEncryption:
    def __init__(self):
        self.fernet = self._get_fernet()

    def _get_fernet(self):
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=settings.ENCRYPTION_SALT.encode(),
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(settings.SECRET_KEY.encode()))
        return Fernet(key)

    def encrypt(self, text):
        if not text:
            return text
        return self.fernet.encrypt(str(text).encode()).decode()

    def decrypt(self, encrypted_text):
        if not encrypted_text:
            return encrypted_text
        return self.fernet.decrypt(encrypted_text.encode()).decode() 