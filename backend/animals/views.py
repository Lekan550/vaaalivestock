from rest_framework import generics
from .models import Animal
from .serializers import AnimalSerializer


class AnimalListAPIView(generics.ListAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer