from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        read_only_fields = ['price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_email', 'customer_phone', 'customer_address', 'status', 'created_at', 'items']
        read_only_fields = ['status', 'created_at']