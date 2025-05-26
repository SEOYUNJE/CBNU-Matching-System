# moit/urls.py
import os
from django.contrib import admin
from django.urls import path, include

# 이미지 업로드
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # 추가 - 연동
    path('admin/', admin.site.urls),
    path('main/', include('main.urls')),
    path('search/', include('search.urls')),
    path('account/', include('account.urls')),
    path('meet/', include('meet.urls')),
    path('chat/', include('chat.urls')),
    path('profilepage/', include('profilepage.urls')),
    path('subpage/', include('subpage.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 추가
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))
