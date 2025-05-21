from django.contrib import admin
from django.urls import path, include

# 이미지 업로드
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', include('main.urls')),
    path('account/', include('account.urls')),
    path('meet/', include('meet.urls')),
    path('chat/', include('chat.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)