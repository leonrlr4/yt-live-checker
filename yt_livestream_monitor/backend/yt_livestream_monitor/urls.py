from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.contrib import admin

from monitor.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('monitor/', include('monitor.urls')),

    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
