from django.urls import path
from .views import AnimalListAPIView

urlpatterns = [
    path('animals/', AnimalListAPIView.as_view(), name='animal-list'),
]