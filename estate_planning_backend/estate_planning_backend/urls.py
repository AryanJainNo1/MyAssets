from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('assets.urls')),
    path('api/', include('wills.urls')),
    path('api/education/', include('education.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 