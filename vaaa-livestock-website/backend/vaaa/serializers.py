# vaa/serializers.py
from rest_framework import serializers
from .models import Animal, Order, OrderItem

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'name', 'price', 'stock']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'price', 'unit', 'image']

class OrderItemSerializer(serializers.ModelSerializer):
    animal = AnimalSerializer(read_only=True)  # nested serializer

    class Meta:
        model = OrderItem
        fields = ['id', 'animal', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_email', 'created_at', 'items']
