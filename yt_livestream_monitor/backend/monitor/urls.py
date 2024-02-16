from django.urls import path
from .views import check_live_status

urlpatterns = [
    path('check/', check_live_status, name='check_live_status'),
]
