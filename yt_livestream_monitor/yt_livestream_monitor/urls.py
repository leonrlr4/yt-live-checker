from django.contrib import admin
from django.urls import path, include
from monitor.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('monitor/', include('monitor.urls')),
    path('', home, name='home'),
]
